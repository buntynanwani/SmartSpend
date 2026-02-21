# SmartSpend Dashboard: Page Navigation & Analytics

The SmartSpend Power BI application is divided into 6 interactive pages. Each page is designed with a specific analytical purpose, utilizing native visuals and cross-filtering to provide a seamless user experience.

## 📊 1. Overview (Executive Summary)
**Purpose:** To provide a high-level, 5-second understanding of total financial outflow. It acts as the "home page" for the dashboard.
**Key Visuals:**
* **Total Spend Over Time (Clustered Column Chart):** Displays the total financial volume chronologically by Month/Year to spot high-level seasonal peaks.
* **Expenses Breakdown by Category (Horizontal Bar Chart):** Ranks the top spending categories (e.g., Health, Groceries) with clear data labels, omitting the X-axis for a cleaner executive look.
* **Top Merchants (Summary Table):** A sorted list of supermarkets and service providers showing exactly where the most money was spent.

## 🛒 2. Categories & Products (Expenditure Deep Dive)
**Purpose:** To break down the broader categories into specific product-level analytics.
**Key Features:**
* Allows the user to drill down from a macro view (e.g., "Groceries") into a micro view (e.g., specific fruits, household items).
* Helps identify which specific items are driving the costs within the largest spending categories.

## 🏪 3. Shop Comparison (Price & Inflation Tracker)
**Purpose:** A dedicated price-tracking tool designed to monitor actual inflation and compare supermarket pricing dynamically.
**Key Visuals:**
* **Product Slicer:** A searchable dropdown utilizing the `smartspend products[name]` dimension.
* **Transaction History (Detailed Table):** A granular, row-by-row breakdown showing the Date, Product, Shop, Exact Quantity, Unit Price, and Total Paid. 
* **Value:** By bypassing averages and displaying raw transaction dates and prices, this page allows the user to see exactly when a specific supermarket raised or lowered the price of a specific item.

## 👤 4. User Analysis (Profile Spending)
**Purpose:** To separate and analyze expenses by the individual purchaser.
**Key Features:**
* Tracks the financial footprint of the primary user.
* Built on a scalable architecture (`smartspend users` table) that can instantly accommodate shared household expenses or multi-user cost-splitting in future iterations.

## 📈 5. Time Intelligence (Financial Trends)
**Purpose:** To analyze the velocity of spending and month-over-month financial momentum without relying on complex DAX KPIs.
**Key Visuals:**
* **Total Spend Over Time (Area Chart):** A continuous, filled wave chart plotted by `YearMonth` that visualizes the "weight" and volume of spending over the years.
* **Monthly Spending Flow (Waterfall Chart):** A classic financial visualization that automatically calculates and displays the positive (green) or negative (red) variance between consecutive months.

## 🩺 6. Health Tracker (Wellness Investment)
**Purpose:** A highly specialized page completely isolated from regular expenses, focused entirely on physical and mental well-being investments.
**Key Visuals:**
* **Wellness Investment Breakdown (Horizontal Bar Chart):** Highlights specific health sub-categories (e.g., Psychologist sessions, Vitamins, Protein).
* **Monthly Health & Wellness Spend (Column Chart):** Tracks the financial commitment to health over time, filtered strictly by health-related categories via the filter pane.
* **Health Transaction Log (Detailed Table):** A complete chronological ledger of every health-related purchase or clinical visit.