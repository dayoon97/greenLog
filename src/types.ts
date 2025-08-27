// 다이어리 기록 하나의 데이터 구조
export interface DiaryEntry {
  id: string; // 고유 ID
  date: string; // 날짜 (형식: YYYY-MM-DD)
  activities: string[]; // 활동 태그 배열 (예: ["물주기", "잎정리"])
  memo?: string; // 상세 메모
  photoUri?: string; // 사진 URI
}
