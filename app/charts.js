// Small SVG charts, drawn by hand — no chart library, no network.
// Both builders return an SVG string the views drop into the page.

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const [sx, sy] = polar(cx, cy, r, startAngle);
  const [ex, ey] = polar(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

// A donut of spending by category. slices: [{label, value, color}]
// The middle carries the total, so the chart reads even without the legend.
export function donutChart(slices, totalLabel, totalValue) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = 110;
  const cy = 110;
  const r = 82;
  const width = 20;
  let angle = 0;
  const parts = slices
    .filter((x) => x.value > 0)
    .map((x) => {
      const frac = x.value / total;
      const start = angle;
      const end = angle + frac * 360;
      angle = end;
      // Leave a 2-degree gap so slices stay readable.
      const path = arcPath(cx, cy, r, start + 1, Math.max(start + 1.1, end - 1));
      return `<path d="${path}" fill="none" stroke="${x.color}" stroke-width="${width}" stroke-linecap="butt"><title>${x.label}: ${x.value.toFixed(2)}</title></path>`;
    })
    .join('');
  return `<svg viewBox="0 0 220 220" role="img" aria-label="Spending by category" class="chart-svg">${parts}<text x="110" y="104" text-anchor="middle" class="donut-total">${totalValue}</text><text x="110" y="126" text-anchor="middle" class="donut-label">${totalLabel}</text></svg>`;
}

// Grouped bars: income vs spending for each month in `months`
// ([{month, income, spent}]). Drawn to a fixed 560x220 viewBox.
export function trendChart(months) {
  const W = 560;
  const H = 220;
  const base = 190;
  const max = Math.max(...months.map((m) => Math.max(m.income, m.spent))) * 1.08;
  const slot = W / months.length;
  const barW = 26;
  const bars = months
    .map((m, i) => {
      const x = i * slot + slot / 2;
      const hIn = (m.income / max) * (base - 20);
      const hOut = (m.spent / max) * (base - 20);
      return `<rect x="${(x - barW - 3).toFixed(1)}" y="${(base - hIn).toFixed(1)}" width="${barW}" height="${hIn.toFixed(1)}" rx="3" fill="#2f6b4f"><title>${m.month} income $${m.income}</title></rect><rect x="${(x + 3).toFixed(1)}" y="${(base - hOut).toFixed(1)}" width="${barW}" height="${hOut.toFixed(1)}" rx="3" fill="#c98a2b"><title>${m.month} spent $${m.spent}</title></rect><text x="${x.toFixed(1)}" y="210" text-anchor="middle" class="axis-label">${m.month}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Income and spending by month" class="chart-svg"><line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="#d8cfc0" stroke-width="1"/>${bars}</svg>`;
}
