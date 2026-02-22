# SmartSpend Database Entity-Relationship Diagram (ERD)

This document visualizes the normalized relational database schema for the SmartSpend application. The schema is designed following a Snowflake architecture, separating transactional data (Facts) from descriptive metadata (Dimensions).

## 📊 Visual ERD (Mermaid)

```mermaid
erDiagram
    %% Core Dimension Tables
    users {
        int id PK
        varchar name
        varchar email "UNIQUE"
        datetime created_at
        datetime updated_at
    }

    shops {
        int id PK
        varchar name "UNIQUE"
        datetime created_at
    }

    categories {
        int id PK
        varchar name "UNIQUE"
        timestamp created_at
    }

    brands {
        int id PK
        varchar name "UNIQUE"
        datetime created_at
    }

    %% Product Catalog (Dimension with sub-dimensions)
    products {
        int id PK
        varchar name
        enum unit_type
        varchar reference
        int brand_id FK
        int category_id FK
        datetime created_at
    }

    %% Transactional Tables (Fact Tables)
    purchases {
        int id PK
        int user_id FK
        int shop_id FK
        date date
        decimal delivery_cost
        decimal discount
        decimal total_amount
        datetime created_at
        datetime updated_at
    }

    purchase_items {
        int id PK
        int purchase_id FK
        int product_id FK
        decimal quantity
        decimal unit_price
        decimal subtotal
    }

    %% Relationships Definition
    users ||--o{ purchases : "makes"
    shops ||--o{ purchases : "hosts"
    categories ||--o{ products : "categorizes"
    brands ||--o{ products : "manufactures"
    products ||--o{ purchase_items : "appears_in"
    purchases ||--|{ purchase_items : "contains"
```
