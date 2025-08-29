import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findOrCreateUser(profile: any): Promise<any> {
    const pool = this.databaseService.getPool();
    const { id: googleId, displayName, emails } = profile;
    const email = emails[0].value;

    let userResult = await pool.query('SELECT * FROM "users" WHERE "googleId" = $1', [googleId]);

    if (userResult.rows.length === 0) {
      userResult = await pool.query(
        'INSERT INTO "users" ("googleId", "email", "name", "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
        [googleId, email, displayName],
      );
    }

    return userResult.rows[0];
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

