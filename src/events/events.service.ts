import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EventsService {
  constructor(private db: DatabaseService) {}

  async findForUser(userId: string) {
    const pool = this.db.getPool();
    const result = await pool.query(
      'SELECT * FROM "events" WHERE "userId" = $1 ORDER BY "ts" DESC LIMIT 100',
      [userId],
    );
    return result.rows;
  }

  async createEvent(userId: string, eventData: any): Promise<any> {
    const pool = this.db.getPool();
    // Assuming eventData has timestamp, type, and payload
    const { timestamp, type, payload } = eventData;
    const result = await pool.query(
      'INSERT INTO "events" ("userId", "timestamp", "type", "payload") VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, timestamp, type, JSON.stringify(payload)],
    );
    return result.rows[0];
  }
}
