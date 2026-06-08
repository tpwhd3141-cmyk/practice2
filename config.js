// ─── CONFIG ───────────────────────────────────────────────
// 게임 밸런스를 손보려면 여기만 수정하면 됩니다.

const CONFIG = {
  // 그리드
  GRID: 5,           // 터렛 설치 가능 영역 크기
  CELL: 56,          // 셀 픽셀 크기
  OUTER: 2,          // 경로용 외곽 셀 수
  PADDING: 20,       // 캔버스 여백

  // 터렛
  TURRET_RANGE: 56 * 2.2,   // 공격 사거리
  TURRET_FIRE_RATE: 60,     // 발사 쿨다운 (프레임)
  TURRET_COST: 1,            // 설치 비용

  // 총알
  BULLET_SPEED: 18,          // 탄속
  BULLET_HIT_RADIUS: 14,     // 명중 판정 반경

  // 몬스터
  SPAWN_INTERVAL: 90,        // 스폰 간격 (프레임)
  MAX_MONSTERS: 100,         // 이 수 이상이면 게임오버
  MONSTER_BASE_SPEED: 0.008, // 기본 이동속도
  MONSTER_SPEED_SCALE: 0.0003, // 레벨당 속도 증가량

  // 경제
  START_GOLD: 1,             // 시작 골드
  GOLD_PER_KILL: null,       // null이면 레벨과 동일 (monster.js 참고)
};

// 파생 상수 (수정 불필요)
CONFIG.TOTAL = CONFIG.GRID + CONFIG.OUTER * 2;
CONFIG.W = CONFIG.TOTAL * CONFIG.CELL + CONFIG.PADDING * 2;
CONFIG.H = CONFIG.TOTAL * CONFIG.CELL + CONFIG.PADDING * 2;
