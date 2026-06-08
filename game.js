// ─── GAME ─────────────────────────────────────────────────
// 게임 루프, HUD 업데이트, 입력 처리, 게임오버를 담당합니다.

// ── 게임 루프 ─────────────────────────────────────────────
function gameLoop() {
  if (!state.running || state.gameOver) return;
  state.frame++;
  update();
  render();
  state.rafId = requestAnimationFrame(gameLoop);
}

function update() {
  // 몬스터 스폰
  state.spawnTimer--;
  if (state.spawnTimer <= 0) {
    spawnMonster();
    state.spawnTimer = CONFIG.SPAWN_INTERVAL;
  }

  updateMonsters();
  updateTurrets();
  updateBullets();

  // 게임오버 조건
  if (state.monsters.length >= CONFIG.MAX_MONSTERS) {
    triggerGameOver();
    return;
  }

  updateHUD();
}

// ── HUD ───────────────────────────────────────────────────
function updateHUD() {
  document.getElementById('goldDisplay').textContent = state.gold;
  document.getElementById('monsterCount').textContent = state.monsters.length;
  document.getElementById('killCount').textContent = state.killCount;
  document.getElementById('waveDisplay').textContent = state.totalSpawned;
}

// ── 캔버스 클릭 (터렛 설치/철거) ─────────────────────────
canvas.addEventListener('click', e => {
  if (!state.running || state.gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (CONFIG.W / rect.width);
  const my = (e.clientY - rect.top) * (CONFIG.H / rect.height);
  const col = Math.floor((mx - CONFIG.PADDING) / CONFIG.CELL);
  const row = Math.floor((my - CONFIG.PADDING) / CONFIG.CELL);

  // 그리드 범위 밖이면 무시
  if (col < CONFIG.OUTER || col >= CONFIG.OUTER + CONFIG.GRID) return;
  if (row < CONFIG.OUTER || row >= CONFIG.OUTER + CONFIG.GRID) return;

  const key = `${col},${row}`;
  if (state.turrets[key]) {
    removeTurret(col, row);
  } else {
    const ok = placeTurret(col, row);
    if (!ok) {
      showInfoMessage('골드 부족!');
      return;
    }
  }
  updateHUD();
  render();
});

function showInfoMessage(msg) {
  const bar = document.getElementById('infoBar');
  bar.textContent = msg;
  setTimeout(() => {
    bar.textContent = '그리드 클릭 → 터렛 설치 (비용: 1골드) | 터렛 재클릭 → 철거 (50% 환불)';
  }, 1500);
}

// ── 컨트롤 버튼 ───────────────────────────────────────────
document.getElementById('lvUp').addEventListener('click', () => {
  state.level++;
  document.getElementById('levelDisplay').textContent = state.level;
});

document.getElementById('lvDown').addEventListener('click', () => {
  if (state.level > 1) {
    state.level--;
    document.getElementById('levelDisplay').textContent = state.level;
  }
});

document.getElementById('startBtn').addEventListener('click', () => {
  if (state.running) return;
  state.running = true;
  document.getElementById('startBtn').textContent = '▶ RUNNING';
  document.getElementById('startBtn').disabled = true;
  state.spawnTimer = 30;
  gameLoop();
});

document.getElementById('resetBtn').addEventListener('click', resetGame);

// ── 리셋 ──────────────────────────────────────────────────
function resetGame() {
  cancelAnimationFrame(state.rafId);
  resetState();
  document.getElementById('gameOverOverlay').classList.remove('show');
  document.getElementById('startBtn').textContent = '▶ START';
  document.getElementById('startBtn').disabled = false;
  document.getElementById('waveDisplay').textContent = '0';
  document.getElementById('levelDisplay').textContent = state.level;
  updateHUD();
  render();
}

// ── 게임오버 ──────────────────────────────────────────────
function triggerGameOver() {
  state.running = false;
  state.gameOver = true;
  document.getElementById('finalKills').textContent = state.killCount;
  document.getElementById('finalGold').textContent = state.totalGoldEarned;
  document.getElementById('finalTurrets').textContent = Object.keys(state.turrets).length;
  document.getElementById('gameOverOverlay').classList.add('show');
}

// ── 초기 렌더 ─────────────────────────────────────────────
updateHUD();
render();
