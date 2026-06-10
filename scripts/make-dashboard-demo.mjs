import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2];
const out = process.argv[3] ?? 'dashboard-demo.html';
const html = readFileSync(src, 'utf8');

const node = (id, score, extra = {}) => ({
  id,
  score,
  co: 4,
  mq2: 310,
  mq7: 880,
  mq135: 420,
  temp: 29.4,
  hum: 64.0,
  fl: false,
  gas: false,
  sos: false,
  on: true,
  av: true,
  fc: false,
  age: 1,
  pk: 4200 + id * 311,
  wt: false,
  ...extra,
});

const state = {
  zn: [
    { name: 'A', score: 7, status: 'FIRE' },
    { name: 'B', score: 3, status: 'WARNING' },
    { name: 'C', score: 0, status: 'SAFE' },
  ],
  nd: [
    node(1, 7, { co: 86, mq2: 1450, mq7: 1320, mq135: 980, temp: 41.2, hum: 38.5, fl: true }),
    node(2, 3, { co: 22, mq2: 640, temp: 31.0, hum: 58.2 }),
    node(3, 1, { sos: true }),
    node(4, 0),
    node(5, 2, { co: 12, mq2: 480 }),
    node(6, 0, { on: false, av: false, age: 47 }),
  ],
  ex: [
    { name: 'A', bc: false, cg: false, ob: false, pc: 6, fc: false, ldr: 2840 },
    { name: 'B', bc: false, cg: true, ob: false, pc: 27, fc: false, ldr: 2790 },
    { name: 'C', bc: false, cg: false, ob: false, pc: 2, fc: false, ldr: 2910 },
  ],
  al: { fire: true, gas: false, sos: true },
  sosL: 'Node 3 (Zone B)',
  gasL: '',
  pm: 0,
  lg: [
    '[BOOT] ARIA Hub v6 online, ESP-NOW ch 6',
    '[NODE] Node 1 joined (Zone A)',
    '[SCORE] Node 1 fire score 5 -> 7 (flame + CO rising)',
    '[ALERT] TIER 2 EMERGENCY - Zone A',
    '[LED] Routing: A=RED right, B=GREEN right, C=GREEN right',
    '[EXIT] Exit B congestion: 27 persons / 30 s window',
    '[SOS] Node 3 SOS button pressed (Zone B)',
    '[TG] Telegram alert sent (tier 2)',
  ],
  ct: 2,
  ch: ['[CHAT] Warden: Zone A confirmed, moving to Exit A', '[CHAT] Warden: Exit B crowded, redirect to C'],
};

const stub = `<script>
(function () {
  var STATE = ${JSON.stringify(state)};
  function FakeWS() {
    var self = this;
    this.readyState = 1;
    setTimeout(function () { if (self.onopen) self.onopen(); tick(); }, 60);
    function tick() {
      if (self.onmessage) self.onmessage({ data: JSON.stringify(STATE) });
      setTimeout(tick, 1000);
    }
  }
  FakeWS.prototype.send = function () {};
  FakeWS.prototype.close = function () {};
  window.WebSocket = FakeWS;
})();
</script>`;

const headIdx = html.search(/<head[^>]*>/i);
let result;
if (headIdx !== -1) {
  const insertAt = html.indexOf('>', headIdx) + 1;
  result = html.slice(0, insertAt) + stub + html.slice(insertAt);
} else {
  result = stub + html;
}
writeFileSync(out, result);
console.log(`Demo dashboard written -> ${out}`);
