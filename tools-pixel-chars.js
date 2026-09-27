// 16x16 도트 캐릭터 생성기.
// 손으로 문자열을 치면 칸 수를 틀리므로, 정수 격자 위에 도형을 찍어서 만든다.
// 안티에일리어싱이 없어야 진짜 픽셀처럼 보이므로 원도 하드 컷으로 찍는다.
const N = 16;
const EMPTY = '.', INK = '0', BODY = '1', SHADE = '2', WHITE = '3', ACC = '4';

function blank() {
  return Array.from({ length: N }, () => Array(N).fill(EMPTY));
}
function px(g, x, y, v) {
  if (x >= 0 && x < N && y >= 0 && y < N) g[y][x] = v;
}
function rect(g, x0, y0, w, h, v) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) px(g, x, y, v);
}
// 반지름 r 인 원. 중심은 칸 사이(예: 7.5)에 둘 수 있다.
function disc(g, cx, cy, r, v) {
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
    if (dx * dx + dy * dy <= r * r) px(g, x, y, v);
  }
}
// 세로로 눌린 타원
function oval(g, cx, cy, rx, ry, v) {
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
    if (dx * dx + dy * dy <= 1) px(g, x, y, v);
  }
}
// 바깥으로 한 칸 테두리를 두른다. 이게 옛날 도트 느낌을 만든다.
function outline(g) {
  const add = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (g[y][x] !== EMPTY) continue;
    const near = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      return nx >= 0 && nx < N && ny >= 0 && ny < N && g[ny][nx] !== EMPTY;
    });
    if (near) add.push([x, y]);
  }
  add.forEach(([x, y]) => px(g, x, y, INK));
}
// 눈 두 개(흰자 + 검은자)와 입
function face(g, eyeY, eyeDx, mouthY, opt) {
  const o = opt || {};
  const L = 7 - eyeDx, R = 8 + eyeDx;
  [L, R].forEach(ex => {
    rect(g, ex, eyeY, 2, 2, WHITE);
    px(g, ex + (ex === L ? 1 : 0), eyeY + 1, INK);   // 눈동자는 안쪽 아래
    px(g, ex + (ex === L ? 1 : 0), eyeY, INK);
  });
  if (!o.noMouth) {
    px(g, 7, mouthY, INK);
    px(g, 8, mouthY, INK);
    px(g, 6, mouthY - 1, INK);
    px(g, 9, mouthY - 1, INK);
  }
  if (o.blush) {
    rect(g, L - 2, eyeY + 2, 2, 1, ACC);
    rect(g, R + 1, eyeY + 2, 2, 1, ACC);
  }
}
// 아래쪽에 그늘을 깔아 입체감을 준다
function shade(g, fromY) {
  for (let y = fromY; y < N; y++) for (let x = 0; x < N; x++) {
    if (g[y][x] === BODY) g[y][x] = SHADE;
  }
}
function out(g) { return g.map(r => r.join('')); }

const chars = [];

/* 1. 고양이 — 삼각 귀 */
{
  const g = blank();
  [3, 10].forEach(x => {                     // 삼각 귀
    px(g, x + 1, 1, BODY);
    rect(g, x, 2, 3, 1, BODY);
    rect(g, x, 3, 3, 1, BODY);
  });
  oval(g, 8, 9.5, 6.2, 5.6, BODY);
  shade(g, 13);
  face(g, 8, 2, 12, { blush: true });
  outline(g);
  chars.push({ n: '고양이', p: ['#f9a03f', '#d9822b', '#ffffff', '#ff9bb5'], m: out(g) });
}

/* 2. 토끼 — 긴 귀 */
{
  const g = blank();
  rect(g, 5, 1, 2, 5, BODY);
  rect(g, 9, 1, 2, 5, BODY);
  oval(g, 8, 10, 5.8, 5.4, BODY);
  shade(g, 13);
  face(g, 9, 2, 13, { blush: true });
  outline(g);
  chars.push({ n: '토끼', p: ['#f3c0d2', '#dba0b6', '#ffffff', '#ff9bb5'], m: out(g) });
}

/* 3. 곰 — 둥근 귀 + 주둥이 */
{
  const g = blank();
  disc(g, 4, 4.5, 2.2, BODY);
  disc(g, 12, 4.5, 2.2, BODY);
  oval(g, 8, 9.5, 6.2, 5.6, BODY);
  shade(g, 13);
  oval(g, 8, 12, 3.2, 2.2, ACC);
  face(g, 8, 2, 13, {});
  px(g, 7, 11, INK); px(g, 8, 11, INK);      // 코
  outline(g);
  chars.push({ n: '곰', p: ['#c1926a', '#a1754f', '#ffffff', '#f2ddc8'], m: out(g) });
}

/* 4. 병아리 — 부리 + 머리털 */
{
  const g = blank();
  px(g, 7, 2, BODY); px(g, 8, 2, BODY); px(g, 8, 1, BODY);
  rect(g, 7, 3, 2, 1, BODY);
  oval(g, 8, 9.5, 6, 5.8, BODY);
  shade(g, 13);
  face(g, 8, 2, 14, { blush: true, noMouth: true });
  rect(g, 7, 11, 2, 1, ACC);                 // 부리
  px(g, 7, 12, ACC); px(g, 8, 12, ACC);
  outline(g);
  chars.push({ n: '병아리', p: ['#f8d75a', '#dcb833', '#ffffff', '#f2994a'], m: out(g) });
}

/* 5. 개구리 — 위로 솟은 눈 */
{
  const g = blank();
  disc(g, 4.5, 4, 2.4, BODY);
  disc(g, 11.5, 4, 2.4, BODY);
  oval(g, 8, 10.5, 6.4, 4.8, BODY);
  shade(g, 13);
  rect(g, 3, 3, 2, 2, WHITE); rect(g, 11, 3, 2, 2, WHITE);
  px(g, 4, 4, INK); px(g, 11, 4, INK);
  rect(g, 5, 11, 6, 1, INK);                 // 넓은 입
  px(g, 4, 10, INK); px(g, 11, 10, INK);
  outline(g);
  chars.push({ n: '개구리', p: ['#72cf97', '#4fae76', '#ffffff', '#ff9bb5'], m: out(g) });
}

/* 6. 펭귄 — 배 + 부리 */
{
  const g = blank();
  oval(g, 8, 9, 5.8, 6.4, BODY);
  oval(g, 8, 12, 4, 3.4, WHITE);
  face(g, 6, 2, 11, { noMouth: true });
  rect(g, 7, 9, 2, 1, ACC); px(g, 7, 10, ACC); px(g, 8, 10, ACC);
  outline(g);
  chars.push({ n: '펭귄', p: ['#6d8fc9', '#4f6ea3', '#fbfcff', '#f9a03f'], m: out(g) });
}

/* 7. 문어 — 다리 혹 */
{
  const g = blank();
  [3.5, 6.5, 9.5, 12.5].forEach(cx => disc(g, cx, 11.5, 1.6, BODY));
  oval(g, 8, 7, 5.6, 4.6, BODY);
  shade(g, 11);
  face(g, 6, 2, 10, { blush: true });
  outline(g);
  chars.push({ n: '문어', p: ['#f07d98', '#cf5d78', '#ffffff', '#ffb3c6'], m: out(g) });
}

/* 8. 별 */
{
  const g = blank();
  rect(g, 7, 1, 2, 3, BODY);
  rect(g, 6, 3, 4, 2, BODY);
  rect(g, 1, 5, 14, 2, BODY);
  rect(g, 2, 7, 12, 2, BODY);
  rect(g, 3, 9, 10, 2, BODY);
  rect(g, 3, 11, 3, 3, BODY);
  rect(g, 10, 11, 3, 3, BODY);
  shade(g, 11);
  face(g, 7, 2, 10, {});
  outline(g);
  chars.push({ n: '별', p: ['#ffd86b', '#e0b63f', '#ffffff', '#ff9bb5'], m: out(g) });
}

/* 9. 유령 — 물결 치마 */
{
  const g = blank();
  oval(g, 8, 8, 5.8, 5.6, BODY);
  rect(g, 2, 8, 12, 4, BODY);
  [2, 6, 10].forEach(x => rect(g, x, 12, 2, 2, BODY));
  [4, 8, 12].forEach(x => rect(g, x, 12, 2, 1, BODY));
  face(g, 6, 2, 10, { noMouth: true });
  rect(g, 7, 10, 2, 2, INK);                 // 동그란 입
  outline(g);
  chars.push({ n: '유령', p: ['#d5dbff', '#b3bbf0', '#ffffff', '#ff9bb5'], m: out(g) });
}

/* 10. 로봇 — 안테나 + 화면 */
{
  const g = blank();
  px(g, 8, 1, BODY);
  rect(g, 7, 0, 2, 1, ACC);
  rect(g, 3, 2, 10, 11, BODY);
  shade(g, 11);
  rect(g, 4, 5, 8, 4, INK);
  rect(g, 5, 6, 2, 2, ACC); rect(g, 9, 6, 2, 2, ACC);
  rect(g, 6, 10, 4, 1, INK);
  outline(g);
  chars.push({ n: '로봇', p: ['#86d9d3', '#5fb4ae', '#ffffff', '#9ef1ea'], m: out(g) });
}

// 터미널에서 눈으로 보기
const ART = { '.': '  ', '0': '██', '1': '▓▓', '2': '▒▒', '3': '░░', '4': '··' };
chars.forEach(c => {
  console.log('\n== ' + c.n + ' ==');
  c.m.forEach(r => console.log(r.split('').map(ch => ART[ch]).join('')));
});

// index.html 에 붙일 형태
console.log('\n\n----- 붙일 코드 -----');
console.log('const CHARS = [');
chars.forEach((c, i) => {
  console.log("  { n:'" + c.n + "', p:['" + c.p.join("','") + "'], m:[");
  c.m.forEach((r, k) => console.log("    '" + r + "'" + (k < N - 1 ? ',' : '')));
  console.log('  ]}' + (i < chars.length - 1 ? ',' : ''));
});
console.log('];');
