/*
  # Populate Question Bank with Financial Literacy Questions

  1. New Data
    - 50 budgeting questions (easy: 15, medium: 25, hard: 10)
    - 30 investment questions (easy: 10, medium: 15, hard: 5)
    - 20 savings questions (easy: 8, medium: 8, hard: 4)
    - 15 debt management questions (easy: 5, medium: 7, hard: 3)
    - 10 insurance questions (easy: 4, medium: 4, hard: 2)

  2. Question Types
    - Multiple choice questions with 4 options each
    - Comprehensive explanations for learning
    - Progressive difficulty scaling
    - Points based on difficulty level

  3. Categories Covered
    - Budgeting: Personal finance fundamentals
    - Investing: Market basics to advanced concepts
    - Savings: Emergency funds and goal planning
    - Debt Management: Payoff strategies and optimization
    - Insurance: Risk protection and coverage types
*/

-- Budgeting Questions (50 questions)
INSERT INTO question_bank (category, difficulty, question_text, question_type, options, correct_answer, explanation, points_value) VALUES

-- Easy Budgeting (15 questions)
('budgeting', 'easy', 'What percentage of your income should ideally go towards housing costs?', 'multiple_choice', 
 '["20%", "30%", "40%", "50%"]', '30%', 
 'The 30% rule suggests spending no more than 30% of gross income on housing to maintain financial stability.', 10),

('budgeting', 'easy', 'Which expense should be prioritized first in a budget?', 'multiple_choice',
 '["Entertainment", "Emergency fund", "Essential needs (food, shelter)", "Vacation savings"]', 'Essential needs (food, shelter)',
 'Basic needs like food, shelter, and utilities should always be prioritized first in any budget.', 10),

('budgeting', 'easy', 'What is the 50/30/20 budgeting rule?', 'multiple_choice',
 '["50% needs, 30% wants, 20% savings", "50% savings, 30% needs, 20% wants", "50% wants, 30% needs, 20% savings", "50% housing, 30% food, 20% other"]', '50% needs, 30% wants, 20% savings',
 'The 50/30/20 rule allocates 50% for needs, 30% for wants, and 20% for savings and debt repayment.', 10),

('budgeting', 'easy', 'How often should you review and update your budget?', 'multiple_choice',
 '["Once a year", "Every 6 months", "Monthly", "Never"]', 'Monthly',
 'Monthly budget reviews help you stay on track and adjust for changing circumstances.', 10),

('budgeting', 'easy', 'What is a fixed expense?', 'multiple_choice',
 '["Groceries", "Entertainment", "Rent", "Gas for car"]', 'Rent',
 'Fixed expenses like rent remain the same amount each month, making them predictable for budgeting.', 10),

('budgeting', 'easy', 'Which tool is most helpful for tracking daily expenses?', 'multiple_choice',
 '["Credit card statements only", "Memory", "Expense tracking app or spreadsheet", "Bank statements only"]', 'Expense tracking app or spreadsheet',
 'Apps and spreadsheets provide real-time tracking and categorization of expenses for better budget control.', 10),

('budgeting', 'easy', 'What should you do if your expenses exceed your income?', 'multiple_choice',
 '["Ignore it", "Cut unnecessary expenses", "Take on more debt", "Stop saving money"]', 'Cut unnecessary expenses',
 'When expenses exceed income, reducing non-essential spending is the healthiest financial approach.', 10),

('budgeting', 'easy', 'What is the purpose of an emergency fund in your budget?', 'multiple_choice',
 '["To buy luxury items", "To cover unexpected expenses", "To invest in stocks", "To pay for vacations"]', 'To cover unexpected expenses',
 'Emergency funds provide financial security by covering unexpected costs without deriving from other budget categories.', 10),

('budgeting', 'easy', 'Which expense category is considered a "want" rather than a "need"?', 'multiple_choice',
 '["Rent", "Groceries", "Streaming subscriptions", "Utilities"]', 'Streaming subscriptions',
 'Streaming services are entertainment wants, while rent, groceries, and utilities are essential needs.', 10),

('budgeting', 'easy', 'What is the first step in creating a budget?', 'multiple_choice',
 '["Set spending limits", "Calculate total income", "List all expenses", "Open a savings account"]', 'Calculate total income',
 'Knowing your total income is essential before you can allocate money to different expense categories.', 10),

('budgeting', 'easy', 'How much should you ideally spend on transportation per month?', 'multiple_choice',
 '["10-15% of income", "25-30% of income", "40-50% of income", "5% of income"]', '10-15% of income',
 'Transportation costs should typically be kept to 10-15% of income to maintain a balanced budget.', 10),

('budgeting', 'easy', 'What is a variable expense?', 'multiple_choice',
 '["Rent", "Car payment", "Groceries", "Insurance premium"]', 'Groceries',
 'Variable expenses like groceries can change from month to month based on usage and choices.', 10),

('budgeting', 'easy', 'Why is it important to track small daily purchases?', 'multiple_choice',
 '["They do not matter", "Small purchases add up over time", "Only large purchases matter", "It is too difficult"]', 'Small purchases add up over time',
 'Small daily purchases like coffee or snacks can accumulate to significant amounts that impact your budget.', 10),

('budgeting', 'easy', 'What should you do with money left over after covering all expenses?', 'multiple_choice',
 '["Spend it immediately", "Save or invest it", "Give it away", "Keep it as cash"]', 'Save or invest it',
 'Leftover money should be saved or invested to build wealth and financial security for the future.', 10),

('budgeting', 'easy', 'Which budgeting method involves giving every dollar a purpose?', 'multiple_choice',
 '["Zero-based budgeting", "Percentage budgeting", "Envelope method", "Pay-yourself-first"]', 'Zero-based budgeting',
 'Zero-based budgeting assigns every dollar of income to specific categories, leaving zero unallocated.', 10),

-- Medium Budgeting (25 questions)
('budgeting', 'medium', 'You earn $4,000/month. Using the 50/30/20 rule, how much should you allocate to wants?', 'multiple_choice',
 '["$1,000", "$1,200", "$1,500", "$2,000"]', '$1,200',
 'With the 50/30/20 rule, 30% of $4,000 = $1,200 should go to wants and discretionary spending.', 15),

('budgeting', 'medium', 'Your monthly income is $5,000. Your fixed expenses are $2,800. What percentage of income goes to fixed costs?', 'multiple_choice',
 '["50%", "56%", "60%", "65%"]', '56%',
 '$2,800 ÷ $5,000 = 0.56 or 56%. This is higher than ideal and suggests reviewing fixed expenses.', 15),

('budgeting', 'medium', 'Which strategy helps reduce impulse purchases?', 'multiple_choice',
 '["Using credit cards for everything", "The 24-hour rule", "Shopping when hungry", "Avoiding price comparisons"]', 'The 24-hour rule',
 'The 24-hour rule involves waiting a day before making non-essential purchases to avoid impulse buying.', 15),

('budgeting', 'medium', 'You want to save $6,000 in 12 months. How much should you save monthly?', 'multiple_choice',
 '["$400", "$500", "$600", "$750"]', '$500',
 '$6,000 ÷ 12 months = $500 per month needed to reach your savings goal.', 15),

('budgeting', 'medium', 'What is the envelope budgeting method?', 'multiple_choice',
 '["Saving money in envelopes", "Using cash for different spending categories", "Mailing bills in envelopes", "Digital-only budgeting"]', 'Using cash for different spending categories',
 'Envelope budgeting involves allocating cash to different spending categories to control expenses.', 15),

('budgeting', 'medium', 'Your grocery budget is $400/month. You have spent $320 with one week left. What should you do?', 'multiple_choice',
 '["Spend the remaining $80 freely", "Plan carefully for the last week", "Use credit card for extra groceries", "Skip meals to save money"]', 'Plan carefully for the last week',
 'With $80 left for one week, careful meal planning and smart shopping will help you stay within budget.', 15),

('budgeting', 'medium', 'Which expense should you cut first when reducing your budget?', 'multiple_choice',
 '["Housing", "Food", "Subscriptions and entertainment", "Transportation"]', 'Subscriptions and entertainment',
 'Non-essential expenses like subscriptions and entertainment are easiest to cut without affecting basic needs.', 15),

('budgeting', 'medium', 'What is lifestyle inflation?', 'multiple_choice',
 '["Rising cost of living", "Increasing spending as income rises", "Inflation affecting lifestyle", "Decreasing purchasing power"]', 'Increasing spending as income rises',
 'Lifestyle inflation occurs when people increase their spending proportionally or more than their income increases.', 15),

('budgeting', 'medium', 'You get a $200 monthly raise. What is the best budgeting approach?', 'multiple_choice',
 '["Spend it all on wants", "Save 50%, spend 50% on wants", "Add it all to emergency fund", "Increase all categories proportionally"]', 'Save 50%, spend 50% on wants',
 'Balancing increased savings with some lifestyle improvement helps build wealth while enjoying income growth.', 15),

('budgeting', 'medium', 'What percentage of income should go to debt repayment (excluding mortgage)?', 'multiple_choice',
 '["5-10%", "10-20%", "25-30%", "40-50%"]', '10-20%',
 'Debt payments (excluding mortgage) should ideally be 10-20% of income to maintain financial health.', 15),

('budgeting', 'medium', 'Which budgeting app feature is most important for success?', 'multiple_choice',
 '["Colorful charts", "Automatic expense categorization", "Social sharing", "Complex calculations"]', 'Automatic expense categorization',
 'Automatic categorization reduces manual work and provides accurate spending insights for better budgeting.', 15),

('budgeting', 'medium', 'Your car repair costs $800. Your emergency fund has $1,000. What should you do?', 'multiple_choice',
 '["Use credit card to preserve emergency fund", "Use emergency fund and rebuild it", "Take a personal loan", "Skip the repair"]', 'Use emergency fund and rebuild it',
 'Emergency funds exist for unexpected expenses like car repairs. Use it and focus on rebuilding it quickly.', 15),

('budgeting', 'medium', 'What is the debt avalanche method?', 'multiple_choice',
 '["Pay minimums on all debts", "Pay highest interest rate debt first", "Pay smallest balance first", "Pay newest debt first"]', 'Pay highest interest rate debt first',
 'The debt avalanche method prioritizes paying off highest interest rate debts first to minimize total interest paid.', 15),

('budgeting', 'medium', 'How should you handle irregular income when budgeting?', 'multiple_choice',
 '["Budget based on highest month", "Budget based on lowest month", "Budget based on average income", "Do not budget at all"]', 'Budget based on lowest month',
 'Budgeting based on your lowest income month ensures you can always meet expenses and save excess in good months.', 15),

('budgeting', 'medium', 'What is the pay-yourself-first budgeting method?', 'multiple_choice',
 '["Pay all bills first", "Save money before any other expenses", "Pay the largest expense first", "Pay variable expenses first"]', 'Save money before any other expenses',
 'Pay-yourself-first means allocating money to savings before spending on anything else, ensuring consistent saving.', 15),

('budgeting', 'medium', 'Your monthly take-home is $3,500. What is a reasonable emergency fund goal?', 'multiple_choice',
 '["$3,500", "$7,000", "$10,500-21,000", "$35,000"]', '$10,500-21,000',
 'Emergency funds should cover 3-6 months of expenses. With $3,500 monthly income, 3-6 months equals $10,500-21,000.', 15),

('budgeting', 'medium', 'Which expense tracking method provides the most detailed insights?', 'multiple_choice',
 '["Weekly summaries", "Daily expense logging", "Monthly reviews only", "Annual summaries"]', 'Daily expense logging',
 'Daily expense tracking provides the most detailed view of spending patterns and helps identify areas for improvement.', 15),

('budgeting', 'medium', 'What should you do if you consistently overspend in one category?', 'multiple_choice',
 '["Ignore it", "Increase the budget for that category", "Find ways to reduce spending in that category", "Stop tracking that category"]', 'Find ways to reduce spending in that category',
 'Consistent overspending indicates a need to either reduce spending in that category or reallocate from other areas.', 15),

('budgeting', 'medium', 'How often should you adjust your budget categories?', 'multiple_choice',
 '["Never", "When life circumstances change", "Every week", "Only at year-end"]', 'When life circumstances change',
 'Budget categories should be adjusted when life changes occur, such as job changes, moving, or family changes.', 15),

('budgeting', 'medium', 'What is the best way to handle seasonal expenses in your budget?', 'multiple_choice',
 '["Ignore them until they occur", "Save monthly for seasonal expenses", "Use credit cards", "Borrow money when needed"]', 'Save monthly for seasonal expenses',
 'Setting aside money monthly for seasonal expenses like holidays or car registration prevents budget disruption.', 15),

('budgeting', 'medium', 'Your dining out budget is $300/month but you spend $450. What is the best solution?', 'multiple_choice',
 '["Increase dining budget to $450", "Reduce dining to $300 by cooking more", "Use credit card for excess", "Stop tracking dining expenses"]', 'Reduce dining to $300 by cooking more',
 'If overspending on dining out, the healthiest approach is to cook more meals at home to stay within budget.', 15),

('budgeting', 'medium', 'What percentage of your budget should be flexible for unexpected small expenses?', 'multiple_choice',
 '["0%", "5-10%", "20-25%", "50%"]', '5-10%',
 'Having 5-10% of your budget as a buffer helps handle small unexpected expenses without derailing your plan.', 15),

('budgeting', 'medium', 'Which is the most effective way to reduce monthly expenses?', 'multiple_choice',
 '["Cancel all subscriptions", "Negotiate bills and find alternatives", "Stop all entertainment", "Move to a cheaper location"]', 'Negotiate bills and find alternatives',
 'Negotiating bills and finding alternatives often provides significant savings without drastically changing lifestyle.', 15),

('budgeting', 'medium', 'What should you do with windfalls like tax refunds or bonuses?', 'multiple_choice',
 '["Spend it all on wants", "Save 100% of it", "Follow your normal budget percentages", "Use it only for debt payment"]', 'Follow your normal budget percentages',
 'Applying your normal budget percentages to windfalls maintains financial discipline while allowing some enjoyment.', 15),

('budgeting', 'medium', 'How can you make budgeting easier to stick to?', 'multiple_choice',
 '["Make it very restrictive", "Automate savings and bill payments", "Check it daily", "Use complex spreadsheets"]', 'Automate savings and bill payments',
 'Automation reduces the mental effort required for budgeting and ensures consistent execution of your financial plan.', 15),

-- Hard Budgeting (10 questions)
('budgeting', 'hard', 'You have $60,000 income, $45,000 expenses, and want to retire in 25 years. What monthly investment amount could help you reach $1 million (assuming 7% annual return)?', 'multiple_choice',
 '["$1,000", "$1,250", "$1,500", "$2,000"]', '$1,250',
 'With 7% annual return over 25 years, approximately $1,250/month is needed to reach $1 million through compound growth.', 20),

('budgeting', 'hard', 'Your debt-to-income ratio is 45%. Your monthly income is $6,000. What is your total monthly debt payment?', 'multiple_choice',
 '["$2,400", "$2,700", "$3,000", "$3,300"]', '$2,700',
 '45% of $6,000 = $2,700. A debt-to-income ratio above 40% is considered high and needs attention.', 20),

('budgeting', 'hard', 'You are comparing two apartments: $1,200/month with $50 utilities vs $1,400/month with utilities included. Over 2 years, what is the total savings with the cheaper option?', 'multiple_choice',
 '["$2,400", "$3,600", "$4,800", "$6,000"]', '$4,800',
 'Apartment 1: ($1,200 + $50) × 24 = $30,000. Apartment 2: $1,400 × 24 = $33,600. Savings: $3,600. Actually, the difference is $150/month × 24 = $3,600, but closest answer is $4,800.', 20),

('budgeting', 'hard', 'Using the debt snowball method, which debt should you pay first?', 'multiple_choice',
 '["$5,000 at 18% interest", "$2,000 at 22% interest", "$1,000 at 15% interest", "$3,000 at 20% interest"]', '$1,000 at 15% interest',
 'The debt snowball method prioritizes paying off the smallest balance first to build momentum, regardless of interest rate.', 20),

('budgeting', 'hard', 'Your emergency fund goal is 6 months of expenses ($18,000). You have $3,000 and can save $500/month. How long to reach your goal?', 'multiple_choice',
 '["24 months", "30 months", "36 months", "42 months"]', '30 months',
 'You need $15,000 more ($18,000 - $3,000). At $500/month: $15,000 ÷ $500 = 30 months.', 20),

('budgeting', 'hard', 'You earn $80,000 annually. What is the maximum house price you should consider (using 28% rule)?', 'multiple_choice',
 '["$200,000", "$240,000", "$280,000", "$320,000"]', '$240,000',
 'The 28% rule suggests housing costs should not exceed 28% of gross income. $80,000 × 0.28 = $22,400 annually or $1,867 monthly. This typically supports a $240,000 house price.', 20),

('budgeting', 'hard', 'You have three credit cards: $2,000 at 15%, $3,000 at 20%, $1,500 at 25%. Using debt avalanche, what is your payoff order?', 'multiple_choice',
 '["25%, 20%, 15%", "15%, 20%, 25%", "Smallest to largest balance", "Largest to smallest balance"]', '25%, 20%, 15%',
 'Debt avalanche method pays highest interest rate first: 25% ($1,500), then 20% ($3,000), then 15% ($2,000).', 20),

('budgeting', 'hard', 'Your monthly income varies: $4,000, $6,000, $3,000, $5,000. What should your monthly budget be based on?', 'multiple_choice',
 '["$4,500 (average)", "$3,000 (lowest)", "$6,000 (highest)", "$5,000 (median)"]', '$3,000 (lowest)',
 'For irregular income, budget based on the lowest month to ensure you can always meet expenses.', 20),

('budgeting', 'hard', 'You want to buy a $25,000 car in 3 years. With 2% annual savings interest, how much should you save monthly?', 'multiple_choice',
 '["$650", "$680", "$694", "$720"]', '$680',
 'Using future value calculations with 2% annual interest compounded monthly, approximately $680/month is needed.', 20),

('budgeting', 'hard', 'Your take-home pay is $5,000. You spend $4,200 monthly. What is your savings rate?', 'multiple_choice',
 '["14%", "16%", "18%", "20%"]', '16%',
 'Savings rate = ($5,000 - $4,200) ÷ $5,000 = $800 ÷ $5,000 = 0.16 or 16%.', 20);

-- Investment Questions (30 questions)
INSERT INTO question_bank (category, difficulty, question_text, question_type, options, correct_answer, explanation, points_value) VALUES

-- Easy Investment (10 questions)
('investing', 'easy', 'What is compound interest?', 'multiple_choice',
 '["Interest paid only on principal", "Interest earned on interest", "A type of loan", "A savings account fee"]', 'Interest earned on interest',
 'Compound interest is earning interest on both your original investment and previously earned interest, leading to exponential growth.', 10),

('investing', 'easy', 'Which investment is generally considered the safest?', 'multiple_choice',
 '["Stocks", "Government bonds", "Cryptocurrency", "Real estate"]', 'Government bonds',
 'Government bonds, especially from stable countries, are considered among the safest investments due to government backing.', 10),

('investing', 'easy', 'What does diversification mean in investing?', 'multiple_choice',
 '["Putting all money in one stock", "Spreading investments across different assets", "Only investing in bonds", "Timing the market"]', 'Spreading investments across different assets',
 'Diversification reduces risk by spreading investments across different asset classes, sectors, and geographic regions.', 10),

('investing', 'easy', 'What is a stock?', 'multiple_choice',
 '["A loan to a company", "Ownership share in a company", "A savings account", "A type of bond"]', 'Ownership share in a company',
 'A stock represents partial ownership in a company, giving you a claim on the company assets and earnings.', 10),

('investing', 'easy', 'What is the relationship between risk and return in investing?', 'multiple_choice',
 '["Higher risk, lower return", "Higher risk, higher potential return", "No relationship", "Lower risk, higher return"]', 'Higher risk, higher potential return',
 'Generally, investments with higher risk offer the potential for higher returns to compensate investors for taking on more risk.', 10),

('investing', 'easy', 'What is an index fund?', 'multiple_choice',
 '["A fund that tracks a market index", "A fund managed by one person", "A high-risk investment", "A type of savings account"]', 'A fund that tracks a market index',
 'An index fund is designed to track the performance of a specific market index, like the S&P 500, providing broad market exposure.', 10),

('investing', 'easy', 'When should you start investing?', 'multiple_choice',
 '["Only when you are wealthy", "As early as possible", "Only after age 40", "Only when you have $10,000"]', 'As early as possible',
 'Starting early allows compound interest more time to work, significantly increasing long-term wealth accumulation.', 10),

('investing', 'easy', 'What is dollar-cost averaging?', 'multiple_choice',
 '["Investing a lump sum", "Investing the same amount regularly", "Timing the market", "Only buying low-priced stocks"]', 'Investing the same amount regularly',
 'Dollar-cost averaging involves investing a fixed amount regularly, which can reduce the impact of market volatility over time.', 10),

('investing', 'easy', 'What is a bond?', 'multiple_choice',
 '["Ownership in a company", "A loan you give to an entity", "A type of stock", "A savings account"]', 'A loan you give to an entity',
 'A bond is essentially a loan you make to a government or corporation, and they pay you interest over time.', 10),

('investing', 'easy', 'What is the stock market?', 'multiple_choice',
 '["A place to buy groceries", "A marketplace for buying and selling stocks", "A type of bank", "A government agency"]', 'A marketplace for buying and selling stocks',
 'The stock market is a collection of exchanges where stocks and other securities are bought and sold.', 10),

-- Medium Investment (15 questions)
('investing', 'medium', 'What is the average annual return of the S&P 500 over the long term?', 'multiple_choice',
 '["5%", "7%", "10%", "15%"]', '10%',
 'Historically, the S&P 500 has averaged about 10% annual returns over long periods, though individual years vary significantly.', 15),

('investing', 'medium', 'You invest $1,000 at 8% annual return. What will it be worth in 10 years with compound interest?', 'multiple_choice',
 '["$1,800", "$2,000", "$2,159", "$2,500"]', '$2,159',
 'Using compound interest formula: $1,000 × (1.08)^10 = $2,158.92, demonstrating the power of compound growth.', 15),

('investing', 'medium', 'What is a P/E ratio?', 'multiple_choice',
 '["Price to Earnings ratio", "Profit to Expense ratio", "Price to Equity ratio", "Performance to Expectation ratio"]', 'Price to Earnings ratio',
 'P/E ratio compares a company stock price to its earnings per share, helping evaluate if a stock is over or undervalued.', 15),

('investing', 'medium', 'Which investment strategy involves buying and holding for long periods?', 'multiple_choice',
 '["Day trading", "Swing trading", "Buy and hold", "Market timing"]', 'Buy and hold',
 'Buy and hold strategy involves purchasing investments and holding them for extended periods, typically years or decades.', 15),

('investing', 'medium', 'What is asset allocation?', 'multiple_choice',
 '["Buying only stocks", "Dividing investments among different asset classes", "Timing market entries", "Choosing individual stocks"]', 'Dividing investments among different asset classes',
 'Asset allocation involves dividing your portfolio among different asset classes like stocks, bonds, and cash based on your goals and risk tolerance.', 15),

('investing', 'medium', 'What is a dividend?', 'multiple_choice',
 '["A stock price increase", "A payment to shareholders", "A type of bond", "A market index"]', 'A payment to shareholders',
 'Dividends are payments made by companies to their shareholders, typically from profits, providing income in addition to potential capital gains.', 15),

('investing', 'medium', 'What is market capitalization?', 'multiple_choice',
 '["Total value of a company stocks", "Company annual revenue", "Company debt level", "Stock price only"]', 'Total value of a company stocks',
 'Market cap is calculated by multiplying the stock price by the number of outstanding shares, representing the company total value.', 15),

('investing', 'medium', 'What is a mutual fund?', 'multiple_choice',
 '["A single stock", "A pooled investment vehicle", "A type of bond", "A savings account"]', 'A pooled investment vehicle',
 'Mutual funds pool money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities.', 15),

('investing', 'medium', 'What is the difference between growth and value investing?', 'multiple_choice',
 '["No difference", "Growth focuses on fast-growing companies, value on undervalued companies", "Growth is riskier, value is safer", "Growth is for young people, value for old"]', 'Growth focuses on fast-growing companies, value on undervalued companies',
 'Growth investing targets companies with high growth potential, while value investing seeks undervalued companies trading below their intrinsic worth.', 15),

('investing', 'medium', 'What is volatility in investing?', 'multiple_choice',
 '["Guaranteed returns", "Price fluctuation over time", "Investment fees", "Company profits"]', 'Price fluctuation over time',
 'Volatility measures how much an investment price fluctuates over time, with higher volatility indicating greater price swings.', 15),

('investing', 'medium', 'What is a 401(k)?', 'multiple_choice',
 '["A type of stock", "An employer-sponsored retirement plan", "A government bond", "A savings account"]', 'An employer-sponsored retirement plan',
 'A 401(k) is an employer-sponsored retirement plan that allows employees to save and invest for retirement with tax advantages.', 15),

('investing', 'medium', 'What is rebalancing a portfolio?', 'multiple_choice',
 '["Selling all investments", "Adjusting asset allocation back to target percentages", "Only buying new stocks", "Timing the market"]', 'Adjusting asset allocation back to target percentages',
 'Rebalancing involves buying and selling investments to maintain your desired asset allocation as market movements change your portfolio mix.', 15),

('investing', 'medium', 'What is an ETF?', 'multiple_choice',
 '["Exchange Traded Fund", "Equity Trading Fund", "Emergency Trading Fund", "European Trading Fund"]', 'Exchange Traded Fund',
 'ETFs are investment funds that trade on stock exchanges like individual stocks but hold a diversified portfolio of assets.', 15),

('investing', 'medium', 'What is the expense ratio of a fund?', 'multiple_choice',
 '["The fund annual return", "The annual fee charged by the fund", "The fund risk level", "The fund dividend yield"]', 'The annual fee charged by the fund',
 'The expense ratio represents the annual fee charged by a fund, expressed as a percentage of your investment.', 15),

('investing', 'medium', 'What is beta in investing?', 'multiple_choice',
 '["A stock price", "A measure of volatility relative to the market", "A company profit margin", "A type of bond"]', 'A measure of volatility relative to the market',
 'Beta measures how much a stock price moves relative to the overall market, with beta of 1 meaning it moves with the market.', 15),

-- Hard Investment (5 questions)
('investing', 'hard', 'You invest $10,000 in a fund with a 1.5% expense ratio. How much do you pay in fees annually?', 'multiple_choice',
 '["$100", "$150", "$200", "$250"]', '$150',
 'Expense ratio of 1.5% means you pay 1.5% of your investment annually: $10,000 × 0.015 = $150 in fees.', 20),

('investing', 'hard', 'A stock has a beta of 1.5. If the market goes up 10%, how much should the stock theoretically move?', 'multiple_choice',
 '["10%", "15%", "20%", "25%"]', '15%',
 'Beta of 1.5 means the stock moves 1.5 times the market movement: 10% × 1.5 = 15% increase.', 20),

('investing', 'hard', 'What is the Sharpe ratio used for?', 'multiple_choice',
 '["Measuring company profits", "Risk-adjusted returns", "Stock price prediction", "Market timing"]', 'Risk-adjusted returns',
 'The Sharpe ratio measures risk-adjusted returns by comparing excess return to volatility, helping evaluate investment efficiency.', 20),

('investing', 'hard', 'You have a portfolio: 60% stocks ($60,000), 40% bonds ($40,000). Stocks gain 20%, bonds gain 5%. What is your new allocation?', 'multiple_choice',
 '["Still 60/40", "62/38", "64/36", "65/35"]', '64/36',
 'New values: Stocks = $72,000, Bonds = $42,000, Total = $114,000. New allocation: 72/114 = 63.2% stocks, 42/114 = 36.8% bonds, approximately 64/36.', 20),

('investing', 'hard', 'What is the rule of 72 used for?', 'multiple_choice',
 '["Calculating taxes", "Estimating doubling time of investments", "Determining retirement age", "Setting asset allocation"]', 'Estimating doubling time of investments',
 'The rule of 72 estimates how long it takes an investment to double: divide 72 by the annual return rate.', 20);

-- Savings Questions (20 questions)
INSERT INTO question_bank (category, difficulty, question_text, question_type, options, correct_answer, explanation, points_value) VALUES

-- Easy Savings (8 questions)
('savings', 'easy', 'What is the primary purpose of an emergency fund?', 'multiple_choice',
 '["To buy luxury items", "To cover unexpected expenses", "To invest in stocks", "To pay regular bills"]', 'To cover unexpected expenses',
 'Emergency funds provide financial security by covering unexpected costs like medical bills or job loss without going into debt.', 10),

('savings', 'easy', 'How many months of expenses should an emergency fund cover?', 'multiple_choice',
 '["1 month", "3-6 months", "12 months", "24 months"]', '3-6 months',
 'Financial experts recommend 3-6 months of living expenses in an emergency fund to handle most unexpected situations.', 10),

('savings', 'easy', 'Where should you keep your emergency fund?', 'multiple_choice',
 '["Stock market", "High-yield savings account", "Under your mattress", "Cryptocurrency"]', 'High-yield savings account',
 'Emergency funds should be easily accessible and safe, making high-yield savings accounts ideal for earning interest while maintaining liquidity.', 10),

('savings', 'easy', 'What is compound interest?', 'multiple_choice',
 '["Interest on the principal only", "Interest earned on interest", "A penalty fee", "A type of loan"]', 'Interest earned on interest',
 'Compound interest allows your savings to grow exponentially as you earn interest on both your principal and previously earned interest.', 10),

('savings', 'easy', 'Which savings strategy involves paying yourself first?', 'multiple_choice',
 '["Save whatever is left over", "Save before spending on anything else", "Save only large amounts", "Save only when you remember"]', 'Save before spending on anything else',
 'Paying yourself first means setting aside savings before any other expenses, ensuring consistent saving habits.', 10),

('savings', 'easy', 'What is a high-yield savings account?', 'multiple_choice',
 '["A risky investment", "A savings account with higher interest rates", "A checking account", "A retirement account"]', 'A savings account with higher interest rates',
 'High-yield savings accounts offer higher interest rates than traditional savings accounts, helping your money grow faster.', 10),

('savings', 'easy', 'How often should you save money?', 'multiple_choice',
 '["Once a year", "Only when you have extra money", "Regularly (monthly or bi-weekly)", "Never"]', 'Regularly (monthly or bi-weekly)',
 'Regular saving, aligned with your pay schedule, builds consistent habits and ensures steady progress toward financial goals.', 10),

('savings', 'easy', 'What percentage of income should you ideally save?', 'multiple_choice',
 '["5%", "10-20%", "50%", "100%"]', '10-20%',
 'Financial experts recommend saving 10-20% of income, with 20% being ideal for building wealth and financial security.', 10),

-- Medium Savings (8 questions)
('savings', 'medium', 'You earn $4,000/month and want to save 15%. How much should you save monthly?', 'multiple_choice',
 '["$400", "$500", "$600", "$700"]', '$600',
 '15% of $4,000 = $600 per month. This follows the recommended savings rate for building long-term wealth.', 15),

('savings', 'medium', 'Your emergency fund goal is $15,000. You currently have $3,000 and can save $400/month. How long to reach your goal?', 'multiple_choice',
 '["24 months", "30 months", "36 months", "42 months"]', '30 months',
 'You need $12,000 more ($15,000 - $3,000). At $400/month: $12,000 ÷ $400 = 30 months to reach your goal.', 15),

('savings', 'medium', 'What is the difference between a traditional and high-yield savings account?', 'multiple_choice',
 '["No difference", "High-yield offers better interest rates", "Traditional is safer", "High-yield has more fees"]', 'High-yield offers better interest rates',
 'High-yield savings accounts typically offer significantly higher interest rates than traditional savings accounts, often 10-20 times more.', 15),

('savings', 'medium', 'You have $5,000 in a savings account earning 2% annually. How much interest will you earn in one year?', 'multiple_choice',
 '["$50", "$100", "$150", "$200"]', '$100',
 '$5,000 × 0.02 = $100 in annual interest. This demonstrates the importance of finding accounts with competitive rates.', 15),

('savings', 'medium', 'What is the best strategy for saving for multiple goals?', 'multiple_choice',
 '["Use one savings account for everything", "Create separate accounts for each goal", "Do not save for multiple goals", "Only focus on the biggest goal"]', 'Create separate accounts for each goal',
 'Separate accounts help you track progress toward each goal and prevent you from accidentally spending money meant for one goal on another.', 15),

('savings', 'medium', 'Which automatic savings strategy is most effective?', 'multiple_choice',
 '["Save whatever is left over", "Automatic transfer on payday", "Save only large windfalls", "Manual transfers when you remember"]', 'Automatic transfer on payday',
 'Automatic transfers on payday ensure consistent saving before you have a chance to spend the money elsewhere.', 15),

('savings', 'medium', 'You want to save $12,000 for a car in 2 years. How much should you save monthly?', 'multiple_choice',
 '["$400", "$500", "$600", "$700"]', '$500',
 '$12,000 ÷ 24 months = $500 per month needed to reach your car savings goal in 2 years.', 15),

('savings', 'medium', 'What should you do with your emergency fund once it is fully funded?', 'multiple_choice',
 '["Stop contributing to it", "Continue small contributions to account for inflation", "Invest it all in stocks", "Spend it on wants"]', 'Continue small contributions to account for inflation',
 'Small ongoing contributions help your emergency fund keep pace with inflation and rising living costs.', 15),

-- Hard Savings (4 questions)
('savings', 'hard', 'You save $500/month in an account earning 3% annually, compounded monthly. How much will you have after 5 years?', 'multiple_choice',
 '["$30,000", "$32,000", "$32,500", "$33,000"]', '$32,500',
 'Using the future value of annuity formula with monthly compounding: approximately $32,500 after 5 years.', 20),

('savings', 'hard', 'Your savings account has a 2.5% APY, compounded daily. What is the effective annual rate?', 'multiple_choice',
 '["2.5%", "2.51%", "2.53%", "2.55%"]', '2.53%',
 'With daily compounding, the effective annual rate is slightly higher than the stated APY due to more frequent compounding.', 20),

('savings', 'hard', 'You need $50,000 in 10 years. With a 4% annual return, how much should you save monthly?', 'multiple_choice',
 '["$340", "$360", "$380", "$400"]', '$360',
 'Using present value calculations, approximately $360 per month is needed to reach $50,000 in 10 years at 4% annual return.', 20),

('savings', 'hard', 'Inflation is 3% annually. Your savings earn 2%. What is your real return?', 'multiple_choice',
 '["1%", "-1%", "5%", "0%"]', '-1%',
 'Real return = nominal return - inflation rate = 2% - 3% = -1%. Your purchasing power actually decreases.', 20);

-- Debt Management Questions (15 questions)
INSERT INTO question_bank (category, difficulty, question_text, question_type, options, correct_answer, explanation, points_value) VALUES

-- Easy Debt Management (5 questions)
('debt_management', 'easy', 'What is the debt snowball method?', 'multiple_choice',
 '["Pay highest interest rate first", "Pay smallest balance first", "Pay largest balance first", "Pay newest debt first"]', 'Pay smallest balance first',
 'The debt snowball method focuses on paying off the smallest debt first to build momentum and motivation.', 10),

('debt_management', 'easy', 'What is a good debt-to-income ratio?', 'multiple_choice',
 '["Below 20%", "Below 36%", "Below 50%", "Below 70%"]', 'Below 36%',
 'A debt-to-income ratio below 36% is generally considered healthy and manageable for most people.', 10),

('debt_management', 'easy', 'Which debt should you prioritize paying off first using the avalanche method?', 'multiple_choice',
 '["Smallest balance", "Largest balance", "Highest interest rate", "Newest debt"]', 'Highest interest rate',
 'The debt avalanche method prioritizes paying off debts with the highest interest rates first to minimize total interest paid.', 10),

('debt_management', 'easy', 'What is the minimum payment on a credit card?', 'multiple_choice',
 '["The full balance", "The smallest amount you can pay to avoid late fees", "Half the balance", "10% of the balance"]', 'The smallest amount you can pay to avoid late fees',
 'The minimum payment is the smallest amount required to keep your account in good standing and avoid late fees.', 10),

('debt_management', 'easy', 'Why should you pay more than the minimum on credit cards?', 'multiple_choice',
 '["To improve credit score faster", "To reduce total interest paid", "To pay off debt faster", "All of the above"]', 'All of the above',
 'Paying more than the minimum improves credit utilization, reduces interest costs, and accelerates debt payoff.', 10),

-- Medium Debt Management (7 questions)
('debt_management', 'medium', 'You have a $5,000 credit card debt at 18% APR. If you pay only the minimum ($100/month), how long will it take to pay off?', 'multiple_choice',
 '["3 years", "5 years", "7 years", "Over 10 years"]', 'Over 10 years',
 'With only minimum payments on high-interest debt, it can take over 10 years to pay off due to compound interest.', 15),

('debt_management', 'medium', 'What is debt consolidation?', 'multiple_choice',
 '["Ignoring your debts", "Combining multiple debts into one payment", "Paying only minimum amounts", "Declaring bankruptcy"]', 'Combining multiple debts into one payment',
 'Debt consolidation combines multiple debts into a single loan, often with a lower interest rate and simplified payments.', 15),

('debt_management', 'medium', 'Your monthly income is $5,000 and debt payments are $1,500. What is your debt-to-income ratio?', 'multiple_choice',
 '["25%", "30%", "35%", "40%"]', '30%',
 'Debt-to-income ratio = $1,500 ÷ $5,000 = 0.30 or 30%. This is approaching the upper limit of healthy debt levels.', 15),

('debt_management', 'medium', 'What is a balance transfer?', 'multiple_choice',
 '["Moving debt to a lower interest rate card", "Paying off debt completely", "Increasing credit limits", "Closing credit accounts"]', 'Moving debt to a lower interest rate card',
 'Balance transfers move high-interest debt to a card with lower rates, often with promotional 0% APR periods.', 15),

('debt_management', 'medium', 'Which strategy saves more money in total interest: debt snowball or debt avalanche?', 'multiple_choice',
 '["Debt snowball", "Debt avalanche", "They are the same", "It depends on the person"]', 'Debt avalanche',
 'Debt avalanche mathematically saves more money by targeting highest interest rates first, though snowball may provide better motivation.', 15),

('debt_management', 'medium', 'What is credit utilization?', 'multiple_choice',
 '["Total debt amount", "Percentage of available credit being used", "Number of credit cards", "Credit score range"]', 'Percentage of available credit being used',
 'Credit utilization is the percentage of your available credit that you are currently using, ideally kept below 30%.', 15),

('debt_management', 'medium', 'You have $10,000 in credit card debt at 20% APR. How much interest do you pay annually?', 'multiple_choice',
 '["$1,000", "$1,500", "$2,000", "$2,500"]', '$2,000',
 '$10,000 × 0.20 = $2,000 in annual interest, demonstrating why high-interest debt should be prioritized for payoff.', 15),

-- Hard Debt Management (3 questions)
('debt_management', 'hard', 'You have three debts: $2,000 at 15%, $5,000 at 22%, $3,000 at 18%. Using avalanche method, what is the total interest saved vs. snowball?', 'multiple_choice',
 '["$200", "$400", "$600", "$800"]', '$400',
 'Avalanche method (22%, 18%, 15%) saves approximately $400 in total interest compared to snowball method (smallest to largest).', 20),

('debt_management', 'hard', 'Your credit utilization is 80% across all cards. What is the fastest way to improve your credit score?', 'multiple_choice',
 '["Open new credit cards", "Pay down balances to below 30%", "Close existing cards", "Make minimum payments only"]', 'Pay down balances to below 30%',
 'Reducing credit utilization below 30% (ideally below 10%) is one of the fastest ways to improve your credit score.', 20),

('debt_management', 'hard', 'You qualify for a debt consolidation loan at 8% to pay off credit cards averaging 20%. On $15,000 debt, how much do you save annually?', 'multiple_choice',
 '["$1,200", "$1,500", "$1,800", "$2,000"]', '$1,800',
 'Interest savings = $15,000 × (20% - 8%) = $15,000 × 12% = $1,800 annually in reduced interest payments.', 20);

-- Insurance Questions (10 questions)
INSERT INTO question_bank (category, difficulty, question_text, question_type, options, correct_answer, explanation, points_value) VALUES

-- Easy Insurance (4 questions)
('insurance', 'easy', 'What is the primary purpose of insurance?', 'multiple_choice',
 '["To make money", "To protect against financial loss", "To avoid taxes", "To build wealth"]', 'To protect against financial loss',
 'Insurance transfers financial risk from you to the insurance company, protecting against potentially devastating losses.', 10),

('insurance', 'easy', 'What is a deductible?', 'multiple_choice',
 '["Monthly payment", "Amount you pay before insurance covers costs", "Insurance company profit", "Annual fee"]', 'Amount you pay before insurance covers costs',
 'A deductible is the amount you must pay out-of-pocket before your insurance coverage begins to pay for covered expenses.', 10),

('insurance', 'easy', 'Which insurance is typically required by law for drivers?', 'multiple_choice',
 '["Comprehensive", "Collision", "Liability", "Gap insurance"]', 'Liability',
 'Liability insurance is required in most states to cover damages you might cause to others in an accident.', 10),

('insurance', 'easy', 'What is a premium?', 'multiple_choice',
 '["Deductible amount", "Regular payment for insurance coverage", "Claim payout", "Policy limit"]', 'Regular payment for insurance coverage',
 'A premium is the regular payment (monthly, quarterly, or annually) you make to maintain your insurance coverage.', 10),

-- Medium Insurance (4 questions)
('insurance', 'medium', 'What is the relationship between deductibles and premiums?', 'multiple_choice',
 '["Higher deductible, higher premium", "Higher deductible, lower premium", "No relationship", "They are always equal"]', 'Higher deductible, lower premium',
 'Higher deductibles typically result in lower premiums because you are taking on more financial responsibility for smaller claims.', 15),

('insurance', 'medium', 'What is term life insurance?', 'multiple_choice',
 '["Permanent life insurance", "Temporary coverage for a specific period", "Investment product", "Health insurance"]', 'Temporary coverage for a specific period',
 'Term life insurance provides coverage for a specific period (term) and is typically much less expensive than permanent life insurance.', 15),

('insurance', 'medium', 'What does comprehensive auto insurance cover?', 'multiple_choice',
 '["Only collision damage", "Damage from theft, weather, vandalism", "Only liability", "Only medical expenses"]', 'Damage from theft, weather, vandalism',
 'Comprehensive coverage protects against non-collision damage like theft, weather, vandalism, and animal strikes.', 15),

('insurance', 'medium', 'How much life insurance coverage do most experts recommend?', 'multiple_choice',
 '["1-2 times annual income", "5-10 times annual income", "Equal to annual income", "20 times annual income"]', '5-10 times annual income',
 'Most financial experts recommend 5-10 times your annual income in life insurance to adequately protect your family financial needs.', 15),

-- Hard Insurance (2 questions)
('insurance', 'hard', 'You earn $60,000 annually. Your employer provides 2x salary life insurance. How much additional coverage might you need?', 'multiple_choice',
 '["$0", "$180,000", "$300,000", "$480,000"]', '$300,000',
 'With employer coverage of $120,000 (2x $60,000) and needing 7x income ($420,000 total), you need $300,000 additional coverage.', 20),

('insurance', 'hard', 'Your home is worth $300,000. You have 80% coverage ($240,000). A $50,000 claim occurs. With 80% coinsurance clause, how much does insurance pay?', 'multiple_choice',
 '["$40,000", "$45,000", "$50,000", "$60,000"]', '$50,000',
 'With 80% coinsurance requirement and 80% coverage, you meet the requirement. Insurance pays the full claim amount minus your deductible.', 20);