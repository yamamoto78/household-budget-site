// The household's ledger: loads the seed data, keeps every change in
// localStorage, and answers every "how much?" question from the transactions
// themselves, so the numbers on screen can never drift from the list.

import { BUDGETS, CATEGORIES, GOALS, TRANSACTIONS } from './data.js';

const KEY = 'hearth-ledger-v1';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function freshState() {
  return {
    transactions: clone(TRANSACTIONS),
    budgets: { ...BUDGETS },
    goals: clone(GOALS),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !parsed.budgets) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
  return freshState();
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#6b7280' };
}

export function incomeOf(state) {
  return state.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
}

export function spentOf(state, categoryId) {
  return state.transactions
    .filter((t) => t.amount < 0 && (!categoryId || t.category === categoryId))
    .reduce((s, t) => s + Math.abs(t.amount), 0);
}

export function savedOf(state) {
  return spentOf(state, 'savings');
}

// Money spent on life, not counting the transfer to savings.
export function livingSpentOf(state) {
  return state.transactions
    .filter((t) => t.amount < 0 && t.category !== 'savings')
    .reduce((s, t) => s + Math.abs(t.amount), 0);
}

export function leftOverOf(state) {
  return incomeOf(state) - spentOf(state);
}

export function budgetTotal(state) {
  return Object.values(state.budgets).reduce((s, v) => s + v, 0);
}

export function spentByCategory(state) {
  return CATEGORIES.filter((c) => c.id !== 'savings').map((c) => ({
    ...c,
    spent: spentOf(state, c.id),
    budget: state.budgets[c.id] || 0,
  }));
}

export function addTransaction(state, { text, amount, category, date }) {
  const id = 'u' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  state.transactions.push({ id, date, text, category, amount });
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
  saveState(state);
  return id;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState(state);
}

export function setBudget(state, categoryId, amount) {
  state.budgets[categoryId] = Math.max(0, amount);
  saveState(state);
}

export function addToGoal(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;
  goal.saved = Math.min(goal.target, Math.max(0, goal.saved + amount));
  saveState(state);
}

export function money(n) {
  const sign = n < 0 ? '−' : '';
  return sign + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function moneyWhole(n) {
  const sign = n < 0 ? '−' : '';
  return sign + '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}
