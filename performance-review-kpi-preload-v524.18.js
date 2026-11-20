/* v524.18 preload compatibility for v524.17.
   Must load BEFORE performance-review-components.v524.js. */
(() => {
  'use strict';
  if (typeof window.captureActive === 'function') return;

  const clean = value => String(value ?? '').trim();
  const parseNumber = value => {
    const raw = clean(value);
    if (!raw || /^(?:[+-]|[+-]?\.|[+-]?\d+\.)$/.test(raw)) return null;
    const parsed = Number(raw.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  };
  const precise = value => Math.round((value + Math.sign(value || 1) * Number.EPSILON) * 1e9) / 1e9;
  const mode = () => sessionStorage.getItem('prp-kpi-aggregation-mode-v456') === 'total' ? 'total' : 'daily-average';
  const table = () => document.getElementById('page2-side-by-side-table');
  const rowKey = row => clean(
    row?.dataset?.columnKey ||
    row?.querySelector('.sbs-kpi-label-input,[data-kpi-label],.sbs-kpi-label,.sbs-kpi-name')?.value ||
    row?.querySelector('.sbs-kpi-label-input,[data-kpi-label],.sbs-kpi-label,.sbs-kpi-name')?.textContent
  ).toLowerCase();
  const current = row => row?.querySelector('.sbs-current-value,input[data-current-value],.sbs-current-input');
  const findRow = name => [...(table()?.querySelectorAll('tbody tr') || [])].find(row => rowKey(row).startsWith(name));

  function daysWorked() {
    const availability = findRow('availability');
    const prior = availability?.querySelector('.sbs-parsed-value,.sbs-parsed-value-input,input[data-previous-value]');
    const now = current(availability);
    const sources = [
      now?.value,
      prior?.value,
      availability?.dataset?.currentValue,
      availability?.dataset?.previousValue,
      document.getElementById('m-days-present')?.value
    ];
    for (const source of sources) {
      const numbers = String(source || '').match(/-?\d+(?:\.\d+)?/g) || [];
      const candidate = numbers.length > 1 ? Number(numbers[1]) : Number(numbers[0]);
      if (Number.isFinite(candidate) && candidate > 0) return candidate;
    }
    return 1;
  }

  window.captureActive = function captureActive() {
    const activeMode = mode();
    const days = daysWorked();
    const captured = {};

    for (const key of ['inbound', 'outbound']) {
      const row = findRow(key);
      const input = current(row);
      if (!input) continue;
      const shown = parseNumber(input.value);
      if (shown === null) {
        captured[key] = { shown: input.value, daily: input.dataset.dailyValue || '', monthly: input.dataset.monthlyValue || '' };
        continue;
      }
      const daily = precise(activeMode === 'total' ? shown / days : shown);
      const monthly = precise(activeMode === 'total' ? shown : shown * days);
      input.dataset.dailyValue = String(daily);
      input.dataset.monthlyValue = String(monthly);
      input.dataset.aggregationMode = activeMode;
      captured[key] = { shown: input.value, daily: String(daily), monthly: String(monthly) };
    }

    return { mode: activeMode, daysWorked: days, captured };
  };

  window.KpiCaptureActiveCompatV52418 = Object.freeze({
    version: '524.18',
    capture: window.captureActive,
    getState: () => ({ installed: true, mode: mode(), daysWorked: daysWorked(), tableCount: document.querySelectorAll('#page2-side-by-side-table').length })
  });
})();
