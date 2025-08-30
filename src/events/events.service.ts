import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(private db: DatabaseService) {}

  async findForUser(userId: string): Promise<Event[]> {
    const pool = this.db.getPool();
    const result = await pool.query('SELECT * FROM events WHERE user_id = $1', [userId]);
    return result.rows;
  }

  async createEvent(userId: string, eventData: CreateEventDto): Promise<Event> {
    const pool = this.db.getPool();
    const { timestamp, type, payload } = eventData;
    const result = await pool.query(
      'INSERT INTO events (user_id, timestamp, type, payload) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, timestamp, type, JSON.stringify(payload)],
    );
    return result.rows[0];
  }
}
