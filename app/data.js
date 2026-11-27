// Seed data for Hearth & Ledger — a fictional household's November 2026 budget.
// Every figure here is invented for the demo: the Marlowe family, two salaries,
// one flat, two kids. The store sums the transactions, so the totals on screen
// always come from this list, never from a hard-coded number.

export const HOUSEHOLD = {
  name: 'The Marlowe household',
  month: 'November 2026',
  monthKey: '2026-11',
  members: ['Daniel', 'Priya', 'Maya (9)', 'Leo (6)'],
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2f6b4f' },
  { id: 'groceries', label: 'Groceries', color: '#4d8a4a' },
  { id: 'utilities', label: 'Utilities', color: '#7a9e3f' },
  { id: 'transport', label: 'Transport', color: '#c98a2b' },
  { id: 'dining', label: 'Dining out', color: '#c25e3a' },
  { id: 'entertainment', label: 'Entertainment', color: '#8a5a9e' },
  { id: 'health', label: 'Health', color: '#3f7d8c' },
  { id: 'kids', label: 'Kids & school', color: '#d97b9b' },
  { id: 'clothing', label: 'Clothing', color: '#6b7280' },
  { id: 'savings', label: 'Savings', color: '#1f4d3a' },
];

export const BUDGETS = {
  housing: 1950,
  groceries: 1050,
  utilities: 240,
  transport: 320,
  dining: 220,
  entertainment: 120,
  health: 200,
  kids: 220,
  clothing: 90,
  savings: 500,
};

export const GOALS = [
  { id: 'emergency', title: 'Emergency fund', target: 10000, saved: 8000, note: 'Six months of rent and bills, kept in a separate account.' },
  { id: 'holiday', title: 'Family holiday', target: 2400, saved: 1450, note: 'A week by the coast next summer — train, cottage, bikes.' },
  { id: 'sofa', title: 'New sofa', target: 1200, saved: 620, note: 'The old one has survived two kids and one dog. It is time.' },
  { id: 'bike', title: 'Bike for Maya', target: 450, saved: 180, note: 'A proper bike for her tenth birthday in March.' },
];

export const BILLS = [
  { label: 'Rent — Willow Court', amount: 1850, due: 'Dec 1', category: 'housing' },
  { label: 'Internet — BrightNet', amount: 59, due: 'Dec 3', category: 'utilities' },
  { label: 'Electricity — City Power (est.)', amount: 98, due: 'Dec 5', category: 'utilities' },
  { label: 'Water — City Water', amount: 55, due: 'Dec 12', category: 'utilities' },
  { label: 'Car insurance', amount: 112, due: 'Dec 18', category: 'transport' },
];

export const TREND = [
  { month: 'Jun', income: 6850, spent: 4480 },
  { month: 'Jul', income: 6850, spent: 4120 },
  { month: 'Aug', income: 6850, spent: 4690 },
  { month: 'Sep', income: 6850, spent: 4310 },
  { month: 'Oct', income: 6850, spent: 4540 },
  { month: 'Nov', income: 6850, spent: 4209 },
];

// One entry per line: id, date (Nov 2026), description, category, amount.
// Positive amounts are money in, negative amounts are money out.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', text: 'Salary — Daniel Marlowe', category: 'income', amount: 3900 },
  { id: 't02', date: '2026-11-01', text: 'Salary — Priya Marlowe', category: 'income', amount: 2950 },
  { id: 't03', date: '2026-11-01', text: 'Rent — Willow Court Apartments', category: 'housing', amount: -1850 },
  { id: 't04', date: '2026-11-02', text: 'Groceries — GreenMart weekly shop', category: 'groceries', amount: -212.4 },
  { id: 't05', date: '2026-11-03', text: 'Electricity — City Power', category: 'utilities', amount: -96.2 },
  { id: 't06', date: '2026-11-04', text: 'Bus passes for the month', category: 'transport', amount: -68 },
  { id: 't07', date: '2026-11-05', text: 'Dinner — Rosa’s Trattoria', category: 'dining', amount: -54.75 },
  { id: 't08', date: '2026-11-05', text: 'Home — light bulbs and repairs', category: 'housing', amount: -86.4 },
  { id: 't09', date: '2026-11-06', text: 'Groceries — GreenMart', category: 'groceries', amount: -148.9 },
  { id: 't10', date: '2026-11-07', text: 'School lunches — Maya and Leo', category: 'kids', amount: -42 },
  { id: 't11', date: '2026-11-07', text: 'Car insurance — monthly', category: 'transport', amount: -112 },
  { id: 't12', date: '2026-11-08', text: 'Streaming — StreamFlix', category: 'entertainment', amount: -15.99 },
  { id: 't13', date: '2026-11-09', text: 'Pharmacy — cold medicine', category: 'health', amount: -38.5 },
  { id: 't14', date: '2026-11-10', text: 'Groceries — farmer’s market', category: 'groceries', amount: -86.3 },
  { id: 't15', date: '2026-11-11', text: 'Fuel — petrol station', category: 'transport', amount: -45 },
  { id: 't16', date: '2026-11-12', text: 'Lunch — Noodle House', category: 'dining', amount: -32.8 },
  { id: 't17', date: '2026-11-13', text: 'Internet — BrightNet', category: 'utilities', amount: -59 },
  { id: 't18', date: '2026-11-14', text: 'Winter coat — Maya', category: 'clothing', amount: -74.99 },
  { id: 't19', date: '2026-11-15', text: 'Groceries — GreenMart', category: 'groceries', amount: -196.45 },
  { id: 't20', date: '2026-11-16', text: 'Cinema night — family of four', category: 'entertainment', amount: -41.5 },
  { id: 't21', date: '2026-11-17', text: 'Dentist check-up — Leo', category: 'health', amount: -120 },
  { id: 't22', date: '2026-11-18', text: 'Train tickets — weekend trip', category: 'transport', amount: -28.4 },
  { id: 't23', date: '2026-11-18', text: 'School trip — Maya', category: 'kids', amount: -65 },
  { id: 't24', date: '2026-11-19', text: 'Takeaway pizza', category: 'dining', amount: -26.9 },
  { id: 't25', date: '2026-11-20', text: 'Groceries — GreenMart', category: 'groceries', amount: -173.2 },
  { id: 't26', date: '2026-11-20', text: 'Home — kitchen towels and cloths', category: 'housing', amount: -47.5 },
  { id: 't27', date: '2026-11-21', text: 'Piano lessons — Maya', category: 'kids', amount: -90 },
  { id: 't28', date: '2026-11-22', text: 'Water bill — City Water', category: 'utilities', amount: -54.1 },
  { id: 't29', date: '2026-11-23', text: 'Board game — family night', category: 'entertainment', amount: -24.99 },
  { id: 't30', date: '2026-11-23', text: 'Books — bedtime stories', category: 'entertainment', amount: -31.2 },
  { id: 't31', date: '2026-11-24', text: 'Sunday brunch — The Corner Café', category: 'dining', amount: -63.4 },
  { id: 't32', date: '2026-11-25', text: 'Groceries — GreenMart', category: 'groceries', amount: -158.75 },
  { id: 't33', date: '2026-11-26', text: 'Fuel — petrol station', category: 'transport', amount: -42 },
  { id: 't34', date: '2026-11-27', text: 'Vitamins and plasters', category: 'health', amount: -22.75 },
  { id: 't35', date: '2026-11-28', text: 'Transfer to savings account', category: 'savings', amount: -500 },
];
