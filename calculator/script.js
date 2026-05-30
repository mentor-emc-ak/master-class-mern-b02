/**
 * ═══════════════════════════════════════════════════════════════════
 * NEXUS-7 CALCULATOR — script.js
 * Futuristic calculator · Modular JS · No external dependencies
 * ═══════════════════════════════════════════════════════════════════
 *
 * Modules (IIFE-style, self-contained):
 *  1. ParticleEngine  — Canvas particle background
 *  2. AudioEngine     — Web Audio API sound effects
 *  3. ThemeManager    — Theme switching & persistence
 *  4. HistoryManager  — LocalStorage CRUD for history
 *  5. Calculator      — Core state machine & math
 *  6. UI              — DOM bindings, keyboard, ripple, copy
 *  7. Init            — Bootstrap everything
 */

'use strict';

/* ════════════════════════════════════════
   1. PARTICLE ENGINE
   ════════════════════════════════════════ */
const ParticleEngine = (() => {

  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let   W, H, particles = [], animId;

  /** Resize canvas to viewport */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /** Get theme particle colors from CSS variables */
  function getColors() {
    const s = getComputedStyle(document.documentElement);
    return [
      s.getPropertyValue('--particle1').trim(),
      s.getPropertyValue('--particle2').trim(),
      s.getPropertyValue('--particle3').trim(),
    ];
  }

  /** Create a single particle */
  function createParticle() {
    const colors = getColors();
    return {
      x:      Math.random() * W,
      y:      Math.random() * H,
      vx:     (Math.random() - 0.5) * 0.4,
      vy:     (Math.random() - 0.5) * 0.4,
      r:      Math.random() * 1.8 + 0.4,
      color:  colors[Math.floor(Math.random() * colors.length)],
      alpha:  Math.random() * 0.7 + 0.2,
      life:   Math.random() * 300 + 100,
      age:    0,
    };
  }

  /** Main animation loop */
  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Ensure pool size
    while (particles.length < 120) particles.push(createParticle());

    particles = particles.filter(p => {
      p.age++;
      p.x += p.vx;
      p.y += p.vy;
      // Wrap edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      const fade = 1 - (p.age / p.life);
      ctx.save();
      ctx.globalAlpha = p.alpha * fade;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 6;
      ctx.fill();
      ctx.restore();

      return p.age < p.life;
    });

    animId = requestAnimationFrame(loop);
  }

  /** Refresh colors on theme switch */
  function refresh() {
    particles.forEach(p => {
      const colors = getColors();
      p.color = colors[Math.floor(Math.random() * colors.length)];
    });
  }

  function start() {
    resize();
    loop();
    window.addEventListener('resize', resize);
  }

  return { start, refresh };
})();


/* ════════════════════════════════════════
   2. AUDIO ENGINE
   ════════════════════════════════════════ */
const AudioEngine = (() => {

  let ctx = null;
  let enabled = false;

  /** Lazy-init Web Audio context (requires user interaction) */
  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  /**
   * Play a short tone
   * @param {number} freq   - Hz
   * @param {number} dur    - seconds
   * @param {string} type   - oscillator type
   * @param {number} gain   - volume 0-1
   */
  function tone(freq, dur = 0.08, type = 'sine', gain = 0.15) {
    if (!enabled) return;
    ensureCtx();
    const osc  = ctx.createOscillator();
    const amp  = ctx.createGain();
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.type      = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    amp.gain.setValueAtTime(gain, ctx.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }

  const sounds = {
    digit:  () => tone(880, 0.05, 'sine', 0.08),
    op:     () => tone(660, 0.07, 'triangle', 0.12),
    eq:     () => { tone(880, 0.06, 'sine', 0.12); setTimeout(() => tone(1100, 0.12, 'sine', 0.10), 60); },
    clear:  () => tone(220, 0.12, 'sawtooth', 0.10),
    error:  () => tone(180, 0.20, 'sawtooth', 0.15),
    mem:    () => tone(740, 0.08, 'triangle', 0.10),
    copy:   () => { tone(1200, 0.05, 'sine', 0.08); setTimeout(() => tone(1600, 0.08, 'sine', 0.06), 50); },
  };

  function setEnabled(val) { enabled = val; }
  function isEnabled()     { return enabled; }

  return { sounds, setEnabled, isEnabled };
})();


/* ════════════════════════════════════════
   3. THEME MANAGER
   ════════════════════════════════════════ */
const ThemeManager = (() => {

  const THEMES = ['cyberpunk', 'space', 'matrix', 'holo'];
  const KEY    = 'nexus7_theme';
  let current  = localStorage.getItem(KEY) || 'cyberpunk';

  function apply(theme) {
    if (!THEMES.includes(theme)) return;
    current = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    // Update active state on buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    ParticleEngine.refresh();
  }

  function init() {
    apply(current);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => apply(btn.dataset.theme));
    });
  }

  return { init, apply, current: () => current };
})();


/* ════════════════════════════════════════
   4. HISTORY MANAGER
   ════════════════════════════════════════ */
const HistoryManager = (() => {

  const KEY     = 'nexus7_history';
  const MAX     = 200;
  let   items   = [];
  let   filter  = '';

  /* Load from LocalStorage */
  function load() {
    try {
      items = JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      items = [];
    }
  }

  /* Save to LocalStorage */
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
    } catch {
      // Storage quota exceeded — prune oldest half
      items = items.slice(0, Math.floor(MAX / 2));
      localStorage.setItem(KEY, JSON.stringify(items));
    }
  }

  /** Add a calculation entry */
  function add(expr, result) {
    items.unshift({
      id:     Date.now(),
      expr:   String(expr),
      result: String(result),
      time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    if (items.length > MAX) items.pop();
    save();
    render();
  }

  /** Remove entry by id */
  function remove(id) {
    items = items.filter(i => i.id !== id);
    save();
    render();
  }

  /** Clear all */
  function clearAll() {
    items = [];
    save();
    render();
  }

  /** Set search filter */
  function setFilter(val) {
    filter = val.toLowerCase();
    render();
  }

  /** Render history list to DOM */
  function render() {
    const list  = document.getElementById('historyList');
    const empty = document.getElementById('historyEmpty');
    const shown = filter
      ? items.filter(i => i.expr.toLowerCase().includes(filter) || i.result.includes(filter))
      : items;

    list.innerHTML = '';
    empty.style.display = shown.length ? 'none' : 'block';

    shown.forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.setAttribute('role', 'listitem');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-label', `${item.expr} equals ${item.result}`);
      li.innerHTML = `
        <div class="history-item-content">
          <div class="history-expr">${escapeHTML(item.expr)}</div>
          <div class="history-result">${escapeHTML(item.result)}</div>
        </div>
        <span class="history-time">${item.time}</span>
        <button class="history-del" aria-label="Delete entry" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>`;
      // Click content → recall
      li.querySelector('.history-item-content').addEventListener('click', () => {
        Calculator.recallFromHistory(item.result);
        AudioEngine.sounds.digit();
      });
      li.querySelector('.history-item-content').addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          Calculator.recallFromHistory(item.result);
        }
      });
      // Delete button
      li.querySelector('.history-del').addEventListener('click', e => {
        e.stopPropagation();
        remove(item.id);
        AudioEngine.sounds.clear();
      });
      list.appendChild(li);
    });
  }

  /** Export history as JSON download */
  function exportJSON() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href:     url,
      download: `nexus7-history-${Date.now()}.json`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    UI.toast('HISTORY EXPORTED');
  }

  /** Import history from a JSON file */
  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('Invalid format');
        // Validate & merge (deduplicate by id)
        const ids = new Set(items.map(i => i.id));
        let added = 0;
        data.forEach(entry => {
          if (entry.id && entry.expr !== undefined && entry.result !== undefined && !ids.has(entry.id)) {
            items.push(entry);
            ids.add(entry.id);
            added++;
          }
        });
        items.sort((a, b) => b.id - a.id);
        save();
        render();
        UI.toast(`${added} ENTRIES IMPORTED`);
      } catch {
        UI.toast('IMPORT FAILED — INVALID FILE');
      }
    };
    reader.readAsText(file);
  }

  /** Safe HTML escaping */
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function init() {
    load();
    render();
    document.getElementById('historySearch').addEventListener('input', e => setFilter(e.target.value));
    document.getElementById('exportHistory').addEventListener('click', exportJSON);
    document.getElementById('clearAllHistory').addEventListener('click', () => {
      if (confirm('Clear all history?')) { clearAll(); AudioEngine.sounds.clear(); }
    });
    document.getElementById('importHistory').addEventListener('change', e => {
      if (e.target.files[0]) { importJSON(e.target.files[0]); e.target.value = ''; }
    });
  }

  return { init, add, render };
})();


/* ════════════════════════════════════════
   5. CALCULATOR CORE
   ════════════════════════════════════════ */
const Calculator = (() => {

  /* ── State ── */
  const state = {
    current:     '0',       // number being typed
    operator:    null,      // pending operator
    previous:    null,      // previous operand string
    expression:  '',        // display expression string
    result:      null,      // last result
    newNum:      true,      // whether next digit starts fresh
    memory:      0,         // memory register
    angleMode:   'deg',     // 'deg' | 'rad'
    awaitingPow: false,     // waiting for exponent in xʸ
    awaitingMod: false,     // waiting for modulo operand
  };

  /* ── DOM refs ── */
  let displayResult, displayExpr;

  /* ── Helpers ── */

  /** Format number for display — limit significant digits */
  function fmt(n) {
    if (!isFinite(n)) return n > 0 ? 'Infinity' : '-Infinity';
    if (isNaN(n))     return 'Error';
    // Avoid floating-point noise
    const s = parseFloat(n.toPrecision(12)).toString();
    // Scientific notation for very large/small
    if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-8 && n !== 0)) {
      return n.toExponential(8).replace(/\.?0+e/, 'e');
    }
    return s;
  }

  /** Convert degrees to radians if needed */
  function toRad(val) {
    return state.angleMode === 'deg' ? val * (Math.PI / 180) : val;
  }

  /** Factorial — iterative, integer only (max 170) */
  function factorial(n) {
    n = Math.round(n);
    if (n < 0)    return NaN;
    if (n > 170)  return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  /** Update DOM display */
  function updateDisplay() {
    displayResult.textContent = state.current;
    displayExpr.textContent   = state.expression;
    // Trigger CSS pop animation
    displayResult.classList.remove('updated');
    void displayResult.offsetWidth; // force reflow
    displayResult.classList.add('updated');
    // Error styling
    const isErr = state.current === 'Error' || state.current === 'Undefined';
    displayResult.classList.toggle('error', isErr);
  }

  /** Update memory indicator */
  function updateMemIndicator() {
    const el = document.getElementById('memIndicator');
    if (state.memory !== 0) {
      el.textContent = `MEM: ${fmt(state.memory)}`;
      el.classList.add('active');
    } else {
      el.textContent = 'MEM: CLEAR';
      el.classList.remove('active');
    }
  }

  /* ── Core operations ── */

  function pressDigit(digit) {
    if (state.newNum) {
      state.current = digit === '.' ? '0.' : digit;
      state.newNum  = false;
    } else {
      if (digit === '.' && state.current.includes('.')) return;
      if (state.current === '0' && digit !== '.') {
        state.current = digit;
      } else {
        if (state.current.replace('-','').length >= 15) return; // limit length
        state.current += digit;
      }
    }
    updateDisplay();
  }

  function pressOperator(op) {
    // If we already have a pending op and a new number was typed, chain
    if (!state.newNum && state.operator && state.previous !== null) {
      calculate();
    }
    state.previous   = state.current;
    state.operator   = op;
    state.newNum     = true;
    state.expression = `${fmt(parseFloat(state.previous))} ${opSymbol(op)}`;
    updateDisplay();
    // Highlight active op button
    document.querySelectorAll('.btn-op').forEach(b => {
      b.classList.toggle('active', b.dataset.action === op);
    });
  }

  /** Human-readable operator symbol */
  function opSymbol(op) {
    const map = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return map[op] || op;
  }

  /** Evaluate pending binary operation */
  function calculate() {
    if (state.operator === null || state.previous === null) return;
    const a = parseFloat(state.previous);
    const b = parseFloat(state.current);
    const expr = `${fmt(a)} ${opSymbol(state.operator)} ${fmt(b)}`;
    let result;

    switch (state.operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/':
        if (b === 0) { result = a === 0 ? NaN : (a > 0 ? Infinity : -Infinity); }
        else          { result = a / b; }
        break;
      default: return;
    }

    const displayResult = isFinite(result) && !isNaN(result) ? fmt(result) : (isNaN(result) ? 'Error' : fmt(result));
    state.expression = `${expr} =`;
    state.current    = displayResult;
    state.result     = result;
    state.operator   = null;
    state.previous   = null;
    state.newNum     = true;

    if (!isNaN(result)) {
      HistoryManager.add(expr, displayResult);
    }
    updateDisplay();
    document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('active'));
  }

  /** Unary scientific operation */
  function applyUnary(action) {
    const x   = parseFloat(state.current);
    let result, label;

    switch (action) {
      case 'sin':    result = Math.sin(toRad(x));        label = `sin(${fmt(x)})`; break;
      case 'cos':    result = Math.cos(toRad(x));        label = `cos(${fmt(x)})`; break;
      case 'tan':
        // tan(90°) is undefined
        if (state.angleMode === 'deg' && Math.abs(x % 180) === 90) {
          state.current = 'Undefined'; updateDisplay(); return;
        }
        result = Math.tan(toRad(x));                     label = `tan(${fmt(x)})`; break;
      case 'log':
        if (x <= 0) { state.current = 'Error'; updateDisplay(); return; }
        result = Math.log10(x);                          label = `log(${fmt(x)})`; break;
      case 'ln':
        if (x <= 0) { state.current = 'Error'; updateDisplay(); return; }
        result = Math.log(x);                            label = `ln(${fmt(x)})`; break;
      case 'sqrt':
        if (x < 0)  { state.current = 'Error'; updateDisplay(); return; }
        result = Math.sqrt(x);                           label = `√(${fmt(x)})`; break;
      case 'cbrt':   result = Math.cbrt(x);              label = `∛(${fmt(x)})`; break;
      case 'exp':    result = Math.exp(x);               label = `e^(${fmt(x)})`; break;
      case 'x2':     result = x * x;                     label = `(${fmt(x)})²`; break;
      case 'fact':
        if (!Number.isInteger(x) || x < 0) { state.current = 'Error'; updateDisplay(); return; }
        result = factorial(x);                           label = `${fmt(x)}!`; break;
      case 'inv':
        if (x === 0) { state.current = 'Error'; updateDisplay(); return; }
        result = 1 / x;                                  label = `1/${fmt(x)}`; break;
      case 'abs':    result = Math.abs(x);               label = `|${fmt(x)}|`; break;
      default: return;
    }

    const disp = isFinite(result) && !isNaN(result) ? fmt(result) : (isNaN(result) ? 'Error' : fmt(result));
    state.expression = `${label} =`;
    if (!isNaN(result)) HistoryManager.add(label, disp);
    state.current = disp;
    state.result  = result;
    state.newNum  = true;
    updateDisplay();
  }

  /* ── Action dispatcher ── */
  function dispatch(action) {
    /* Digits & decimal */
    if (/^[0-9.]$/.test(action)) {
      pressDigit(action);
      AudioEngine.sounds.digit();
      return;
    }

    switch (action) {
      /* Operators */
      case '+': case '-': case '*': case '/':
        // xʸ power flow
        if (state.awaitingPow) {
          applyPow();
          state.awaitingPow = false;
        }
        if (state.awaitingMod) {
          applyModulo();
          state.awaitingMod = false;
        }
        pressOperator(action);
        AudioEngine.sounds.op();
        break;

      /* Equals */
      case '=':
        if (state.awaitingPow) {
          applyPow();
          state.awaitingPow = false;
        } else if (state.awaitingMod) {
          applyModulo();
          state.awaitingMod = false;
        } else {
          calculate();
        }
        AudioEngine.sounds.eq();
        break;

      /* Clear */
      case 'ac':
        clearAll();
        AudioEngine.sounds.clear();
        break;

      /* Backspace */
      case 'del':
        if (state.newNum) break;
        state.current = state.current.length > 1
          ? state.current.slice(0, -1)
          : '0';
        if (state.current === '-') state.current = '0';
        updateDisplay();
        AudioEngine.sounds.digit();
        break;

      /* Toggle ± */
      case 'toggle':
        if (state.current !== '0' && state.current !== 'Error') {
          state.current = state.current.startsWith('-')
            ? state.current.slice(1)
            : '-' + state.current;
          updateDisplay();
        }
        AudioEngine.sounds.digit();
        break;

      /* Percentage */
      case 'percent': {
        const val = parseFloat(state.current);
        state.current = fmt(state.previous !== null
          ? parseFloat(state.previous) * (val / 100)
          : val / 100);
        state.newNum = true;
        updateDisplay();
        AudioEngine.sounds.op();
        break;
      }

      /* xʸ — first collect base, then wait for exponent */
      case 'xy':
        state.previous   = state.current;
        state.awaitingPow = true;
        state.newNum     = true;
        state.expression = `${fmt(parseFloat(state.previous))} ^`;
        updateDisplay();
        AudioEngine.sounds.op();
        break;

      /* modulo */
      case 'mod':
        state.previous    = state.current;
        state.awaitingMod = true;
        state.newNum      = true;
        state.expression  = `${fmt(parseFloat(state.previous))} mod`;
        updateDisplay();
        AudioEngine.sounds.op();
        break;

      /* Constants */
      case 'pi':
        state.current = fmt(Math.PI);
        state.newNum  = true;
        updateDisplay();
        AudioEngine.sounds.digit();
        break;
      case 'e':
        state.current = fmt(Math.E);
        state.newNum  = true;
        updateDisplay();
        AudioEngine.sounds.digit();
        break;

      /* Memory */
      case 'mc':
        state.memory = 0;
        updateMemIndicator();
        AudioEngine.sounds.mem();
        UI.toast('MEMORY CLEARED');
        break;
      case 'mr':
        state.current = fmt(state.memory);
        state.newNum  = true;
        updateDisplay();
        AudioEngine.sounds.mem();
        break;
      case 'm+':
        state.memory += parseFloat(state.current) || 0;
        updateMemIndicator();
        AudioEngine.sounds.mem();
        UI.toast('MEMORY +');
        break;
      case 'm-':
        state.memory -= parseFloat(state.current) || 0;
        updateMemIndicator();
        AudioEngine.sounds.mem();
        UI.toast('MEMORY −');
        break;

      /* Scientific unaries */
      case 'sin': case 'cos': case 'tan':
      case 'log': case 'ln':  case 'sqrt':
      case 'cbrt': case 'exp': case 'x2':
      case 'fact': case 'inv': case 'abs':
        applyUnary(action);
        AudioEngine.sounds.op();
        break;

      default: break;
    }
  }

  /** Power: previous ^ current */
  function applyPow() {
    const base = parseFloat(state.previous);
    const exp  = parseFloat(state.current);
    const result = Math.pow(base, exp);
    const label  = `${fmt(base)} ^ ${fmt(exp)}`;
    const disp   = fmt(result);
    state.expression = `${label} =`;
    state.current    = disp;
    state.result     = result;
    state.newNum     = true;
    state.operator   = null;
    state.previous   = null;
    if (!isNaN(result)) HistoryManager.add(label, disp);
    updateDisplay();
  }

  /** Modulo: previous mod current */
  function applyModulo() {
    const a = parseFloat(state.previous);
    const b = parseFloat(state.current);
    if (b === 0) { state.current = 'Error'; updateDisplay(); return; }
    const result = a % b;
    const label  = `${fmt(a)} mod ${fmt(b)}`;
    const disp   = fmt(result);
    state.expression = `${label} =`;
    state.current    = disp;
    state.result     = result;
    state.newNum     = true;
    state.operator   = null;
    state.previous   = null;
    HistoryManager.add(label, disp);
    updateDisplay();
  }

  /** Clear all state */
  function clearAll() {
    state.current     = '0';
    state.operator    = null;
    state.previous    = null;
    state.expression  = '';
    state.result      = null;
    state.newNum      = true;
    state.awaitingPow = false;
    state.awaitingMod = false;
    document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('active'));
    updateDisplay();
  }

  /** Recall a value from history */
  function recallFromHistory(val) {
    state.current = val;
    state.newNum  = true;
    updateDisplay();
    UI.toast('RECALLED');
  }

  function setAngleMode(mode) {
    state.angleMode = mode;
  }

  function getCurrentValue() { return state.current; }

  function init() {
    displayResult = document.getElementById('resultLine');
    displayExpr   = document.getElementById('expressionLine');
    updateDisplay();
    updateMemIndicator();
  }

  return { init, dispatch, clearAll, recallFromHistory, setAngleMode, getCurrentValue };
})();


/* ════════════════════════════════════════
   6. UI CONTROLLER
   ════════════════════════════════════════ */
const UI = (() => {

  let historyOpen  = false;
  let sciOpen      = false;
  let soundEnabled = false;

  /* ── Ripple effect ── */
  function addRipple(btn, e) {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x    = (e.clientX || rect.left + rect.width  / 2) - rect.left - size / 2;
    const y    = (e.clientY || rect.top  + rect.height / 2) - rect.top  - size / 2;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  }

  /* ── Keypad button handler ── */
  function handleButtonClick(e) {
    const btn = e.currentTarget;
    addRipple(btn, e);
    const action = btn.dataset.action;
    if (action) Calculator.dispatch(action);
  }

  /* ── Keyboard support ── */
  const keyMap = {
    '0':'0','1':'1','2':'2','3':'3','4':'4',
    '5':'5','6':'6','7':'7','8':'8','9':'9',
    '.':'.', ',':'.',
    '+':'+', '-':'-', '*':'*', '/':'/',
    'Enter':'=', '=':'=',
    'Backspace':'del',
    'Escape':'ac', 'Delete':'ac',
    '%':'percent',
    's':'sin', 'c':'cos', 't':'tan',
    'l':'log', 'n':'ln',
    'r':'sqrt', 'q':'x2',
    '!':'fact',
    'p':'pi', 'e':'e',
  };

  function handleKeydown(e) {
    // Ignore if focus is on an input
    if (document.activeElement.tagName === 'INPUT') return;

    if (e.key === '?') {
      toggleShortcuts();
      return;
    }
    if (e.key === 'h' || e.key === 'H') {
      toggleHistory();
      return;
    }
    if (e.key === 'Escape') {
      const overlay = document.getElementById('shortcutOverlay');
      if (!overlay.classList.contains('hidden')) { overlay.classList.add('hidden'); return; }
    }

    const action = keyMap[e.key];
    if (action) {
      e.preventDefault();
      // Flash the corresponding button
      const btn = document.querySelector(`.btn[data-action="${action}"]`);
      if (btn) {
        btn.classList.add('key-active');
        addRipple(btn, { clientX: null, clientY: null });
        setTimeout(() => btn.classList.remove('key-active'), 150);
      }
      Calculator.dispatch(action);
    }
  }

  /* ── Toggle history panel ── */
  function toggleHistory() {
    historyOpen = !historyOpen;
    const panel  = document.getElementById('historyPanel');
    const toggle = document.getElementById('historyToggle');
    panel.classList.toggle('open', historyOpen);
    panel.setAttribute('aria-hidden', String(!historyOpen));
    toggle.setAttribute('aria-expanded', String(historyOpen));
    toggle.classList.toggle('active', historyOpen);
  }

  /* ── Toggle scientific mode ── */
  function toggleSci() {
    sciOpen = !sciOpen;
    const rows   = document.getElementById('sciRows');
    const toggle = document.getElementById('sciToggle');
    rows.classList.toggle('open', sciOpen);
    rows.setAttribute('aria-hidden', String(!sciOpen));
    toggle.setAttribute('aria-pressed', String(sciOpen));
    toggle.classList.toggle('active', sciOpen);
  }

  /* ── Toggle sound ── */
  function toggleSound() {
    soundEnabled = !soundEnabled;
    AudioEngine.setEnabled(soundEnabled);
    const btn    = document.getElementById('soundToggle');
    const path   = document.getElementById('soundPath');
    const mX1    = document.getElementById('muteX1');
    const mX2    = document.getElementById('muteX2');
    btn.setAttribute('aria-pressed', String(soundEnabled));
    btn.classList.toggle('active', soundEnabled);
    if (path)  path.style.display  = soundEnabled ? '' : 'none';
    if (mX1)   mX1.classList.toggle('hidden', soundEnabled);
    if (mX2)   mX2.classList.toggle('hidden', soundEnabled);
  }

  /* ── Shortcut overlay ── */
  function toggleShortcuts() {
    const overlay = document.getElementById('shortcutOverlay');
    overlay.classList.toggle('hidden');
    if (!overlay.classList.contains('hidden')) {
      document.getElementById('closeShortcuts').focus();
    }
  }

  /* ── Copy result ── */
  function copyResult() {
    const val = Calculator.getCurrentValue();
    if (val === 'Error' || val === 'Undefined') return;
    navigator.clipboard.writeText(val).then(() => {
      AudioEngine.sounds.copy();
      const tooltip = document.querySelector('.copy-tooltip');
      tooltip.classList.add('show');
      setTimeout(() => tooltip.classList.remove('show'), 1600);
    }).catch(() => {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = val;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast('COPIED');
    });
  }

  /* ── Toast notification ── */
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
  }

  /* ── Angle mode buttons ── */
  function initAngleBtns() {
    const deg = document.getElementById('btnDeg');
    const rad = document.getElementById('btnRad');
    deg.addEventListener('click', () => {
      Calculator.setAngleMode('deg');
      deg.classList.add('active');    deg.setAttribute('aria-pressed','true');
      rad.classList.remove('active'); rad.setAttribute('aria-pressed','false');
    });
    rad.addEventListener('click', () => {
      Calculator.setAngleMode('rad');
      rad.classList.add('active');    rad.setAttribute('aria-pressed','true');
      deg.classList.remove('active'); deg.setAttribute('aria-pressed','false');
    });
  }

  /* ── Init all UI bindings ── */
  function init() {
    // Keypad buttons
    document.querySelectorAll('.btn[data-action]').forEach(btn => {
      btn.addEventListener('click', handleButtonClick);
    });

    // Top bar icon buttons
    document.getElementById('historyToggle').addEventListener('click', toggleHistory);
    document.getElementById('sciToggle').addEventListener('click', toggleSci);
    document.getElementById('soundToggle').addEventListener('click', toggleSound);
    document.getElementById('copyBtn').addEventListener('click', copyResult);
    document.getElementById('closeShortcuts').addEventListener('click', toggleShortcuts);

    // Keyboard
    document.addEventListener('keydown', handleKeydown);

    // Angle mode
    initAngleBtns();

    // Shortcut overlay close on backdrop click
    document.getElementById('shortcutOverlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) toggleShortcuts();
    });
  }

  return { init, toast, toggleHistory };
})();


/* ════════════════════════════════════════
   7. INIT — Bootstrap everything
   ════════════════════════════════════════ */
(function init() {
  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    ParticleEngine.start();
    ThemeManager.init();
    HistoryManager.init();
    Calculator.init();
    UI.init();
    console.info('%cNEXUS-7 CALCULATOR · ONLINE', 'color:#00e0ff;font-family:monospace;font-size:14px;font-weight:bold;');
  }
})();
