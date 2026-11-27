// Hearth & Ledger — router and wiring. The pages are rendered by views.js;
// this file decides which page shows, and makes every control do its job:
// adding and deleting transactions, filtering the ledger, editing budgets,
// adding to goals, and resetting the demo data.

import { HOUSEHOLD } from './data.js';
import {
  addToGoal,
  addTransaction,
  deleteTransaction,
  loadState,
  resetState,
  saveState,
  setBudget,
} from './store.js';
import {
  renderBudget,
  renderDashboard,
  renderGoals,
  renderInsights,
  renderTransactions,
} from './views.js';

const view = document.getElementById('view');
const navLinks = [...document.querySelectorAll('[data-route]')];
let state = loadState();
let txFilter = { q: '', category: 'all', kind: 'all' };

const ROUTES = {
  '/': { render: () => renderDashboard(state), title: 'Dashboard' },
  '/transactions': { render: () => renderTransactions(state, txFilter), title: 'Transactions' },
  '/budget': { render: () => renderBudget(state), title: 'Budgets' },
  '/goals': { render: () => renderGoals(state), title: 'Savings goals' },
  '/insights': { render: () => renderInsights(state), title: 'Insights' },
};

function currentRoute() {
  const hash = location.hash.replace(/^#/, '') || '/';
  return ROUTES[hash] ? hash : '/';
}

function render() {
  const route = currentRoute();
  view.innerHTML = ROUTES[route].render();
  document.title = `${ROUTES[route].title} · Hearth & Ledger — ${HOUSEHOLD.month} budget`;
  navLinks.forEach((a) => {
    const on = a.getAttribute('href') === '#' + route;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}

function rerender() {
  render();
}

window.addEventListener('hashchange', render);

// Every control on every page is handled here, by delegation, so the
// handlers survive each re-render.
document.addEventListener('submit', (event) => {
  const form = event.target;
  if (form.id === 'add-form') {
    event.preventDefault();
    const data = new FormData(form);
    const amount = Math.abs(Number(data.get('amount')));
    if (!amount || amount <= 0) return;
    addTransaction(state, {
      text: String(data.get('text')).trim(),
      amount: data.get('kind') === 'income' ? amount : -amount,
      category: String(data.get('category')),
      date: String(data.get('date')),
    });
    txFilter = { q: '', category: 'all', kind: 'all' };
    location.hash = '#/transactions';
    rerender();
  }
  if (form.classList.contains('goal-form')) {
    event.preventDefault();
    const amount = Number(new FormData(form).get('amount'));
    if (!amount || amount <= 0) return;
    addToGoal(state, form.dataset.goal, amount);
    rerender();
  }
});

document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-action="delete-tx"]');
  if (btn) {
    deleteTransaction(state, btn.dataset.id);
    rerender();
    return;
  }
  const reset = event.target.closest('[data-action="reset-demo"]');
  if (reset) {
    state = resetState();
    txFilter = { q: '', category: 'all', kind: 'all' };
    rerender();
  }
});

document.addEventListener('change', (event) => {
  const el = event.target;
  if (el.id === 'filter-q') return; // search is handled on input
  if (el.id === 'filter-cat') {
    txFilter.category = el.value;
    rerender();
  }
  if (el.id === 'filter-kind') {
    txFilter.kind = el.value;
    rerender();
  }
  if (el.dataset.action === 'set-budget') {
    setBudget(state, el.dataset.id, Number(el.value));
    rerender();
  }
});

document.addEventListener('input', (event) => {
  const el = event.target;
  if (el.id === 'filter-q') {
    txFilter.q = el.value;
    // Re-render only the table, so typing never loses focus.
    const table = view.querySelector('table.ledger tbody');
    const count = view.querySelector('.filters .hint');
    if (!table) return;
    const html = renderTransactions(state, txFilter);
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    table.innerHTML = tmp.querySelector('table.ledger tbody').innerHTML;
    if (count) count.textContent = tmp.querySelector('.filters .hint').textContent;
    const q = document.getElementById('filter-q');
    if (q) {
      q.focus();
      q.setSelectionRange(q.value.length, q.value.length);
    }
  }
});

render();
