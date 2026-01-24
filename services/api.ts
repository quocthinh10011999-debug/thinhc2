
import { neon } from '@neondatabase/serverless';

// Kết nối chính xác theo yêu cầu của người dùng
const DATABASE_URL = 'postgresql://neondb_owner:npg_0gkecK7nTboz@ep-twilight-wildflower-a1yabv5u-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);

class ApiService {
  /**
   * Khởi tạo toàn bộ cấu trúc bảng cần thiết cho hệ thống
   */
  async ensureSchema() {
    try {
      // 1. Bảng Tư tưởng
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
        );
      `;
      // 2. Bảng Đăng ký thăm
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
        );
      `;
      // 3. Bảng Phản hồi
      await sql`
        CREATE TABLE IF NOT EXISTS feedbacks (
          id SERIAL PRIMARY KEY,
          author TEXT,
          content TEXT,
          date TEXT,
          response TEXT,
          status TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      // 4. Bảng Cấu hình giao diện
      await sql`
        CREATE TABLE IF NOT EXISTS theme_settings (
          key TEXT PRIMARY KEY,
          config JSONB,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      // 5. Bảng Tài khoản (Mới)
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          username TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          role TEXT NOT NULL,
          password TEXT DEFAULT '123',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      // Chèn admin mặc định nếu chưa có
      await sql`
        INSERT INTO users (username, full_name, role, password)
        VALUES ('admin', 'Sĩ quan Trực ban', 'admin', 'admin123')
        ON CONFLICT (username) DO NOTHING;
      `;
    } catch (error) {
      console.error("Schema initialization failed:", error);
    }
  }

  // --- QUẢN LÝ TÀI KHOẢN (POSTGRES) ---
  async getUsers() {
    return await sql`SELECT username, full_name as "fullName", role FROM users ORDER BY created_at ASC`;
  }

  async createUser(user: any) {
    return await sql`
      INSERT INTO users (username, full_name, role)
      VALUES (${user.username}, ${user.fullName}, ${user.role})
      RETURNING username, full_name as "fullName", role
    `;
  }

  async deleteUser(username: string) {
    return await sql`DELETE FROM users WHERE username = ${username} AND username != 'admin'`;
  }

  // --- QUẢN LÝ TƯ TƯỞNG ---
  async createIdeologyLog(data: any) {
    const result = await sql`
      INSERT INTO ideology_logs (soldier_name, soldier_unit, status, description, family_context, officer_note)
      VALUES (${data.soldierName}, ${data.soldierUnit}, ${data.status}, ${data.description}, ${data.familyContext}, ${data.officerNote})
      RETURNING id, soldier_name as "soldierName", soldier_unit as "soldierUnit", status, description, updated_at as "lastUpdated"
    `;
    return result[0];
  }

  async getIdeologyLogs() {
    const rows = await sql`SELECT *, updated_at as "lastUpdated" FROM ideology_logs ORDER BY updated_at DESC`;
    return rows.map(r => ({
      ...r,
      id: r.id.toString(),
      soldierName: r.soldier_name,
      soldierUnit: r.soldier_unit,
      lastUpdated: r.updated_at.toLocaleString('vi-VN')
    }));
  }

  // --- QUẢN LÝ ĐĂNG KÝ ---
  async createRegistration(data: any) {
    const result = await sql`
      INSERT INTO registrations (visitor_name, id_number, phone_number, soldier_name, soldier_unit, relationship, visit_date, visit_time)
      VALUES (${data.visitorName}, ${data.idNumber}, ${data.phoneNumber}, ${data.soldierName}, ${data.soldierUnit}, ${data.relationship}, ${data.visitDate}, ${data.visitTime})
      RETURNING *
    `;
    return result[0];
  }

  async getRegistrations() {
    const rows = await sql`SELECT * FROM registrations ORDER BY created_at DESC`;
    return rows.map(r => ({
      ...r,
      id: r.id.toString(),
      visitorName: r.visitor_name,
      idNumber: r.id_number,
      phoneNumber: r.phone_number,
      soldierName: r.soldier_name,
      soldierUnit: r.soldier_unit,
    }));
  }

  async updateRegistration(id: string, data: any) {
    return await sql`UPDATE registrations SET status = ${data.status} WHERE id = ${parseInt(id)}`;
  }

  async deleteRegistration(id: string) {
    return await sql`DELETE FROM registrations WHERE id = ${parseInt(id)}`;
  }

  // --- QUẢN LÝ PHẢN HỒI ---
  async createFeedback(data: any) {
    return await sql`
      INSERT INTO feedbacks (author, content, date, response, status)
      VALUES (${data.author}, ${data.content}, ${data.date}, ${data.response}, ${data.status})
    `;
  }

  async getFeedbacks() {
    const rows = await sql`SELECT * FROM feedbacks ORDER BY created_at DESC`;
    return rows.map(r => ({ ...r, id: r.id.toString() }));
  }

  // --- CẤU HÌNH GIAO DIỆN ---
  async getThemeConfig() {
    const rows = await sql`SELECT config FROM theme_settings WHERE key = 'global'`;
    return rows.length > 0 ? rows[0].config : null;
  }

  async saveThemeConfig(config: any) {
    return await sql`
      INSERT INTO theme_settings (key, config) 
      VALUES ('global', ${config})
      ON CONFLICT (key) DO UPDATE SET config = ${config}, updated_at = CURRENT_TIMESTAMP
    `;
  }
}

export const api = new ApiService();
