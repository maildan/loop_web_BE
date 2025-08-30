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
    const { id: googleId, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;
    const profilePictureUrl = photos?.[0]?.value;

    if (!email) {
      throw new Error('Email not found in Google profile');
    }

    let userResult = await pool.query('SELECT * FROM "users" WHERE "googleId" = $1', [googleId]);

    if (userResult.rows.length === 0) {
      // 사용자가 없으면 새로 생성
      userResult = await pool.query(
        'INSERT INTO "users" ("googleId", "email", "name", "profilePictureUrl") VALUES ($1, $2, $3, $4) RETURNING *',
        [googleId, email, displayName, profilePictureUrl],
      );
    } else {
      // 사용자가 있으면 이름과 프로필 사진 업데이트
      userResult = await pool.query(
        'UPDATE "users" SET "name" = $1, "profilePictureUrl" = $2, "updatedAt" = NOW() WHERE "googleId" = $3 RETURNING *',
        [displayName, profilePictureUrl, googleId],
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

