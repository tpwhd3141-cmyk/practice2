// ─── PATH ─────────────────────────────────────────────────
// 몬스터가 이동하는 외곽 순환 경로를 생성합니다.
// 경로 형태를 바꾸려면 buildPath()를 수정하세요.

function buildPath() {
  const pts = [];
  const minC = 0, maxC = CONFIG.TOTAL - 1;
  // 시계방향 외곽 순환
  for (let c = minC; c <= maxC; c++) pts.push([c, minC]);        // 상단 →
  for (let r = minC + 1; r <= maxC; r++) pts.push([maxC, r]);    // 우측 ↓
  for (let c = maxC - 1; c >= minC; c--) pts.push([c, maxC]);    // 하단 ←
  for (let r = maxC - 1; r >= minC + 1; r--) pts.push([minC, r]); // 좌측 ↑
  return pts;
}

const PATH_CELLS = buildPath();

/** 그리드 좌표 → 캔버스 픽셀 중심 좌표 */
function cellToCanvas(col, row) {
  return {
    x: CONFIG.PADDING + col * CONFIG.CELL + CONFIG.CELL / 2,
    y: CONFIG.PADDING + row * CONFIG.CELL + CONFIG.CELL / 2,
  };
}
