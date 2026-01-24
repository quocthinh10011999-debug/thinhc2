
import { neon } from '@neondatabase/serverless';

/**
 * Ưu tiên lấy URL từ biến môi trường để bảo mật khi up lên GitHub
 * Nếu không có biến môi trường (trong môi trường preview), sử dụng URL mặc định
 */
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_0gkecK7nTboz@ep-twilight-wildflower-a1yabv5u-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

/**
 * Service quản lý dữ liệu sử dụng PostgreSQL
 */
class ApiService {
  /**
   * Khởi tạo bảng nếu chưa tồn tại
   */
  async ensureSchema() {
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
        );
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
        );
      `;
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
      await sql`
        CREATE TABLE IF NOT EXISTS theme_settings (
          key TEXT PRIMARY KEY,
          config JSONB,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
    } catch (error) {
      console.error("Schema setup error:", error);
    }
  }

  async createIdeologyLog(data: any) {
    try {
      const result = await sql`
        INSERT INTO ideology_logs (soldier_name, soldier_unit, status, description, family_context, officer_note)
        VALUES (${data.soldierName}, ${data.soldierUnit}, ${data.status}, ${data.description}, ${data.familyContext}, ${data.officerNote})
        RETURNING *
      `;
      return { 
        ...result[0], 
        soldierName: result[0].soldier_name, 
        soldierUnit: result[0].soldier_unit,
        familyContext: result[0].family_context,
        officerNote: result[0].officer_note,
        lastUpdated: result[0].updated_at
      };
    } catch (error) {
      console.error("Postgres error:", error);
      throw error;
    }
  }

  async getIdeologyLogs() {
    try {
      const rows = await sql`SELECT * FROM ideology_logs ORDER BY updated_at DESC`;
      return rows.map(r => ({
        id: r.id.toString(),
        soldierName: r.soldier_name,
        soldierUnit: r.soldier_unit,
        status: r.status,
        description: r.description,
        familyContext: r.family_context,
        officerNote: r.officer_note,
        lastUpdated: r.updated_at.toLocaleString('vi-VN')
      }));
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  }

  async createRegistration(data: any) {
    try {
      const result = await sql`
        INSERT INTO registrations (visitor_name, id_number, phone_number, soldier_name, soldier_unit, relationship, visit_date, visit_time)
        VALUES (${data.visitorName}, ${data.idNumber}, ${data.phoneNumber}, ${data.soldierName}, ${data.soldierUnit}, ${data.relationship}, ${data.visitDate}, ${data.visitTime})
        RETURNING *
      `;
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  async getRegistrations() {
    try {
      const rows = await sql`SELECT * FROM registrations ORDER BY created_at DESC`;
      return rows.map(r => ({
        id: r.id.toString(),
        visitorName: r.visitor_name,
        idNumber: r.id_number,
        phoneNumber: r.phone_number,
        soldierName: r.soldier_name,
        soldierUnit: r.soldier_unit,
        relationship: r.relationship,
        visitDate: r.visit_date,
        visitTime: r.visit_time,
        status: r.status
      }));
    } catch (error) {
      return [];
    }
  }

  async updateRegistration(id: string, data: any) {
    try {
      await sql`
        UPDATE registrations 
        SET status = ${data.status} 
        WHERE id = ${parseInt(id)}
      `;
    } catch (error) {
      throw error;
    }
  }

  async createFeedback(data: any) {
    try {
      await sql`
        INSERT INTO feedbacks (author, content, date, response, status)
        VALUES (${data.author}, ${data.content}, ${data.date}, ${data.response}, ${data.status})
      `;
    } catch (error) {
      throw error;
    }
  }

  async getFeedbacks() {
    try {
      const rows = await sql`SELECT * FROM feedbacks ORDER BY created_at DESC`;
      return rows.map(r => ({
        id: r.id.toString(),
        author: r.author,
        content: r.content,
        date: r.date,
        response: r.response,
        status: r.status
      }));
    } catch (error) {
      return [];
    }
  }

  async getThemeConfig() {
    try {
      const rows = await sql`SELECT config FROM theme_settings WHERE key = 'global'`;
      return rows.length > 0 ? rows[0].config : null;
    } catch (error) {
      return null;
    }
  }

  async saveThemeConfig(config: any) {
    try {
      await sql`
        INSERT INTO theme_settings (key, config) 
        VALUES ('global', ${config})
        ON CONFLICT (key) DO UPDATE SET config = ${config}, updated_at = CURRENT_TIMESTAMP
      `;
    } catch (error) {
      console.error("Save config error:", error);
    }
  }
}

export const api = new ApiService();
