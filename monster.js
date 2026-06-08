// ─── MONSTER ──────────────────────────────────────────────
// 몬스터 생성, 이동, 위치 계산을 담당합니다.
// 새 몬스터 종류를 추가하려면 spawnMonster()를 확장하세요.

function spawnMonster() {
  const hp = state.level;
  state.monsters.push({
    id: state.nextMonsterId++,
    pathIdx: 0,
    t: 0,
    hp,
    maxHp: hp,
    speed: CONFIG.MONSTER_BASE_SPEED + state.level * CONFIG.MONSTER_SPEED_SCALE,
    dead: false,
  });
  state.totalSpawned++;
}

/** 현재 프레임에서의 몬스터 캔버스 좌표 */
function getMonsterPos(m) {
  const idx = m.pathIdx % PATH_CELLS.length;
  const next = (m.pathIdx + 1) % PATH_CELLS.length;
  const a = cellToCanvas(...PATH_CELLS[idx]);
  const b = cellToCanvas(...PATH_CELLS[next]);
  return {
    x: a.x + (b.x - a.x) * m.t,
    y: a.y + (b.y - a.y) * m.t,
  };
}

/**
 * 예측 조준용 — n프레임 후 몬스터가 있을 위치를 계산
 * turret.js의 발사 로직에서 사용합니다.
 */
function getPredictedMonsterPos(m, frames) {
  let pathIdx = m.pathIdx;
  let t = m.t + m.speed * frames;
  while (t >= 1) {
    t -= 1;
    pathIdx = (pathIdx + 1) % PATH_CELLS.length;
  }
  const idx = pathIdx % PATH_CELLS.length;
  const next = (pathIdx + 1) % PATH_CELLS.length;
  const a = cellToCanvas(...PATH_CELLS[idx]);
  const b = cellToCanvas(...PATH_CELLS[next]);
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

/** 매 프레임 몬스터 이동 업데이트 */
function updateMonsters() {
  state.monsters.forEach(m => {
    if (m.dead) return;
    m.t += m.speed;
    if (m.t >= 1) {
      m.t -= 1;
      m.pathIdx = (m.pathIdx + 1) % PATH_CELLS.length;
    }
  });
  // 죽은 몬스터 제거
  state.monsters = state.monsters.filter(m => !m.dead);
}
