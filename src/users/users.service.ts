import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserGoalsDto } from './dto/update-user-goals.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string) {
    const pool = this.databaseService.getPool();
    const { rows } = await pool.query(
      'SELECT id, email, name, "profilePictureUrl", "goal_weekly_docs", "goal_monthly_words" FROM "users" WHERE email = $1',
      [email],
    );
    const user = rows[0];
    if (!user) return null;

    return {
      ...user,
      goal_weekly_docs: user.goal_weekly_docs || 0,
      goal_monthly_words: user.goal_monthly_words || 0,
    };
  }

  async updateGoals(email: string, updateUserGoalsDto: UpdateUserGoalsDto) {
    const { weeklyDocs, monthlyWords } = updateUserGoalsDto;
    const pool = this.databaseService.getPool();
    const { rows } = await pool.query(
      'UPDATE "users" SET "goal_weekly_docs" = $1, "goal_monthly_words" = $2 WHERE email = $3 RETURNING id, "goal_weekly_docs", "goal_monthly_words"',
      [weeklyDocs, monthlyWords, email],
    );
    return rows[0];
  }
}
