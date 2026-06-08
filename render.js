// ─── RENDER ───────────────────────────────────────────────
// 캔버스 렌더링 전담 모듈입니다.
// 비주얼/이펙트를 바꾸려면 여기를 수정하세요.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.W;
canvas.height = CONFIG.H;

function render() {
  ctx.clearRect(0, 0, CONFIG.W, CONFIG.H);

  drawBackground();
  drawPath();
  drawGrid();
  drawTurretRanges();
  drawBullets();
  drawMonsters();
  drawWarning();
}

// ── 배경 ──────────────────────────────────────────────────
function drawBackground() {
  ctx.fillStyle = '#0a0c10';
  ctx.fillRect(0, 0, CONFIG.W, CONFIG.H);
}

// ── 경로 ──────────────────────────────────────────────────
function drawPath() {
  // 경로 셀 배경
  PATH_CELLS.forEach(([c, r]) => {
    const x = CONFIG.PADDING + c * CONFIG.CELL;
    const y = CONFIG.PADDING + r * CONFIG.CELL;
    ctx.fillStyle = '#0d1a28';
    ctx.fillRect(x + 1, y + 1, CONFIG.CELL - 2, CONFIG.CELL - 2);
    ctx.strokeStyle = '#131f2e';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x + 1, y + 1, CONFIG.CELL - 2, CONFIG.CELL - 2);
  });

  // 방향 화살표
  ctx.fillStyle = 'rgba(0,212,255,0.15)';
  ctx.font = '10px Share Tech Mono';
  PATH_CELLS.forEach(([c, r], i) => {
    if (i % 6 !== 0) return;
    const next = PATH_CELLS[(i + 1) % PATH_CELLS.length];
    const dx = next[0] - c, dy = next[1] - r;
    const arrow = dx > 0 ? '→' : dx < 0 ? '←' : dy > 0 ? '↓' : '↑';
    const px = cellToCanvas(c, r);
    ctx.fillText(arrow, px.x - 5, px.y + 4);
  });

  // 스폰 포인트 표시
  const spawnCell = cellToCanvas(...PATH_CELLS[0]);
  ctx.fillStyle = 'rgba(255,107,53,0.3)';
  ctx.beginPath();
  ctx.arc(spawnCell.x, spawnCell.y, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ff6b35';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#ff6b35';
  ctx.font = 'bold 9px Share Tech Mono';
  ctx.textAlign = 'center';
  ctx.fillText('IN', spawnCell.x, spawnCell.y + 3);
  ctx.textAlign = 'left';
}

// ── 그리드 (터렛 설치 영역) ───────────────────────────────
function drawGrid() {
  const { OUTER, GRID, CELL, PADDING } = CONFIG;
  for (let r = OUTER; r < OUTER + GRID; r++) {
    for (let c = OUTER; c < OUTER + GRID; c++) {
      const x = PADDING + c * CELL;
      const y = PADDING + r * CELL;
      const key = `${c},${r}`;
      if (state.turrets[key]) {
        drawTurret(x, y, state.turrets[key]);
      } else {
        drawEmptyCell(x, y);
      }
    }
  }
}

function drawEmptyCell(x, y) {
  ctx.fillStyle = '#0e1a22';
  ctx.fillRect(x + 1, y + 1, CONFIG.CELL - 2, CONFIG.CELL - 2);
  ctx.strokeStyle = '#1a2e3e';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 1, y + 1, CONFIG.CELL - 2, CONFIG.CELL - 2);
  ctx.fillStyle = '#1e3040';
  ctx.font = '18px Share Tech Mono';
  ctx.textAlign = 'center';
  ctx.fillText('+', x + CONFIG.CELL / 2, y + CONFIG.CELL / 2 + 7);
  ctx.textAlign = 'left';
}

function drawTurret(x, y, t) {
  const cx = x + CONFIG.CELL / 2, cy = y + CONFIG.CELL / 2;
  ctx.shadowColor = '#00d4ff';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#0a2030';
  ctx.fillRect(x + 2, y + 2, CONFIG.CELL - 4, CONFIG.CELL - 4);

  // 외곽 링
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 내부 원
  ctx.beginPath();
  ctx.arc(cx, cy, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#003355';
  ctx.fill();
  ctx.strokeStyle = '#00aacc';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 중심점
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#00d4ff';
  ctx.fill();
  ctx.shadowBlur = 0;

  // 쿨다운 아크
  const cd = t.cooldown || 0;
  if (cd > 0) {
    const pct = 1 - cd / CONFIG.TURRET_FIRE_RATE;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.strokeStyle = 'rgba(0,212,255,0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

// ── 터렛 사거리 표시 ──────────────────────────────────────
function drawTurretRanges() {
  Object.values(state.turrets).forEach(t => {
    const pos = cellToCanvas(t.col, t.row);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, CONFIG.TURRET_RANGE, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,212,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

// ── 총알 ──────────────────────────────────────────────────
function drawBullets() {
  state.bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffaa';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

// ── 몬스터 ────────────────────────────────────────────────
function drawMonsters() {
  state.monsters.forEach(m => {
    const pos = getMonsterPos(m);
    const r = 10;

    ctx.shadowColor = '#ff2244';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#cc1133';
    ctx.fill();
    ctx.strokeStyle = '#ff4466';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // HP 바
    const barW = 22, barH = 3;
    const bx = pos.x - barW / 2, by = pos.y - r - 7;
    ctx.fillStyle = '#330011';
    ctx.fillRect(bx, by, barW, barH);
    ctx.fillStyle = m.hp / m.maxHp > 0.5 ? '#39ff14' : '#ff6600';
    ctx.fillRect(bx, by, barW * (m.hp / m.maxHp), barH);
  });
}

// ── 경고 메시지 ───────────────────────────────────────────
function drawWarning() {
  if (state.monsters.length < 70) return;
  ctx.fillStyle = `rgba(255,34,68,${0.3 + 0.3 * Math.sin(state.frame * 0.1)})`;
  ctx.font = 'bold 11px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⚠ OVERFLOW IMMINENT', CONFIG.W / 2, CONFIG.H - 8);
  ctx.textAlign = 'left';
}
