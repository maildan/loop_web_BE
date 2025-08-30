import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  getDashboardStats() {
    // For now, returning mock data. This should be implemented to fetch from DB.
    return {
      totalDocuments: 125,
      wordsThisMonth: 45000,
      newDocumentsThisWeek: 5,
    };
  }
}
