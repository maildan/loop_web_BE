import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { User } from '../users/entities/user.entity';
import { Profile } from 'passport-google-oauth20';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findOrCreateUser(profile: Profile): Promise<User> {
    const pool = this.databaseService.getPool();
    const { id: googleId, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;
    const name = displayName;
    const profilePictureUrl = photos?.[0]?.value;

    if (!email) {
      throw new Error('Email not found in Google profile');
    }

    // Check if user exists
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      // Create user if not exists
      userResult = await pool.query(
        'INSERT INTO users (google_id, email, name, profile_picture_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [googleId, email, name, profilePictureUrl],
      );
    }

    return userResult.rows[0];
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}

