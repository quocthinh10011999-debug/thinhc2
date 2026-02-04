
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = (process.env as any).DATABASE_URL || 
                     (process.env as any).VITE_DATABASE_URL || 
                     'postgresql://neondb_owner:npg_0gkecK7nTboz@ep-twilight-wildflower-a1yabv5u-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(DATABASE_URL);

class ApiService {
  private schemaInitialized = false;
  private initializingPromise: Promise<void> | null = null;

  async ensureSchema() {
    if (this.schemaInitialized) return;
    
    if (this.initializingPromise) {
      return this.initializingPromise;
    }

    this.initializingPromise = (async () => {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS ideology_logs (
            id SERIAL PRIMARY KEY,
            soldier_name TEXT NOT NULL,
            soldier_unit TEXT NOT NULL,
            status TEXT NOT NULL,
            description TEXT,
            family_context TEXT,
            officer_note TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS quiz_sets (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            time_minutes INTEGER DEFAULT 15,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS quiz_questions (
            id SERIAL PRIMARY KEY,
            set_id INTEGER REFERENCES quiz_sets(id) ON DELETE CASCADE,
            question_text TEXT NOT NULL,
            options JSONB NOT NULL,
            correct_index INTEGER NOT NULL
          )
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS quiz_scores (
            id SERIAL PRIMARY KEY,
            user_name TEXT NOT NULL,
            unit TEXT,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            set_id INTEGER REFERENCES quiz_sets(id) ON DELETE SET NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS registrations (
            id SERIAL PRIMARY KEY,
            visitor_name TEXT NOT NULL,
            id_number TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            soldier_name TEXT NOT NULL,
            soldier_unit TEXT NOT NULL,
            relationship TEXT,
            visit_date TEXT,
            visit_time TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        await sql`CREATE TABLE IF NOT EXISTS feedbacks (id SERIAL PRIMARY KEY, author TEXT, content TEXT, date TEXT, response TEXT, status TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
        await sql`CREATE TABLE IF NOT EXISTS theme_settings (key TEXT PRIMARY KEY, config JSONB, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
        await sql`CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, full_name TEXT NOT NULL, role TEXT NOT NULL, password TEXT DEFAULT '123', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
        await sql`CREATE TABLE IF NOT EXISTS background_music (id SERIAL PRIMARY KEY, title TEXT NOT NULL, url TEXT NOT NULL, is_active BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;

        await sql`INSERT INTO users (username, full_name, role, password) VALUES ('admin', 'Sĩ quan Trực ban', 'admin', 'admin123') ON CONFLICT (username) DO NOTHING`;
        
        // Seeding dữ liệu mẫu cho Quiz
        const setsCount = await sql`SELECT count(*) FROM quiz_sets`;
        if (parseInt(setsCount[0].count) === 0) {
          // ... (Dữ liệu seeding giữ nguyên như trước để đảm bảo tính sẵn sàng)
          const set1 = await sql`INSERT INTO quiz_sets (title, description, time_minutes) VALUES ('Luật Nghĩa vụ Quân sự 2015', 'Kiến thức cơ bản về quyền và nghĩa vụ của công dân đối với Tổ quốc.', 10) RETURNING id`;
          const s1Id = set1[0].id;
          await sql`INSERT INTO quiz_questions (set_id, question_text, options, correct_index) VALUES 
            (${s1Id}, 'Độ tuổi gọi nhập ngũ trong thời bình của công dân là bao nhiêu?', '["Từ đủ 18 đến hết 25 tuổi", "Từ đủ 18 đến hết 27 tuổi", "Từ đủ 17 đến hết 25 tuổi", "Từ đủ 20 đến hết 27 tuổi"]', 0),
            (${s1Id}, 'Thời hạn phục vụ tại ngũ trong thời bình của hạ sĩ quan, binh sĩ là bao nhiêu tháng?', '["12 tháng", "18 tháng", "24 tháng", "36 tháng"]', 2)`;
        }

        this.schemaInitialized = true;
      } catch (error) {
        console.error("Schema initialization failed:", error);
        throw error;
      }
    })();

    return this.initializingPromise;
  }

  // --- QUIZ API ---
  async getQuizSets() {
    await this.ensureSchema();
    const rows = await sql`SELECT *, id::text as id, time_minutes as "timeMinutes", created_at as "createdAt" FROM quiz_sets ORDER BY created_at DESC`;
    return rows;
  }

  async createQuizSet(data: any) {
    await this.ensureSchema();
    return await sql`INSERT INTO quiz_sets (title, description, time_minutes) VALUES (${data.title}, ${data.description}, ${data.timeMinutes}) RETURNING id::text as id`;
  }

  async deleteQuizSet(id: string) {
    await this.ensureSchema();
    // Xóa liên hoàn đảm bảo không còn dữ liệu rác
    await sql`DELETE FROM quiz_questions WHERE set_id = ${parseInt(id)}`;
    return await sql`DELETE FROM quiz_sets WHERE id = ${parseInt(id)}`;
  }

  async getQuestions(setId: string) {
    await this.ensureSchema();
    const rows = await sql`SELECT id::text as id, set_id::text as "setId", question_text as "questionText", options, correct_index as "correctIndex" FROM quiz_questions WHERE set_id = ${parseInt(setId)}`;
    return rows;
  }

  async createQuestion(data: any) {
    await this.ensureSchema();
    return await sql`INSERT INTO quiz_questions (set_id, question_text, options, correct_index) VALUES (${parseInt(data.setId)}, ${data.questionText}, ${JSON.stringify(data.options)}, ${data.correctIndex})`;
  }

  async createQuestionsBatch(setId: string, questions: any[]) {
    await this.ensureSchema();
    const sid = parseInt(setId);
    for (const q of questions) {
      await sql`INSERT INTO quiz_questions (set_id, question_text, options, correct_index) VALUES (${sid}, ${q.questionText}, ${JSON.stringify(q.options)}, ${q.correctIndex})`;
    }
  }

  async deleteQuestion(id: string) {
    await this.ensureSchema();
    return await sql`DELETE FROM quiz_questions WHERE id = ${parseInt(id)}`;
  }

  async submitScore(data: any) {
    await this.ensureSchema();
    return await sql`INSERT INTO quiz_scores (user_name, unit, score, total, set_id) VALUES (${data.userName}, ${data.unit}, ${data.score}, ${data.total}, ${parseInt(data.setId)})`;
  }

  async getScores() {
    await this.ensureSchema();
    const rows = await sql`
      SELECT s.id::text as id, s.user_name as "userName", s.unit, s.score, s.total, s.completed_at as "completedAt", q.title as "setTitle"
      FROM quiz_scores s
      LEFT JOIN quiz_sets q ON s.set_id = q.id
      ORDER BY s.completed_at DESC
      LIMIT 100
    `;
    return rows;
  }

  // --- EXISTING API ---
  async getMusic() { await this.ensureSchema(); const rows = await sql`SELECT * FROM background_music ORDER BY created_at DESC`; return rows.map(r => ({ id: r.id.toString(), title: r.title, url: r.url, isActive: r.is_active })); }
  async addMusic(title: string, url: string) { await this.ensureSchema(); return await sql`INSERT INTO background_music (title, url) VALUES (${title}, ${url}) RETURNING id`; }
  async deleteMusic(id: string) { await this.ensureSchema(); return await sql`DELETE FROM background_music WHERE id = ${parseInt(id)}`; }
  async setActiveMusic(id: string) { await this.ensureSchema(); await sql`UPDATE background_music SET is_active = FALSE`; return await sql`UPDATE background_music SET is_active = TRUE WHERE id = ${parseInt(id)}`; }
  async getUsers() { await this.ensureSchema(); return await sql`SELECT username, full_name as "fullName", role FROM users ORDER BY created_at ASC`; }
  async createUser(user: any) { await this.ensureSchema(); return await sql`INSERT INTO users (username, full_name, role) VALUES (${user.username}, ${user.fullName}, ${user.role})`; }
  async deleteUser(username: string) { await this.ensureSchema(); return await sql`DELETE FROM users WHERE username = ${username} AND username != 'admin'`; }
  async createIdeologyLog(data: any) { await this.ensureSchema(); return await sql`INSERT INTO ideology_logs (soldier_name, soldier_unit, status, description, family_context, officer_note) VALUES (${data.soldierName}, ${data.soldierUnit}, ${data.status}, ${data.description}, ${data.familyContext}, ${data.officerNote}) RETURNING *`; }
  async getIdeologyLogs() { await this.ensureSchema(); const rows = await sql`SELECT *, updated_at as "lastUpdated" FROM ideology_logs ORDER BY updated_at DESC`; return rows.map(r => ({ ...r, id: r.id.toString(), soldierName: r.soldier_name, soldierUnit: r.soldier_unit, lastUpdated: r.updated_at.toLocaleString('vi-VN') })); }
  async createRegistration(data: any) { await this.ensureSchema(); return await sql`INSERT INTO registrations (visitor_name, id_number, phone_number, soldier_name, soldier_unit, relationship, visit_date, visit_time) VALUES (${data.visitorName}, ${data.idNumber}, ${data.phoneNumber}, ${data.soldierName}, ${data.soldierUnit}, ${data.relationship}, ${data.visitDate}, ${data.visitTime}) RETURNING *`; }
  async getRegistrations() { await this.ensureSchema(); const rows = await sql`SELECT * FROM registrations ORDER BY created_at DESC`; return rows.map(r => ({ ...r, id: r.id.toString(), visitorName: r.visitor_name, idNumber: r.id_number, phoneNumber: r.phone_number, soldierName: r.soldier_name, soldier_unit: r.soldier_unit })); }
  async updateRegistration(id: string, data: any) { await this.ensureSchema(); return await sql`UPDATE registrations SET status = ${data.status} WHERE id = ${parseInt(id)}`; }
  async deleteRegistration(id: string) { await this.ensureSchema(); return await sql`DELETE FROM registrations WHERE id = ${parseInt(id)}`; }
  async createFeedback(data: any) { await this.ensureSchema(); return await sql`INSERT INTO feedbacks (author, content, date, response, status) VALUES (${data.author}, ${data.content}, ${data.date}, ${data.response}, ${data.status})`; }
  async getFeedbacks() { await this.ensureSchema(); const rows = await sql`SELECT * FROM feedbacks ORDER BY created_at DESC`; return rows.map(r => ({ ...r, id: r.id.toString() })); }
  async getThemeConfig() { await this.ensureSchema(); const rows = await sql`SELECT config FROM theme_settings WHERE key = 'global'`; return rows.length > 0 ? rows[0].config : null; }
  async saveThemeConfig(config: any) { await this.ensureSchema(); return await sql`INSERT INTO theme_settings (key, config) VALUES ('global', ${config}) ON CONFLICT (key) DO UPDATE SET config = ${config}, updated_at = CURRENT_TIMESTAMP`; }
}

export const api = new ApiService();
