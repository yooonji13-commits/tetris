// 20x20 도트 사람 캐릭터 생성기.
// 손으로 문자열을 치면 칸 수를 틀리므로, 정수 격자 위에 도형을 찍어서 만든다.
// 색 자리: 1 살색 · 2 머리 · 3 흰자 · 4 옷 · 5 포인트(볼·장식), 0 은 테두리.
const N = 20;
const E = '.', INK = '0', SKIN = '1', HAIR = '2', WHITE = '3', SHIRT = '4', ACC = '5', HI = '6', RIM = '7';

const blank = () => Array.from({ length: N }, () => Array(N).fill(E));
function px(g, x, y, v) { if (x >= 0 && x < N && y >= 0 && y < N) g[y][x] = v; }
function rect(g, x0, y0, w, h, v) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) px(g, x, y, v);
}
function frame(g, x, y, w, h) {
  rect(g, x, y, w, 1, INK); rect(g, x, y + h - 1, w, 1, INK);
  rect(g, x, y, 1, h, INK); rect(g, x + w - 1, y, 1, h, INK);
}
// 각 칸에서 맨 위에 있는 머리 픽셀을 밝은 색으로 — 검은 머리도 배경에서 떠 보인다
function hairShine(g) {
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) {
      if (g[y][x] === HAIR) { g[y][x] = HI; break; }
    }
  }
}
function outline(g) {
  const add = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (g[y][x] !== E) continue;
    const near = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      return nx >= 0 && nx < N && ny >= 0 && ny < N && g[ny][nx] !== E;
    });
    if (near) add.push([x, y]);
  }
  add.forEach(([x, y]) => px(g, x, y, RIM));
}

// 몸 · 목 · 얼굴 · 눈 · 입. 머리 모양은 뒤에서 따로 얹는다.
function base(g, o) {
  o = o || {};
  rect(g, 4, 15, 12, 2, SHIRT);            // 어깨
  rect(g, 3, 17, 14, 3, SHIRT);            // 몸통
  rect(g, 8, 13, 4, 2, SKIN);              // 목
  rect(g, 5, 4, 10, 9, SKIN);              // 얼굴
  [[5,4],[14,4],[5,12],[14,12]].forEach(([x, y]) => px(g, x, y, E));   // 모서리 깎기

  const ey = o.eyeY || 8;
  rect(g, 7, ey, 2, 2, WHITE);
  rect(g, 11, ey, 2, 2, WHITE);
  px(g, 8, ey, INK); px(g, 8, ey + 1, INK);
  px(g, 11, ey, INK); px(g, 11, ey + 1, INK);

  px(g, 9, ey + 3, INK); px(g, 10, ey + 3, INK);                        // 입
  if (o.blush !== false) { rect(g, 5, ey + 2, 2, 1, ACC); rect(g, 13, ey + 2, 2, 1, ACC); }
}

const chars = [];
const add = (n, p, g) => { hairShine(g); outline(g); chars.push({ n, p, m: g.map(r => r.join('')) }); };

/* 1. 단발머리 */
{
  const g = blank(); base(g, {});
  rect(g, 4, 2, 12, 3, HAIR);
  rect(g, 4, 5, 2, 6, HAIR);
  rect(g, 14, 5, 2, 6, HAIR);
  add('단발머리', ['#f4cba6', '#6b4a33', '#ffffff', '#e0736f', '#ff9bb5', '#96704f'], g);
}

/* 2. 양갈래 */
{
  const g = blank(); base(g, {});
  rect(g, 4, 2, 12, 3, HAIR);
  rect(g, 4, 5, 2, 3, HAIR);
  rect(g, 14, 5, 2, 3, HAIR);
  rect(g, 2, 6, 2, 6, HAIR);               // 갈래
  rect(g, 16, 6, 2, 6, HAIR);
  add('양갈래', ['#f7d3b2', '#e07fa8', '#ffffff', '#7fb4e8', '#ff9bb5', '#f2a8c6'], g);
}

/* 3. 곱슬머리 */
{
  const g = blank(); base(g, {});
  rect(g, 5, 2, 10, 3, HAIR);
  [3, 5, 7, 9, 11, 13, 15].forEach(x => px(g, x, 1, HAIR));
  rect(g, 3, 3, 2, 4, HAIR);
  rect(g, 15, 3, 2, 4, HAIR);
  add('곱슬머리', ['#e4b184', '#3b3040', '#ffffff', '#8fd0a8', '#ff9bb5', '#6f6078'], g);
}

/* 4. 모자 */
{
  const g = blank(); base(g, {});
  rect(g, 5, 4, 10, 1, HAIR);              // 모자 밑 머리
  rect(g, 5, 1, 10, 3, ACC);               // 모자
  rect(g, 3, 3, 14, 1, ACC);               // 챙
  add('모자', ['#f4cba6', '#4a3a2e', '#ffffff', '#f2c14e', '#4f7dc9', '#6f5a48'], g);
}

/* 5. 안경 */
{
  const g = blank(); base(g, {});
  rect(g, 4, 2, 12, 3, HAIR);
  rect(g, 4, 5, 2, 2, HAIR);
  rect(g, 14, 5, 2, 2, HAIR);
  rect(g, 6, 7, 8, 1, INK);                // 안경 윗테
  px(g, 6, 8, INK); px(g, 6, 9, INK);      // 바깥 테
  px(g, 13, 8, INK); px(g, 13, 9, INK);
  px(g, 9, 8, INK); px(g, 10, 8, INK);     // 코 다리
  px(g, 6, 10, INK); px(g, 13, 10, INK);   // 아래 귀퉁이
  add('안경', ['#f7d3b2', '#2f2a3d', '#ffffff', '#a89bdc', '#ff9bb5', '#605a76'], g);
}

/* 6. 긴머리 */
{
  const g = blank(); base(g, {});
  rect(g, 4, 2, 12, 3, HAIR);
  rect(g, 3, 5, 3, 11, HAIR);
  rect(g, 14, 5, 3, 11, HAIR);
  add('긴머리', ['#f4cba6', '#d98b45', '#ffffff', '#6fb5a8', '#ff9bb5', '#f0b070'], g);
}

/* 7. 짧은머리 */
{
  const g = blank(); base(g, {});
  rect(g, 5, 2, 10, 3, HAIR);
  px(g, 4, 3, HAIR); px(g, 15, 3, HAIR);
  px(g, 4, 4, HAIR); px(g, 15, 4, HAIR);
  add('짧은머리', ['#d9a06f', '#332b38', '#ffffff', '#e8a0c0', '#ff9bb5', '#68596f'], g);
}

/* 8. 왕관 */
{
  const g = blank(); base(g, {});
  rect(g, 4, 3, 12, 2, HAIR);
  rect(g, 4, 5, 2, 4, HAIR);
  rect(g, 14, 5, 2, 4, HAIR);
  rect(g, 5, 1, 10, 2, ACC);               // 왕관
  [5, 7, 9, 11, 13].forEach(x => px(g, x, 0, ACC));
  add('왕관', ['#f7d3b2', '#f2cf6b', '#ffffff', '#c98ce0', '#ffd54a', '#fbe6a6'], g);
}

/* 9. 두건 */
{
  const g = blank(); base(g, {});
  rect(g, 5, 2, 10, 2, HAIR);
  rect(g, 4, 4, 12, 2, ACC);               // 두건
  px(g, 3, 5, ACC); px(g, 2, 6, ACC); px(g, 3, 6, ACC);   // 묶은 끝
  add('두건', ['#e4b184', '#3b3040', '#ffffff', '#7fc8a0', '#e0736f', '#6f6078'], g);
}

/* 10. 헤드폰 */
{
  const g = blank(); base(g, {});
  rect(g, 4, 2, 12, 3, HAIR);
  rect(g, 4, 5, 2, 3, HAIR);
  rect(g, 14, 5, 2, 3, HAIR);
  rect(g, 4, 1, 12, 1, ACC);               // 머리 위 띠
  rect(g, 2, 2, 2, 5, ACC);                // 귀 덮개
  rect(g, 16, 2, 2, 5, ACC);
  add('헤드폰', ['#f4cba6', '#4a3a55', '#ffffff', '#5fb0d9', '#a78bfa', '#7f6f92'], g);
}

// 터미널에서 눈으로 보기
const ART = { '.': '  ', '0': '██', '1': '▓▓', '2': '▒▒', '3': '░░', '4': '▚▚', '5': '··', '6': '▞▞', '7': '▓▓' };
chars.forEach(c => {
  console.log('\n== ' + c.n + ' ==');
  c.m.forEach(r => console.log(r.split('').map(ch => ART[ch]).join('')));
});

console.log('\n\n----- 붙일 코드 -----');
console.log('const CHARS = [');
chars.forEach((c, i) => {
  console.log("  { n:'" + c.n + "', p:['" + c.p.join("','") + "'], m:[");
  c.m.forEach((r, k) => console.log("    '" + r + "'" + (k < N - 1 ? ',' : '')));
  console.log('  ]}' + (i < chars.length - 1 ? ',' : ''));
});
console.log('];');
