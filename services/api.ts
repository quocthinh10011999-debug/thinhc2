
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
            rank TEXT,
            position TEXT,
            hometown TEXT,
            squad TEXT,
            platoon TEXT,
            soldier_unit TEXT NOT NULL,
            status TEXT NOT NULL,
            description TEXT,
            family_context TEXT,
            officer_note TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await sql`CREATE TABLE IF NOT EXISTS registrations (id SERIAL PRIMARY KEY, visitor_name TEXT, id_number TEXT, phone_number TEXT, soldier_name TEXT, soldier_unit TEXT, relationship TEXT, visit_date TEXT, visit_time TEXT, status TEXT DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
        await sql`CREATE TABLE IF NOT EXISTS feedbacks (id SERIAL PRIMARY KEY, author TEXT, content TEXT, date TEXT, response TEXT, status TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
        await sql`CREATE TABLE IF NOT EXISTS theme_settings (key TEXT PRIMARY KEY, config JSONB, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
        await sql`CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, full_name TEXT NOT NULL, role TEXT NOT NULL, password TEXT DEFAULT '123', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
        await sql`CREATE TABLE IF NOT EXISTS background_music (id SERIAL PRIMARY KEY, title TEXT NOT NULL, url TEXT NOT NULL, is_active BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;

        await sql`INSERT INTO users (username, full_name, role, password) VALUES ('admin', 'Sĩ quan Trực ban', 'admin', 'admin123') ON CONFLICT (username) DO NOTHING;`;
        
        this.schemaInitialized = true;
      } catch (error) {
        console.error("Schema initialization failed:", error);
        throw error;
      }
    })();

    return this.initializingPromise;
  }

  async getUsers() {
    await this.ensureSchema();
    return await sql`SELECT username, full_name as "fullName", role FROM users ORDER BY created_at DESC`;
  }

  async createUser(user: any) {
    await this.ensureSchema();
    return await sql`INSERT INTO users (username, full_name, role) VALUES (${user.username}, ${user.fullName}, ${user.role})`;
  }

  async deleteUser(username: string) {
    await this.ensureSchema();
    return await sql`DELETE FROM users WHERE username = ${username}`;
  }

  async getIdeologyLogs() {
    await this.ensureSchema();
    const rows = await sql`SELECT *, updated_at as "lastUpdated" FROM ideology_logs ORDER BY updated_at DESC`;
    return rows.map(r => ({
      ...r,
      id: r.id.toString(),
      soldierName: r.soldier_name,
      soldierUnit: r.soldier_unit,
      hometown: r.hometown,
      familyContext: r.family_context,
      officerNote: r.officer_note,
      lastUpdated: r.updated_at.toLocaleString('vi-VN')
    }));
  }

  async createIdeologyLog(data: any) {
    await this.ensureSchema();
    return await sql`
      INSERT INTO ideology_logs (soldier_name, rank, position, hometown, squad, platoon, soldier_unit, status, description, family_context, officer_note)
      VALUES (${data.soldierName}, ${data.rank}, ${data.position}, ${data.hometown}, ${data.squad}, ${data.platoon}, ${data.soldierUnit}, ${data.status}, ${data.description}, ${data.familyContext}, ${data.officerNote})
    `;
  }

  async updateIdeologyLog(id: string, data: any) {
    await this.ensureSchema();
    return await sql`
      UPDATE ideology_logs 
      SET soldier_name = ${data.soldierName}, 
          rank = ${data.rank},
          position = ${data.position},
          hometown = ${data.hometown},
          squad = ${data.squad},
          platoon = ${data.platoon},
          soldier_unit = ${data.soldierUnit}, 
          status = ${data.status}, 
          description = ${data.description}, 
          family_context = ${data.familyContext}, 
          officer_note = ${data.officerNote},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
    `;
  }

  async deleteIdeologyLog(id: string) {
    await this.ensureSchema();
    return await sql`DELETE FROM ideology_logs WHERE id = ${parseInt(id)}`;
  }

  async getMusic() { 
    await this.ensureSchema(); 
    return (await sql`SELECT * FROM background_music ORDER BY created_at DESC`).map(r => ({id: r.id.toString(), title: r.title, url: r.url, isActive: r.is_active})); 
  }

  async addMusic(title: string, url: string) {
    await this.ensureSchema();
    return await sql`INSERT INTO background_music (title, url) VALUES (${title}, ${url})`;
  }

  async setActiveMusic(id: string) {
    await this.ensureSchema();
    await sql`UPDATE background_music SET is_active = FALSE`;
    return await sql`UPDATE background_music SET is_active = TRUE WHERE id = ${parseInt(id)}`;
  }

  async deleteMusic(id: string) {
    await this.ensureSchema();
    return await sql`DELETE FROM background_music WHERE id = ${parseInt(id)}`;
  }

  async getRegistrations() { 
    await this.ensureSchema(); 
    return (await sql`SELECT * FROM registrations ORDER BY created_at DESC`).map(r => ({
      id: r.id.toString(),
      visitorName: r.visitor_name,
      idNumber: r.id_number,
      phoneNumber: r.phone_number,
      soldierName: r.soldier_name,
      soldierUnit: r.soldier_unit,
      relationship: r.relationship,
      visitDate: r.visit_date,
      visitTime: r.visit_time,
      status: r.status,
      created_at: r.created_at
    })); 
  }

  async createRegistration(data: any) {
    await this.ensureSchema();
    const result = await sql`
      INSERT INTO registrations (visitor_name, id_number, phone_number, soldier_name, soldier_unit, relationship, visit_date, visit_time, status)
      VALUES (${data.visitorName}, ${data.idNumber}, ${data.phoneNumber}, ${data.soldierName}, ${data.soldierUnit}, ${data.relationship}, ${data.visitDate}, ${data.visitTime}, 'pending')
      RETURNING id
    `;
    return { id: result[0].id.toString() };
  }

  async updateRegistration(id: string, data: any) {
    await this.ensureSchema();
    return await sql`UPDATE registrations SET status = ${data.status} WHERE id = ${parseInt(id)}`;
  }

  async deleteRegistration(id: string) {
    await this.ensureSchema();
    return await sql`DELETE FROM registrations WHERE id = ${parseInt(id)}`;
  }

  async getFeedbacks() { 
    await this.ensureSchema(); 
    return (await sql`SELECT * FROM feedbacks ORDER BY created_at DESC`).map(r => ({...r, id: r.id.toString()})); 
  }

  async createFeedback(data: any) {
    await this.ensureSchema();
    return await sql`INSERT INTO feedbacks (author, content, date, response, status) VALUES (${data.author}, ${data.content}, ${data.date}, ${data.response}, ${data.status})`;
  }

  async updateFeedback(id: string, data: any) {
    await this.ensureSchema();
    return await sql`UPDATE feedbacks SET response = ${data.response}, status = ${data.status} WHERE id = ${parseInt(id)}`;
  }

  async deleteFeedback(id: string) {
    await this.ensureSchema();
    return await sql`DELETE FROM feedbacks WHERE id = ${parseInt(id)}`;
  }

  async getThemeConfig() { 
    await this.ensureSchema(); 
    const rows = await sql`SELECT config FROM theme_settings WHERE key = 'global'`; 
    return rows.length > 0 ? rows[0].config : null; 
  }

  async saveThemeConfig(config: any) { 
    await this.ensureSchema(); 
    return await sql`INSERT INTO theme_settings (key, config) VALUES ('global', ${config}) ON CONFLICT (key) DO UPDATE SET config = ${config}`; 
  }
}

export const api = new ApiService();
