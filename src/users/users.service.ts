import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string) {
    const pool = this.databaseService.getPool();
    const { rows } = await pool.query('SELECT id, email, name, "profilePictureUrl" FROM "users" WHERE email = $1', [email]);
    return rows[0];
  }
}
