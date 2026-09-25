/**
 * Tiny client-side binding for calculator UIs.
 * Inputs: elements with [data-in="key"] (number, select, checkbox, radio).
 * Outputs: elements with [data-out="key"] receive text returned by `compute`.
 */
export type Inputs = Record<string, number | string | boolean | string[]>;

export function readInputs(root: HTMLElement): Inputs {
  const out: Inputs = {};
  root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-in]').forEach((el) => {
    const key = el.dataset.in!;
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      if (el.dataset.multi !== undefined) {
        const arr = (out[key] as string[]) ?? [];
        if (el.checked) arr.push(el.value);
        out[key] = arr;
      } else out[key] = el.checked;
    } else if (el instanceof HTMLInputElement && el.type === 'radio') {
      if (el.checked) out[key] = el.value;
      else if (!(key in out)) out[key] = '';
    } else if (el instanceof HTMLInputElement && el.type === 'number') {
      const n = parseFloat(el.value);
      out[key] = Number.isFinite(n) && n >= 0 ? n : 0;
    } else out[key] = el.value;
  });
  return out;
}

export function bindCalc(root: HTMLElement, tool: string, compute: (i: Inputs) => Record<string, string>) {
  let tracked = false;
  const run = () => {
    const res = compute(readInputs(root));
    for (const [k, v] of Object.entries(res)) {
      root.querySelectorAll<HTMLElement>(`[data-out="${k}"]`).forEach((el) => {
        if (el.dataset.html !== undefined) el.innerHTML = v;
        else el.textContent = v;
      });
    }
  };
  root.addEventListener('input', () => {
    run();
    if (!tracked) {
      tracked = true;
      (window as any).tbmTrack?.('tool_used', { tool });
    }
  });
  root.addEventListener('change', run);
  run();
}

/** Trigger a client-side file download (used for evaluation reports). */
export function download(filename: string, content: string, type = 'text/html') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
