export type MultipleChoiceQuestion = {
  id: string
  type: 'multiple-choice'
  prompt: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
}

export type TrueFalseQuestion = {
  id: string
  type: 'true-false'
  prompt: string
  correct: boolean
}

export type FillBlankQuestion = {
  id: string
  type: 'fill-blank'
  prompt: string
  answer: string
  hint?: string
}

export type WordBankQuestion = {
  id: string
  type: 'word-bank'
  prompt: string
  pairs: { term: string; definition: string }[]
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | WordBankQuestion

export type Lesson = {
  id: string
  title: string
  intro?: {
    title: string
    body: string
  }
  questions: Question[]
}

export type Unit = {
  id: string
  title: string
  lessons: Lesson[]
}

export type World = {
  id: string
  title: string
  description: string
  icon: string
  color: string
  unlocked: boolean
  units: Unit[]
}

function makeLessons(unitId: string, titles: [string, string, string, string, string]): Lesson[] {
  return titles.map((title, i) => ({
    id: `${unitId}-l${i + 1}`,
    title,
    questions: [],
  }))
}

function makeUnits(worldId: string, units: { title: string; lessons: [string, string, string, string, string] }[]): Unit[] {
  return units.map((u, i) => {
    const unitId = `${worldId}-u${i + 1}`
    return { id: unitId, title: u.title, lessons: makeLessons(unitId, u.lessons) }
  })
}

export const WORLDS: World[] = [
  {
    id: 'w1',
    title: 'Money Basics',
    description: 'Learn what money is, how to save it, and where to keep it.',
    icon: '💰',
    color: 'bg-yellow-500',
    unlocked: true,
    units: makeUnits('w1', [
      {
        title: 'What is Money?',
        lessons: [
          'The History of Money',
          'Why Money Has Value',
          'Types of Currency',
          'Money vs. Barter',
          'How Money Moves',
        ],
      },
      {
        title: 'Saving & Budgeting',
        lessons: [
          'Why Saving Matters',
          'Building a Budget',
          'The 50/30/20 Rule',
          'Emergency Funds',
          'Spending Habits',
        ],
      },
      {
        title: 'Banking Basics',
        lessons: [
          'What is a Bank?',
          'Checking vs. Savings',
          'How Interest Works',
          'Fees to Watch Out For',
          'Digital Banking',
        ],
      },
    ]),
  },
  {
    id: 'w2',
    title: 'Investing 101',
    description: 'Understand stocks, trading, and how to grow your money.',
    icon: '📈',
    color: 'bg-blue-500',
    unlocked: false,
    units: makeUnits('w2', [
      {
        title: 'Stocks & Shares',
        lessons: [
          'What is a Stock?',
          'How Companies Go Public',
          'Reading a Stock Price',
          'Dividends Explained',
          'Stock Market Indices',
        ],
      },
      {
        title: 'Buying & Selling',
        lessons: [
          'How to Place a Trade',
          'Market vs. Limit Orders',
          'Bid, Ask & Spread',
          'When to Buy',
          'When to Sell',
        ],
      },
      {
        title: 'Risk & Reward',
        lessons: [
          'What is Investment Risk?',
          'Risk Tolerance',
          'Volatility Basics',
          'High Risk, High Reward',
          'Playing It Safe',
        ],
      },
    ]),
  },
  {
    id: 'w3',
    title: 'Market Mastery',
    description: 'Master market cycles, diversification, and long-term wealth.',
    icon: '🏆',
    color: 'bg-purple-500',
    unlocked: false,
    units: makeUnits('w3', [
      {
        title: 'Market Cycles',
        lessons: [
          'Bull vs. Bear Markets',
          'Economic Cycles',
          'Recessions & Recoveries',
          'Market Sentiment',
          'Timing the Market',
        ],
      },
      {
        title: 'Diversification',
        lessons: [
          'Don\'t Put All Eggs in One Basket',
          'Asset Classes',
          'Bonds vs. Stocks',
          'ETFs & Index Funds',
          'Rebalancing a Portfolio',
        ],
      },
      {
        title: 'Building Wealth',
        lessons: [
          'Compound Interest',
          'Long-Term Investing',
          'Retirement Accounts',
          'Tax-Advantaged Investing',
          'Your Wealth Plan',
        ],
      },
    ]),
  },
]

// ── World 1 › Unit 1 › Lesson 1: "The History of Money" ──────────────────────
WORLDS[0].units[0].lessons[0].questions = [
  {
    id: 'w1-u1-l1-q1',
    type: 'multiple-choice',
    prompt: 'What is a stock?',
    options: [
      'A loan you give to a company',
      'A share of ownership in a company',
      'A type of savings account',
      'A government-issued bond',
    ],
    correctIndex: 1,
  },
  {
    id: 'w1-u1-l1-q2',
    type: 'true-false',
    prompt: 'The stock market is only open 24 hours a day, 7 days a week.',
    correct: false,
  },
  {
    id: 'w1-u1-l1-q3',
    type: 'fill-blank',
    prompt: 'When you buy a stock, you become a ___ of that company.',
    answer: 'shareholder',
    hint: 'Think about what owning a share makes you.',
  },
  {
    id: 'w1-u1-l1-q4',
    type: 'word-bank',
    prompt: 'Match each term to its definition.',
    pairs: [
      { term: 'Stock',     definition: 'Ownership share in a company' },
      { term: 'Dividend',  definition: 'Company profit paid to shareholders' },
      { term: 'Portfolio', definition: 'A collection of investments' },
    ],
  },
  {
    id: 'w1-u1-l1-q5',
    type: 'multiple-choice',
    prompt: 'Which of these is a real stock exchange?',
    options: ['NYSE', 'GameZone', 'TradeMart', 'BuyHub'],
    correctIndex: 0,
  },
]
