# SmartSpend: Power BI Analytics Integration & Data Modeling

## 📌 Project Overview
As part of the SmartSpend full-stack ecosystem, this Power BI integration serves as the primary analytical engine. It connects directly to the system's database to transform raw transactional data into interactive, actionable financial insights. The dashboard is designed to be easily understood by non-technical users while utilizing advanced data modeling and DAX calculations under the hood.

---

## ⚙️ Phase 1: Data Architecture & Connectivity

### 1. Database Connection
To establish a seamless data pipeline, the **MySQL Database Connector** was installed and configured within Power BI. This allows the dashboard to fetch real-time (or scheduled) updates directly from the custom SmartSpend backend.

### 2. Data Import & Modeling
A Star Schema (with minor dimension extensions) was built by importing the following core tables from the database:

* `brands`: Brand information for purchased items.
* `categories`: Groupings for products (e.g., Groceries, Health, Utilities).
* `products`: The specific items purchased.
* `purchase_items`: Line-item details of each transaction (bridging purchases and products).
* `purchases`: The header table containing transaction dates and totals.
* `shops`: The merchants or supermarkets where transactions occurred.
* `users`: The individuals making the purchases.

In this model, `purchase_items` acts as the central fact table, with all other tables serving as dimensions that radiate outward from it. The minor extensions — `products` connecting to both `categories` and `brands` — add one additional level of normalization while preserving the overall star structure.

A calculated `DateTable` was also created using DAX's `CALENDAR` function, extended with columns for Year, Month, Quarter, Week Number, Day of Week, and a Weekend flag. This table was marked as the official Date Table in Power BI and connected to the purchases date column — a mandatory step to enable Power BI's built-in time intelligence functions such as month-over-month comparisons, year-to-date totals, and rolling averages.

---

## 🧮 Phase 2: DAX Measures & Calculations

To keep the model clean and efficient, a dedicated `_Measures` table was created. This acts as a centralized folder for all mathematical calculations.

Here are the 15 core measures created to drive the analytics, categorized by their business function:

| Category | Measure Name | Non-Technical Description | Technical / DAX Purpose |
| :--- | :--- | :--- | :--- |
| **Core** | **Total Spend** | The absolute total amount of money spent. | `SUM` of the subtotal column in the purchase items table. |
| **Core** | **Monthly Spend** | Money spent specifically in the current calendar month. | Evaluates `Total Spend` filtered by the current month context using `DATESMTD`. |
| **Core** | **YTD Spend** | Year-to-Date spending (from Jan 1st to today). | Calculates cumulative spend using `DATESYTD`. |
| **Core** | **Number of Purchases** | Total number of store visits or checkout transactions. | `DISTINCTCOUNT` of purchase IDs. |
| **Core** | **Total Items Bought** | The physical volume of items brought home. | `SUM` of the quantity column. |
| **Core** | **Avg Unit Price** | The average cost of a single item. | Calculates the statistical average of the unit_price column directly using `AVERAGE`. |
| **Rankings** | **Top Category** | The product category where the most money goes. | Uses `SUMMARIZE` to build a category-spend table, then `TOPN` and `MAXX` to return the text name of the #1 category. |
| **Rankings** | **Top Shop** | The merchant receiving the highest spend. | Returns the name of the most frequented/highest-grossing shop. |
| **Rankings** | **Top Product** | The specific item with the highest historical spend. | Returns the name of the #1 product. |
| **Trends** | **Prev Month Spend** | What was spent in the exact previous month. | Time-intelligence shifting dates back by -1 month using `DATEADD`. |
| **Trends** | **MoM Change %** | The percentage of increase or decrease compared to last month. | Month-over-Month variance ratio using `DIVIDE`. |
| **Trends** | **Rolling 3M Avg** | A smoothed average of spending over the last 90 days. | `DATESINPERIOD` used to average out extreme spending spikes. |
| **Users** | **User Share %** | The percentage of total household spending belonging to one person. | Divides individual spend by total overall spend using `DIVIDE` and `ALL`. |
| **Health** | **Health Spend YTD** | Money invested specifically in well-being and medical categories. | Filters `Total Spend` strictly to health and wellness categories using `CALCULATE`. |
| **Health** | **Psychologist Sessions** | A specific count of therapy or clinical appointments attended. | Counts occurrences filtered by specific health product names. |

---

## 📊 Phase 3: Dashboard Navigation & Reporting

A global **Navigation Menu** was implemented at the top of the dashboard, providing an app-like experience to seamlessly jump between the 6 reporting modules.

### 1. 📊 Overview
* **What it does:** The "Executive Summary." It provides an immediate pulse check on current finances using high-level KPI cards, a donut chart for category breakdowns, and a top 5 shop ranking.
* **Value:** Allows the user to know exactly where their budget stands within 5 seconds of opening the app.

### 2. 🛒 Categories & Products
* **What it does:** A deep dive into the shopping cart. It features a Treemap for visual weight of categories, a top 10 most expensive products list, and a detailed line-item matrix.
* **Value:** Helps identify "budget drainers" by showing exactly which specific items are costing the most over time.

### 3. 🏪 Shop Comparison
* **What it does:** Analyzes merchant behavior. It includes a scatter plot mapping price vs. volume, and a matrix showing what categories are bought at which stores.
* **Value:** Crucial for detecting inflation. By filtering a specific item (like olive oil or bananas), the user can track how its price has fluctuated across different supermarkets over time.

### 4. 👤 User Analytics
* **What it does:** Breaks down spending behavior by individual profiles.
* **Value:** Isolates personal expenses from other financial flows. This is highly effective for separating personal budgets from household contributions from family members, or for identifying bulk orders placed on behalf of third parties.

### 5. 📈 Time Intelligence
* **What it does:** The forecasting and trend engine. It compares current spend against the previous month and plots real spending against a 3-month rolling average.
* **Value:** Prevents panic during naturally expensive months by smoothing out the data, revealing the true underlying financial trajectory.

### 6. 🏥 Health Tracker
* **What it does:** A specialized dashboard dedicated entirely to physical and mental wellness investments.
* **Value:** It isolates specific health expenditures — ranging from clinical appointments and physical therapy sessions to sports nutrition, supplements, and specialized self-care products. It includes an appointment log and a clear view of annual well-being investments without mixing them with daily grocery expenses.