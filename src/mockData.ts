import { DiaryEntry } from './types';

// 앱 실행 시 보여줄 초기 데이터
export const MOCK_DIARIES: DiaryEntry[] = [
  {
    id: '1',
    date: '2025-08-15',
    activities: ['물주기', '해충방제'],
    memo: '몬스테라 잎에 응애가 보여서 약을 쳤다.',
    photoUri:
      'https://images.unsplash.com/photo-1591656338573-036f04a75d99?w=500',
  },
  {
    id: '2',
    date: '2025-08-26',
    activities: ['분갈이'],
    memo: '화분이 너무 작아져서 큰 집으로 이사시켜 줌.',
    photoUri:
      'https://images.unsplash.com/photo-1509423350717-c73936a9e0a6?w=500',
  },
];
