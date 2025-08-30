import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class StatsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getDashboardStats(userId: string) {
    const pool = this.databaseService.getPool();

    // Note: The 'documents' table is assumed to have 'user_id', 'word_count', 'created_at', and 'type' columns.
    // These queries will fail if the schema is different.

    const totalDocsQuery = pool.query('SELECT COUNT(*) FROM documents WHERE user_id = $1', [userId]);
    const totalWordsQuery = pool.query('SELECT SUM(word_count) FROM documents WHERE user_id = $1', [userId]);

    const weeklyDataQuery = pool.query(`
      SELECT 
        TO_CHAR(d, 'Dy') as name,
        COALESCE(COUNT(docs.id), 0) as documents,
        COALESCE(SUM(docs.word_count), 0) as words
      FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') d
      LEFT JOIN documents docs ON DATE_TRUNC('day', docs.created_at) = d AND docs.user_id = $1
      GROUP BY d
      ORDER BY d;
    `, [userId]);

    const typeDistributionQuery = pool.query(`
      SELECT type as name, COUNT(*) as value FROM documents WHERE user_id = $1 GROUP BY type
    `, [userId]);

    const [totalDocsRes, totalWordsRes, weeklyDataRes, typeDistributionRes] = await Promise.all([
      totalDocsQuery,
      totalWordsQuery,
      weeklyDataQuery,
      typeDistributionQuery,
    ]);

    const totalDocuments = parseInt(totalDocsRes.rows[0].count, 10) || 0;
    const totalWords = parseInt(totalWordsRes.rows[0].sum, 10) || 0;
    const totalReadingTime = totalWords > 0 ? Math.round(totalWords / 200) : 0;
    const avgWordsPerDoc = totalDocuments > 0 ? Math.round(totalWords / totalDocuments) : 0;

    const typeColors: Record<string, string> = {
      'google-docs': '#4285F4',
      'notion': '#E8E8E8',
      'slack': '#ECB3FF',
      'other': '#D0D0D0',
    };

    const typeDistribution = typeDistributionRes.rows.map(row => ({
      ...row,
      value: parseInt(row.value, 10),
      color: typeColors[row.name] || '#D0D0D0',
    }));

    return {
      totalDocuments,
      totalWords,
      totalReadingTime,
      avgWordsPerDoc,
      weeklyData: weeklyDataRes.rows.map(r => ({ ...r, documents: parseInt(r.documents), words: parseInt(r.words) })),
      typeDistribution,
    };
  }
}
