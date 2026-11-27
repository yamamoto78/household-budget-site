// One renderer per page. Each takes the state and returns the page's HTML.
// The router in app.js drops it into #view and the page's own controls
// (forms, buttons, selects) are wired by delegation in app.js.

import { BILLS, CATEGORIES, HOUSEHOLD, TREND } from './data.js';
import {
  budgetTotal,
  categoryById,
  incomeOf,
  leftOverOf,
  livingSpentOf,
  money,
  moneyWhole,
  pct,
  savedOf,
  spentByCategory,
  spentOf,
} from './store.js';
import { donutChart, trendChart } from './charts.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function dateLabel(iso) {
  const [, m, d] = iso.split('-');
  return `${m}/${d}`;
}

function transactionRow(t) {
  const cat = categoryById(t.category);
  const sign = t.amount > 0 ? '+' : '−';
  const cls = t.amount > 0 ? 'amount in' : 'amount out';
  return `<tr><td class="date">${dateLabel(t.date)}</td><td>${esc(t.text)}</td><td><span class="tag" style="--tag:${cat.color}">${cat.label}</span></td><td class="${cls}">${sign}${money(Math.abs(t.amount))}</td><td><button class="link-btn" data-action="delete-tx" data-id="${t.id}" aria-label="Delete ${esc(t.text)}">Delete</button></td></tr>`;
}

function addForm() {
  const options = CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('');
  return `<form id="add-form" class="card form-card">
    <h3>Add a transaction</h3>
    <label>Description <input name="text" type="text" required maxlength="80" placeholder="e.g. Groceries — GreenMart"></label>
    <div class="form-row">
      <label>Amount ($) <input name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00"></label>
      <label>Type
        <select name="kind"><option value="expense">Expense</option><option value="income">Income</option></select>
      </label>
    </div>
    <div class="form-row">
      <label>Category <select name="category">${options}</select></label>
      <label>Date <input name="date" type="date" value="2026-11-28" required></label>
    </div>
    <button type="submit" class="btn">Add to the ledger</button>
    <p class="hint">Amounts are stored only in this browser. Nothing leaves the page.</p>
  </form>`;
}

export function renderDashboard(state) {
  const income = incomeOf(state);
  const spent = livingSpentOf(state);
  const saved = savedOf(state);
  const left = leftOverOf(state);
  const byCat = spentByCategory(state);
  const slices = byCat.filter((c) => c.spent > 0).map((c) => ({ label: c.label, value: c.spent, color: c.color }));
  const recent = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);
  const over = byCat.filter((c) => c.spent > c.budget);
  const top = [...byCat].sort((a, b) => b.spent - a.spent)[0];
  const billsTotal = BILLS.reduce((s, b) => s + b.amount, 0);
  return `
  <section class="hero">
    <div>
      <p class="eyebrow">November 2026 · ${esc(HOUSEHOLD.name)}</p>
      <h1>Every dollar has a job.</h1>
      <p class="lede">Income, spending, budgets and goals for the whole household — in one place, up to date, and honest about the month so far.</p>
    </div>
    <div class="hero-note">
      <p class="hero-note-title">Coming up</p>
      <p><strong>${moneyWhole(billsTotal)}</strong> of bills due before Dec 18, starting with rent on Dec 1.</p>
      <a class="btn btn-ghost" href="#/transactions">See all transactions →</a>
    </div>
  </section>

  <section class="cards" aria-label="Month summary">
    <article class="card stat"><p class="stat-label">Income</p><p class="stat-value">${money(income)}</p><p class="stat-note">Two salaries, Nov 1</p></article>
    <article class="card stat"><p class="stat-label">Spent on living</p><p class="stat-value">${money(spent)}</p><p class="stat-note">${pct(spent, income)}% of income</p></article>
    <article class="card stat"><p class="stat-label">Moved to savings</p><p class="stat-value">${money(saved)}</p><p class="stat-note">Emergency fund first</p></article>
    <article class="card stat highlight"><p class="stat-label">Left over</p><p class="stat-value">${money(left)}</p><p class="stat-note">Free to save or spend</p></article>
  </section>

  ${over.length ? `<div class="alert" role="alert"><strong>Over budget:</strong> ${over.map((c) => `${c.label} is ${money(c.spent - c.budget)} over its ${moneyWhole(c.budget)} budget`).join('; ')}.</div>` : ''}

  <section class="split">
    <article class="card">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donutChart(slices, 'spent', moneyWhole(spent))}
        <ul class="legend">${byCat.filter((c) => c.spent > 0).map((c) => `<li><span class="dot" style="background:${c.color}"></span>${c.label} <strong>${moneyWhole(c.spent)}</strong> · ${pct(c.spent, spent)}%</li>`).join('')}</ul>
      </div>
      <p class="hint">${top.label} is the biggest slice at ${pct(top.spent, spent)}% of spending. <a href="#/budget">Check the budgets →</a></p>
    </article>
    <article class="card">
      <h2>Recent transactions</h2>
      <table class="ledger"><thead><tr><th>Date</th><th>What</th><th>Category</th><th>Amount</th><th></th></tr></thead>
      <tbody>${recent.map(transactionRow).join('')}</tbody></table>
      <p class="hint"><a href="#/transactions">All ${state.transactions.length} transactions →</a></p>
    </article>
  </section>

  <section class="split">
    <article class="card">
      <h2>Budgets at a glance</h2>
      ${byCat.slice(0, 5).map((c) => `<div class="bar-row"><span>${c.label}</span><div class="bar"><span style="width:${Math.min(100, pct(c.spent, c.budget))}%;background:${c.spent > c.budget ? '#b3382e' : c.color}"></span></div><strong>${moneyWhole(c.spent)} / ${moneyWhole(c.budget)}</strong></div>`).join('')}
      <p class="hint"><a href="#/budget">All ten budgets →</a></p>
    </article>
    <article class="card">
      <h2>Upcoming bills</h2>
      <ul class="bills">${BILLS.map((b) => `<li><span>${esc(b.label)}</span><strong>${money(b.amount)}</strong><em>due ${b.due}</em></li>`).join('')}</ul>
      <p class="hint"><a href="#/goals">See savings goals →</a></p>
    </article>
  </section>`;
}

export function renderTransactions(state, filter = {}) {
  const q = (filter.q || '').toLowerCase();
  const cat = filter.category || 'all';
  const kind = filter.kind || 'all';
  let rows = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  if (cat !== 'all') rows = rows.filter((t) => t.category === cat);
  if (kind === 'income') rows = rows.filter((t) => t.amount > 0);
  if (kind === 'expense') rows = rows.filter((t) => t.amount < 0);
  if (q) rows = rows.filter((t) => t.text.toLowerCase().includes(q));
  const catOptions = `<option value="all">All categories</option>` + CATEGORIES.map((c) => `<option value="${c.id}" ${c.id === cat ? 'selected' : ''}>${c.label}</option>`).join('');
  return `
  <h1>Transactions</h1>
  <p class="lede">Every dollar in and out this month. Filter, search, add one — or delete a mistake.</p>
  <section class="card filters">
    <label>Search <input id="filter-q" type="search" placeholder="e.g. GreenMart" value="${esc(filter.q || '')}"></label>
    <label>Category <select id="filter-cat">${catOptions}</select></label>
    <label>Type <select id="filter-kind"><option value="all">All</option><option value="income" ${kind === 'income' ? 'selected' : ''}>Income</option><option value="expense" ${kind === 'expense' ? 'selected' : ''}>Expenses</option></select></label>
    <p class="hint">${rows.length} of ${state.transactions.length} shown</p>
  </section>
  <div class="split split-wide">
    <section class="card">
      <table class="ledger"><thead><tr><th>Date</th><th>What</th><th>Category</th><th>Amount</th><th></th></tr></thead>
      <tbody>${rows.length ? rows.map(transactionRow).join('') : '<tr><td colspan="5">Nothing matches those filters yet.</td></tr>'}</tbody></table>
    </section>
    ${addForm()}
  </div>`;
}

export function renderBudget(state) {
  const byCat = spentByCategory(state);
  const totalBudget = budgetTotal(state);
  // Count every category, savings transfer included, so this total agrees
  // with the bars below it.
  // Every category gets a row, savings transfer included, so the list
  // agrees with the "All ten categories" total above it.
  const rows = CATEGORIES.map((c) => ({ ...c, spent: spentOf(state, c.id), budget: state.budgets[c.id] || 0 }));
  const totalSpent = rows.reduce((s, c) => s + c.spent, 0);
  return `
  <h1>Monthly budgets</h1>
  <p class="lede">A cap for each part of the household's spending. The bars move as transactions are added — nothing here is a guess.</p>
  <section class="cards" aria-label="Budget totals">
    <article class="card stat"><p class="stat-label">Total budget</p><p class="stat-value">${moneyWhole(totalBudget)}</p><p class="stat-note">All ten categories</p></article>
    <article class="card stat"><p class="stat-label">Spent so far</p><p class="stat-value">${moneyWhole(totalSpent)}</p><p class="stat-note">${pct(totalSpent, totalBudget)}% of the month's budget</p></article>
    <article class="card stat highlight"><p class="stat-label">Still to spend</p><p class="stat-value">${moneyWhole(Math.max(0, totalBudget - totalSpent))}</p><p class="stat-note">Across categories under budget</p></article>
  </section>
  <section class="card">
    <h2>By category</h2>
    ${rows.map((c) => {
      const p = pct(c.spent, c.budget);
      const left = c.budget - c.spent;
      const status = left < 0 ? `<span class="over">Over by ${money(Math.abs(left))}</span>` : `<span class="under">${money(left)} left</span>`;
      return `<div class="budget-row">
        <div class="budget-head"><span class="dot" style="background:${c.color}"></span><strong>${c.label}</strong>${status}</div>
        <div class="bar big"><span style="width:${Math.min(100, p)}%;background:${left < 0 ? '#b3382e' : c.color}"></span></div>
        <div class="budget-figures"><span>${money(c.spent)} spent</span><span>${p}%</span><span>of ${moneyWhole(c.budget)}</span>
        <label class="budget-edit">Budget $ <input type="number" min="0" step="1" value="${c.budget}" data-action="set-budget" data-id="${c.id}" aria-label="${c.label} budget"></label></div>
      </div>`;
    }).join('')}
    <p class="hint">Change a budget amount and it saves at once — the dashboard and the totals update with it.</p>
  </section>`;
}

export function renderGoals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <h1>Savings goals</h1>
  <p class="lede">What the household is saving for, and how close each goal is. Add to a goal whenever there is money left over.</p>
  <section class="cards" aria-label="Goals totals">
    <article class="card stat"><p class="stat-label">Saved across goals</p><p class="stat-value">${moneyWhole(totalSaved)}</p><p class="stat-note">Four goals in progress</p></article>
    <article class="card stat"><p class="stat-label">Still to save</p><p class="stat-value">${moneyWhole(totalTarget - totalSaved)}</p><p class="stat-note">To finish all four</p></article>
    <article class="card stat highlight"><p class="stat-label">Overall progress</p><p class="stat-value">${pct(totalSaved, totalTarget)}%</p><p class="stat-note">Of ${moneyWhole(totalTarget)} in goals</p></article>
  </section>
  <section class="goal-grid">
    ${state.goals.map((g) => {
      const p = pct(g.saved, g.target);
      return `<article class="card goal">
        <h2>${esc(g.title)}</h2>
        <p class="goal-figures"><strong>${moneyWhole(g.saved)}</strong> of ${moneyWhole(g.target)} · ${p}%</p>
        <div class="bar big"><span style="width:${p}%;background:#2f6b4f"></span></div>
        <p>${esc(g.note)}</p>
        <form class="goal-form" data-goal="${g.id}">
          <label>Add to this goal ($) <input name="amount" type="number" min="1" step="1" required placeholder="50"></label>
          <button class="btn btn-small" type="submit">Add</button>
        </form>
      </article>`;
    }).join('')}
  </section>
  <p class="hint">Goals are funded from the month's left-over money — November has ${money(leftOverOf(state))} left over after spending and the savings transfer.</p>`;
}

export function renderInsights(state) {
  const byCat = spentByCategory(state);
  const spent = livingSpentOf(state);
  const income = incomeOf(state);
  const sorted = [...byCat].sort((a, b) => b.spent - a.spent);
  const top = sorted[0];
  const second = sorted[1];
  const under = byCat.filter((c) => c.spent < c.budget).sort((a, b) => (a.budget - a.spent) - (b.budget - b.spent)).pop();
  const oct = TREND.find((m) => m.month === 'Oct');
  const novChange = pct(spent - oct.spent, oct.spent);
  const trendMonths = TREND.map((m) => (m.month === 'Nov' ? { ...m, spent } : m));
  const tips = [
    { title: `${top.label} runs the month`, body: `${moneyWhole(top.spent)} — ${pct(top.spent, spent)}% of what the household spent. It is mostly fixed (rent), so the lever is everywhere else.` },
    { title: `Dining out is ${pct(spentOf(state, 'dining'), spent)}% of spending`, body: `Four meals out cost ${money(spentOf(state, 'dining'))}. Cooking one of those at home would free about $30 a month — a third of the bike fund.` },
    { title: `November is ${Math.abs(novChange)}% ${novChange < 0 ? 'cheaper' : 'dearer'} than October`, body: `October's spending was ${moneyWhole(oct.spent)}; November is at ${moneyWhole(spent)} so far. Groceries fell the most.` },
    { title: `${under.label} has the most slack`, body: `${money(under.budget - under.spent)} of its ${moneyWhole(under.budget)} budget is still unspent. If it stays unspent, move it to the holiday goal on the 30th.` },
  ];
  return `
  <h1>Insights</h1>
  <p class="lede">What the numbers actually say — computed from this month's ledger, not generic advice.</p>
  <section class="card">
    <h2>Income vs spending, June to November</h2>
    ${trendChart(trendMonths)}
    <p class="legend-inline"><span class="dot" style="background:#2f6b4f"></span> Income <span class="dot" style="background:#c98a2b"></span> Spending</p>
    <p class="hint">Income is steady at ${moneyWhole(income)} a month. Spending moves between ${moneyWhole(Math.min(...trendMonths.map((m) => m.spent)))} and ${moneyWhole(Math.max(...trendMonths.map((m) => m.spent)))} — November is the cheapest month so far.</p>
  </section>
  <section class="tip-grid">
    ${tips.map((t) => `<article class="card tip"><h2>${esc(t.title)}</h2><p>${esc(t.body)}</p></article>`).join('')}
  </section>
  <section class="card">
    <h2>Biggest categories</h2>
    <ol class="ranked">${sorted.slice(0, 5).map((c, i) => `<li><span class="rank">${i + 1}</span><span class="dot" style="background:${c.color}"></span>${c.label}<strong>${moneyWhole(c.spent)}</strong><em>${pct(c.spent, spent)}% of spending</em></li>`).join('')}</ol>
    <p class="hint">Second place, ${second.label} at ${moneyWhole(second.spent)}, is mostly the weekly shop — it is the category where planning meals saves the most.</p>
  </section>`;
}