// ─── STATE ────────────────────────────────────────────────
// 게임 전체 상태를 한 곳에서 관리합니다.

const state = {
  gold: CONFIG.START_GOLD,
  level: 1,
  turrets: {},       // key: "col,row"  value: { col, row, cooldown }
  monsters: [],
  bullets: [],
  running: false,
  frame: 0,
  spawnTimer: 0,
  killCount: 0,
  totalGoldEarned: CONFIG.START_GOLD,
  totalSpawned: 0,
  gameOver: false,
  nextMonsterId: 0,
  rafId: null,
};

function resetState() {
  state.gold = CONFIG.START_GOLD;
  state.turrets = {};
  state.monsters = [];
  state.bullets = [];
  state.running = false;
  state.frame = 0;
  state.spawnTimer = 0;
  state.killCount = 0;
  state.totalGoldEarned = CONFIG.START_GOLD;
  state.totalSpawned = 0;
  state.gameOver = false;
  state.nextMonsterId = 0;
  // level은 리셋하지 않음 (UI에서 선택한 값 유지)
}
