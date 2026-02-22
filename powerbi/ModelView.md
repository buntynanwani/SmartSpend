# SmartSpend Data Architecture & Relational Model

## 🏗️ 1. Model Overview
The SmartSpend Power BI dashboard is built upon a highly optimized relational data model. The architecture separates descriptive attributes into **Dimension (Lookup) Tables** and quantitative transaction data into **Fact (Data) Tables**. All relationships strictly follow a One-to-Many (1:*) cardinality with single-direction cross-filtering to ensure optimal DAX performance and prevent ambiguous filter loops.

## 🗄️ 2. Table Classification

### Dimension Tables (The "Who, What, Where, When")
These tables contain unique records (Primary Keys) and describe the context of the transactions:
* `smartspend users`: Profiles of the individuals making the purchases.
* `smartspend shops`: Merchants, supermarkets, and clinics.
* `smartspend categories`: High-level groupings (e.g., Groceries, Health, Utilities).
* `smartspend brands`: Manufacturers or specific brands of the items.
* `smartspend products`: The master catalog of all distinct items purchased.
* `DateTable`: A continuous calendar table used for Time Intelligence calculations.

### Fact Tables (The "Events")
These tables contain the historical logs and measurable values (Foreign Keys and amounts):
* `smartspend purchases`: The "Receipt Header" table. Logs the transaction date, total amount, the shop visited, and the user who paid.
* `smartspend purchase_items`: The "Receipt Lines" table. Logs the exact quantity, unit price, and subtotal for every individual product within a purchase.

### Standalone Tables
* `_Measures`: A disconnected table serving purely as a centralized repository for all DAX calculations to keep the model organized.

---

## 🔗 3. Relationship Mapping & Filter Flow

Filters flow downstream from the Dimension tables (the "1" side) to the Fact tables (the "Many" or "*" side). 

### The Product Hierarchy
* **Categories to Products:** `smartspend categories [id]` (1) ➔ `smartspend products [category_id]` (*)
  * *Purpose:* Filtering a category automatically filters the product list.
* **Brands to Products:** `smartspend brands [id]` (1) ➔ `smartspend products [brand_id]` (*)
  * *Purpose:* Links specific brands to their respective products.

### The Transaction Core
* **Products to Purchase Items:** `smartspend products [id]` (1) ➔ `smartspend purchase_items [product_id]` (*)
  * *Purpose:* Connects the product catalog to the actual line items bought, enabling item-level tracking and price evolution analysis.
* **Purchases to Purchase Items:** `smartspend purchases [id]` (1) ➔ `smartspend purchase_items [purchase_id]` (*)
  * *Purpose:* Bridges the overall receipt to the individual items contained within it.

### The Purchase Context
* **Shops to Purchases:** `smartspend shops [id]` (1) ➔ `smartspend purchases [shop_id]` (*)
  * *Purpose:* Attributes an entire receipt to a specific merchant.
* **Users to Purchases:** `smartspend users [id]` (1) ➔ `smartspend purchases [user_id]` (*)
  * *Purpose:* Attributes the financial output to a specific user for personal tracking.
* **DateTable to Purchases:** `DateTable [Date]` (1) ➔ `smartspend purchases [date]` (*)
  * *Purpose:* Drives all chronological reporting (YTD, MoM, Rolling Averages).