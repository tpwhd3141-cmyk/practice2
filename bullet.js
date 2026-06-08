// ─── BULLET ───────────────────────────────────────────────
// 총알 이동, 경계 이탈, 충돌 판정, 피해 적용을 담당합니다.
// 관통탄/폭발탄 같은 특수 탄종을 추가하려면 여기를 수정하세요.

/** 매 프레임 모든 총알 업데이트 */
function updateBullets() {
  state.bullets = state.bullets.filter(b => {
    // 이동
    b.x += b.vx;
    b.y += b.vy;

    // 화면 밖 제거
    if (b.x < 0 || b.x > CONFIG.W || b.y < 0 || b.y > CONFIG.H) return false;

    // 타겟 몬스터 찾기
    const target = state.monsters.find(m => m.id === b.targetId && !m.dead);
    if (!target) return false; // 타겟 소멸 → 총알 제거

    // 명중 판정
    const pos = getMonsterPos(target);
    const dx = pos.x - b.x, dy = pos.y - b.y;
    if (Math.sqrt(dx * dx + dy * dy) < CONFIG.BULLET_HIT_RADIUS) {
      applyDamage(target, b.dmg);
      return false; // 명중 → 총알 제거
    }

    return true; // 계속 비행
  });
}

/** 몬스터에게 피해를 입히고 처치 시 보상 지급 */
function applyDamage(monster, dmg) {
  monster.hp -= dmg;
  if (monster.hp <= 0) {
    monster.dead = true;
    const reward = CONFIG.GOLD_PER_KILL ?? state.level;
    state.gold += reward;
    state.totalGoldEarned += reward;
    state.killCount++;
  }
}
