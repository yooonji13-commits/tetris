// 12x12 도트 외계인 생성기.
// 옛날 오락실 외계인 느낌 — 테두리 없이 단색 덩어리, 눈만 구멍처럼 뚫는다.
// 칸이 적을수록 같은 크기에서 도트가 굵게 보인다.
const N = 12;
const E = '.', EYE = '.', BODY = '1', ACC = '2';   /* 눈은 뚫어 둔다 — 뒤 배경이 그대로 비친다 */

const blank = () => Array.from({ length: N }, () => Array(N).fill(E));
function px(g, x, y, v) { if (x >= 0 && x < N && y >= 0 && y < N) g[y][x] = v; }
function rect(g, x0, y0, w, h, v) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) px(g, x, y, v);
}
// 왼쪽에 찍으면 오른쪽에도 같이 찍는다. 외계인은 좌우가 똑같아야 한다.
function sym(g, x, y, v) { px(g, x, y, v); px(g, N - 1 - x, y, v); }
function symRect(g, x0, y0, w, h, v) {
  rect(g, x0, y0, w, h, v);
  rect(g, N - x0 - w, y0, w, h, v);
}
function eyes(g, x, y, v) { sym(g, x, y, v || EYE); }

const chars = [];
function center(g){
  let top = -1, bot = -1;
  for (let y = 0; y < N; y++) {
    if (g[y].some(v => v !== E)) { if (top < 0) top = y; bot = y; }
  }
  if (top < 0) return;
  const shift = Math.round((N - 1 - bot - top) / 2);
  if (!shift) return;
  const copy = g.map(r => r.slice());
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) g[y][x] = E;
  for (let y = 0; y < N; y++) {
    const ny = y + shift;
    if (ny >= 0 && ny < N) for (let x = 0; x < N; x++) g[ny][x] = copy[y][x];
  }
}
const add = (n, p, g) => { center(g); chars.push({ n, p, m: g.map(r => r.join('')) }); };

/* 1. 게 — 더듬이 둘, 넓은 몸, 옆으로 뻗은 다리 */
{
  const g = blank();
  sym(g, 2, 1, BODY);
  sym(g, 3, 2, BODY);
  rect(g, 2, 3, 8, 2, BODY);
  rect(g, 1, 5, 10, 2, BODY);
  eyes(g, 3, 5);
  symRect(g, 1, 7, 2, 1, BODY);
  sym(g, 3, 8, BODY);
  sym(g, 0, 8, BODY);
  sym(g, 4, 9, BODY);
  add('게', ['#e8613c', '#ffb08c'], g);
}

/* 2. 오징어 — 길쭉한 머리에 다리 넷 */
{
  const g = blank();
  rect(g, 4, 0, 4, 1, BODY);
  rect(g, 3, 1, 6, 5, BODY);
  eyes(g, 4, 3);
  rect(g, 2, 6, 8, 1, BODY);
  sym(g, 2, 7, BODY); sym(g, 4, 7, BODY);
  sym(g, 1, 8, BODY); sym(g, 4, 8, BODY);
  sym(g, 1, 9, BODY); sym(g, 5, 9, BODY);
  add('오징어', ['#4ad6c8', '#b8f5ee'], g);
}

/* 3. 문어 — 넓적한 머리에 짧은 발 여럿 */
{
  const g = blank();
  rect(g, 3, 1, 6, 1, BODY);
  rect(g, 2, 2, 8, 4, BODY);
  eyes(g, 3, 3);
  rect(g, 1, 6, 10, 1, BODY);
  sym(g, 1, 7, BODY); sym(g, 3, 7, BODY); sym(g, 5, 7, BODY);
  sym(g, 1, 8, BODY); sym(g, 5, 8, BODY);
  add('문어', ['#c86ff0', '#eccafb'], g);
}

/* 4. 해파리 — 둥근 갓에 물결 치마 */
{
  const g = blank();
  rect(g, 4, 1, 4, 1, BODY);
  rect(g, 2, 2, 8, 1, BODY);
  rect(g, 1, 3, 10, 3, BODY);
  eyes(g, 3, 4);
  sym(g, 1, 6, BODY); sym(g, 3, 6, BODY); sym(g, 5, 6, BODY);
  sym(g, 2, 7, BODY); sym(g, 4, 7, BODY);
  sym(g, 2, 8, BODY); sym(g, 5, 8, BODY);
  add('해파리', ['#ffd24a', '#fff0b8'], g);
}

/* 5. 로봇 — 네모 머리에 안테나 */
{
  const g = blank();
  sym(g, 3, 0, ACC);
  sym(g, 3, 1, BODY);
  rect(g, 2, 2, 8, 4, BODY);
  rect(g, 3, 3, 6, 2, EYE);
  symRect(g, 4, 3, 1, 2, ACC);
  rect(g, 1, 6, 10, 2, BODY);
  symRect(g, 0, 6, 1, 2, BODY);
  sym(g, 2, 8, BODY); sym(g, 4, 8, BODY);
  sym(g, 2, 9, BODY); sym(g, 4, 9, BODY);
  add('로봇', ['#7fa8ff', '#d6e4ff'], g);
}

/* 6. 외눈박이 — 눈 하나가 크다 */
{
  const g = blank();
  rect(g, 4, 1, 4, 1, BODY);
  rect(g, 2, 2, 8, 5, BODY);
  rect(g, 4, 3, 4, 3, EYE);
  rect(g, 5, 4, 2, 1, ACC);
  rect(g, 1, 7, 10, 1, BODY);
  sym(g, 1, 8, BODY); sym(g, 4, 8, BODY);
  sym(g, 0, 9, BODY); sym(g, 4, 9, BODY);
  add('외눈박이', ['#6fe08a', '#ccffd9'], g);
}

/* 7. 박쥐 — 뾰족한 귀에 날개 */
{
  const g = blank();
  sym(g, 3, 1, BODY);
  symRect(g, 3, 2, 2, 1, BODY);
  rect(g, 3, 3, 6, 3, BODY);
  eyes(g, 4, 4);
  symRect(g, 0, 4, 3, 1, BODY);
  symRect(g, 1, 5, 2, 1, BODY);
  rect(g, 4, 6, 4, 1, BODY);
  sym(g, 4, 7, BODY);
  add('박쥐', ['#ff7fa8', '#ffd0de'], g);
}

/* 8. 벌레 — 긴 더듬이에 다리 여섯 */
{
  const g = blank();
  sym(g, 1, 0, BODY);
  sym(g, 2, 1, BODY);
  rect(g, 3, 2, 6, 2, BODY);
  eyes(g, 4, 2);
  rect(g, 2, 4, 8, 4, BODY);
  rect(g, 4, 5, 4, 1, ACC);
  symRect(g, 0, 4, 2, 1, BODY);
  symRect(g, 0, 6, 2, 1, BODY);
  sym(g, 3, 8, BODY); sym(g, 1, 8, BODY);
  add('벌레', ['#ffa23c', '#ffd9a8'], g);
}

/* 9. 유령 — 둥근 머리에 삐죽한 자락 */
{
  const g = blank();
  rect(g, 4, 1, 4, 1, BODY);
  rect(g, 2, 2, 8, 1, BODY);
  rect(g, 1, 3, 10, 5, BODY);
  eyes(g, 3, 4);
  rect(g, 4, 6, 4, 1, EYE);
  sym(g, 1, 8, BODY); sym(g, 3, 8, BODY); sym(g, 5, 8, BODY);
  sym(g, 1, 9, BODY); sym(g, 5, 9, BODY);
  add('유령', ['#b9c6ff', '#e6ebff'], g);
}

/* 10. 별난놈 — 뿔 셋에 넓은 입 */
{
  const g = blank();
  sym(g, 2, 0, BODY); rect(g, 5, 0, 2, 1, BODY);
  sym(g, 2, 1, BODY); rect(g, 5, 1, 2, 1, BODY);
  rect(g, 1, 2, 10, 4, BODY);
  eyes(g, 3, 3);
  rect(g, 1, 6, 10, 1, BODY);
  rect(g, 3, 6, 6, 1, EYE);
  rect(g, 2, 7, 8, 1, BODY);
  sym(g, 2, 8, BODY); sym(g, 4, 8, BODY);
  sym(g, 1, 9, BODY); sym(g, 5, 9, BODY);
  add('별난놈', ['#f05a7a', '#ffc2cf'], g);
}

// 터미널에서 눈으로 보기
const ART = { '.': '  ', '0': '  ', '1': '██', '2': '▒▒' };
chars.forEach(c => {
  console.log('\n== ' + c.n + ' ==');
  c.m.forEach(r => console.log('|' + r.split('').map(ch => ART[ch]).join('') + '|'));
});

console.log('\n\n----- 붙일 코드 -----');
console.log('const CHARS = [');
chars.forEach((c, i) => {
  if (c.m.length !== N) throw new Error(c.n + ' 줄 수가 ' + c.m.length);
  c.m.forEach(r => { if (r.length !== N) throw new Error(c.n + ' 칸 수가 ' + r.length); });
  console.log("  { n:'" + c.n + "', p:['" + c.p.join("','") + "'], m:[");
  c.m.forEach((r, k) => console.log("    '" + r + "'" + (k < N - 1 ? ',' : '')));
  console.log('  ]}' + (i < chars.length - 1 ? ',' : ''));
});
console.log('];');
