import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  findAll() {
    // For now, returning mock data. This should be implemented to fetch from DB.
    return [
      {
        id: '1',
        name: 'Meeting Notes',
        type: 'Google Docs',
        lastModified: new Date().toISOString(),
        wordCount: 1200,
        readingTime: 6,
        sharedWith: ['Alice', 'Bob'],
        content: 'This is the content of the meeting notes.',
      },
      {
        id: '2',
        name: 'Project Proposal',
        type: 'Notion',
        lastModified: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        wordCount: 2500,
        readingTime: 12,
        sharedWith: ['Charlie'],
        content: 'This is the content of the project proposal.',
      },
    ];
  }
}
