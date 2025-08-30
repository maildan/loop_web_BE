import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  findAll() {
    // For now, returning mock data. This should be implemented to fetch from DB.
    return [
      {
        id: '1',
        name: '1분기 마케팅 전략 회의록',
        type: 'google-docs',
        lastModified: new Date(new Date().setDate(new Date().getDate() - 1)),
        wordCount: 1250,
        readingTime: 6,
        content: '<h1>1분기 마케팅 전략 회의록</h1><p>참석자: 김부장, 이팀장, 박대리</p><h2>주요 논의 내용</h2><ul><li>소셜 미디어 캠페인 확장 방안</li><li>인플루언서 협업 계획</li><li>콘텐츠 마케팅 KPI 설정</li></ul>'
      },
      {
        id: '2',
        name: 'Loop-Cloud 신규 기능 기획서',
        type: 'notion',
        lastModified: new Date(new Date().setDate(new Date().getDate() - 3)),
        wordCount: 3420,
        readingTime: 17,
        content: '<h1>Loop-Cloud 신규 기능 기획</h1><h2>1. 실시간 동기화 기능</h2><p>Electron 앱과 웹 대시보드 간의 실시간 데이터 동기화를 구현합니다.</p><h2>2. 고급 분석 대시보드</h2><p>사용자의 글쓰기 패턴을 심층 분석하는 기능을 추가합니다.</p>'
      },
      {
        id: '3',
        name: '개발팀 주간 업무 보고 (Slack)',
        type: 'slack',
        lastModified: new Date(new Date().setDate(new Date().getDate() - 2)),
        wordCount: 850,
        readingTime: 4,
        content: '<h2>개발팀 주간 업무 보고</h2><p><b>완료 사항:</b> API 엔드포인트 구현</p><p><b>진행중:</b> 프론트엔드 UI 개선</p>'
      },
      {
        id: '4',
        name: '개인 메모 및 아이디어',
        type: 'other',
        lastModified: new Date(new Date().setDate(new Date().getDate() - 5)),
        wordCount: 2100,
        readingTime: 10,
        content: '<h3>차기 프로젝트 아이디어</h3><p>AI를 활용한 자동 글 요약 기능은 어떨까?</p>'
      }
    ];
  }
}
