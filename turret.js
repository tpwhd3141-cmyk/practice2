// ─── TURRET ───────────────────────────────────────────────
// 터렛 설치, 철거, 조준, 발사를 담당합니다.
// 터렛 종류를 추가하거나 업그레이드 시스템을 달려면 여기를 수정하세요.

/** 터렛 설치 */
function placeTurret(col, row) {
  if (state.gold < CONFIG.TURRET_COST) return false;
  const key = `${col},${row}`;
  state.gold -= CONFIG.TURRET_COST;
  state.turrets[key] = { col, row, cooldown: 0 };
  return true;
}

/** 터렛 철거 (50% 환불) */
function removeTurret(col, row) {
  const key = `${col},${row}`;
  if (!state.turrets[key]) return;
  const refund = Math.floor(CONFIG.TURRET_COST / 2) || 0;
  state.gold += refund;
  delete state.turrets[key];
}

/** 매 프레임 모든 터렛 쿨다운 처리 + 발사 */
function updateTurrets() {
  Object.values(state.turrets).forEach(t => {
    t.cooldown = (t.cooldown || 0) - 1;
    if (t.cooldown > 0) return;

    const tPos = cellToCanvas(t.col, t.row);
    const target = findTarget(tPos);
    if (!target) return;

    fireBullet(tPos, target);
    t.cooldown = CONFIG.TURRET_FIRE_RATE;
  });
}

/** 사거리 내에서 가장 가까운 몬스터를 찾아 반환 */
function findTarget(tPos) {
  let target = null;
  let bestDist = Infinity;
  state.monsters.forEach(m => {
    if (m.dead) return;
    const mPos = getMonsterPos(m);
    const dx = mPos.x - tPos.x, dy = mPos.y - tPos.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < CONFIG.TURRET_RANGE && d < bestDist) {
      bestDist = d;
      target = m;
    }
  });
  return target;
}

/** 예측 조준 총알 생성 */
function fireBullet(tPos, target) {
  const mPos = getMonsterPos(target);
  const dist = Math.sqrt((mPos.x - tPos.x) ** 2 + (mPos.y - tPos.y) ** 2);
  const travelFrames = Math.round(dist / CONFIG.BULLET_SPEED);
  const aimPos = getPredictedMonsterPos(target, travelFrames);

  const dx = aimPos.x - tPos.x, dy = aimPos.y - tPos.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  state.bullets.push({
    x: tPos.x, y: tPos.y,
    vx: (dx / len) * CONFIG.BULLET_SPEED,
    vy: (dy / len) * CONFIG.BULLET_SPEED,
    targetId: target.id,
    dmg: 1,
  });
}
