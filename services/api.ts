
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
        await sql`
          CREATE TABLE IF NOT EXISTS news (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            summary TEXT NOT NULL,
            content TEXT NOT NULL,
            image_url TEXT,
            source_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        await sql`ALTER TABLE news ADD COLUMN IF NOT EXISTS source_url TEXT`;

        await sql`INSERT INTO users (username, full_name, role, password) VALUES ('admin', 'Sĩ quan Trực ban', 'admin', 'admin123') ON CONFLICT (username) DO NOTHING`;

        // Seeding dữ liệu mẫu cho News
        const newsCount = await sql`SELECT count(*) FROM news`;
        if (parseInt(newsCount[0].count) === 0) {
          await sql`
            INSERT INTO news (title, category, summary, content, image_url) VALUES 
            (
              'Tiểu đoàn 15 hoàn thành xuất sắc đợt kiểm tra bắn đạn thật SPG-9',
              'Huấn luyện',
              'Đợt bắn đạn thật hoàn thành 100% chỉ tiêu đề ra, bảo đảm an toàn tuyệt đối về người và vũ khí trang bị kỹ thuật.',
              'Nhằm đánh giá thực chất kết quả huấn luyện kỹ, chiến thuật bài bắn đạn thật súng chống tăng SPG-9, Tiểu đoàn 15 đã tổ chức đợt diễn tập kiểm tra bắn chiến đấu cấp tiểu đội và trung đội tại trường bắn Quân khu. Nhờ làm tốt công tác chuẩn bị vũ khí, khí tài và quán triệt nghiêm quy định an toàn, 100% cán bộ, chiến sĩ tham gia bắn đạt yêu cầu, trong đó có hơn 85% đạt Khá và Giỏi. Chỉ huy Sư đoàn đã biểu dương tinh thần chủ động khắc phục khó khăn, làm chủ vũ khí trang bị mới của toàn đơn vị.',
              'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1579913741617-3844a30a213a?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
            ),
            (
              'Đoàn thanh niên Tiểu đoàn phát động Tháng thi đua cao điểm Quyết thắng',
              'Học tập',
              'Đoàn cơ sở phát động đợt thi đua sôi nổi lập thành tích chào mừng ngày thành lập lực lượng vũ trang nhân dân.',
              'Sáng nay, Ban Chấp hành Đoàn cơ sở Tiểu đoàn 15 đã phát động phong trào thi đua cao điểm với chủ đề "Tuổi trẻ Tiểu đoàn 15 xung kích, lập công, tô thắm truyền thống truyền thống quyết thắng". Nội dung thi đua tập trung vào việc nâng cao giờ tự học chính trị, nâng cao thể lực qua các hội thao thể dục thể thao, và xây dựng cảnh quan môi trường đơn vị sáng - xanh - sạch - đẹp. Toàn bộ 100% chi đoàn đã ký kết giao ước thi đua với quyết tâm giành nhiều "Bông hoa điểm 10" dâng lên Đảng bộ đơn vị.',
              'https://images.unsplash.com/photo-1579913741617-3844a30a213a?auto=format&fit=crop&q=80&w=800'
            ),
            (
              'Đại hội Quân nhân nhiệm kỳ mới: Đẩy mạnh đối thoại dân chủ ở cơ sở',
              'Chính trị',
              'Hội nghị phát huy tinh thần dân chủ, thảo luận sâu sắc về các chế độ chính sách và nâng cao đời sống chiến sĩ.',
              'Chiều ngày 18/07, Tiểu đoàn 15 đã tiến hành Đại hội Quân nhân nhiệm kỳ 2026-2027 thành công tốt đẹp. Đại hội ghi nhận nhiều ý kiến đóng góp tâm huyết, thẳng thắn của các chiến sĩ hạ sĩ quan về công tác huấn luyện, bảo đảm hậu cần, đời sống tinh thần và chế độ trực gác. Phát biểu tại Đại hội, Chỉ huy trưởng nhấn mạnh tinh thần dân chủ là chìa khóa để tạo nên khối đoàn kết thống nhất cao, giúp chiến sĩ coi đơn vị là nhà, đồng chí đồng đội là anh em ruột thịt, sẵn sàng nhận và hoàn thành mọi nhiệm vụ được giao.',
              'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
            )
          `;
        }
        
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

  // --- NEWS API ---
  async getNews() {
    await this.ensureSchema();
    const rows = await sql`SELECT id::text as id, title, category, summary, content, image_url as "imageUrl", source_url as "sourceUrl", created_at as "createdAt" FROM news ORDER BY created_at DESC`;
    return rows;
  }

  async createNews(data: any) {
    await this.ensureSchema();
    return await sql`INSERT INTO news (title, category, summary, content, image_url, source_url) VALUES (${data.title}, ${data.category}, ${data.summary}, ${data.content}, ${data.imageUrl || null}, ${data.sourceUrl || null}) RETURNING id::text as id`;
  }

  async deleteNews(id: string) {
    await this.ensureSchema();
    return await sql`DELETE FROM news WHERE id = ${parseInt(id)}`;
  }
}

export const api = new ApiService();
