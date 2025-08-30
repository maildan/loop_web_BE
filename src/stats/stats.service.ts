import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  getDashboardStats() {
    // For now, returning mock data. This should be implemented to fetch from DB.
    return {
      totalDocuments: 125,
      totalWords: 123456,
      totalReadingTime: 617, // (123456 words / 200 wpm)
      avgWordsPerDoc: 987, // (123456 words / 125 docs)
      weeklyData: [
        { name: 'Mon', documents: 5, words: 2400 },
        { name: 'Tue', documents: 3, words: 1500 },
        { name: 'Wed', documents: 6, words: 3000 },
        { name: 'Thu', documents: 8, words: 4000 },
        { name: 'Fri', documents: 5, words: 2500 },
        { name: 'Sat', documents: 7, words: 3500 },
        { name: 'Sun', documents: 2, words: 1000 },
      ],
      typeDistribution: [
        { name: 'google-docs', value: 45, color: '#4285F4' },
        { name: 'notion', value: 30, color: '#E8E8E8' },
        { name: 'slack', value: 25, color: '#ECB3FF' },
        { name: 'other', value: 25, color: '#D0D0D0' },
      ],
    };
  }
}
