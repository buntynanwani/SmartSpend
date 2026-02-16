# **SmartSpend – Personal Expense Intelligence Platform**

---

## **1\. Problem Statement**

Household expense tracking is typically fragmented and lacks analytical depth. Most banking applications provide total monthly expenditure but fail to offer:

* Item-level price tracking across different stores

* Vendor comparison analysis

* User-level expense separation within a household

* Category-based cost insights

* Structured analytical dashboards

* Predictive spending forecasts

### **Core Challenges**

**a) Item Price Tracking**  
 Users cannot monitor how specific product prices fluctuate across different shops over time (e.g., bananas across supermarkets).

**b) Multi-User Household Analysis**  
 In shared households, it is difficult to analyze individual spending behavior (e.g., Mum vs. Bunty).

**c) Category Transparency**  
 High-cost categories such as utilities, physiotherapy, or supplements are often underestimated without structured breakdowns.

**d) Insight Generation**  
 Users lack structured metrics such as:

* Total Monthly Spend

* Most Expensive Category

* Average Weekly Grocery Cost

* Shop-wise expenditure distribution

* Basket-level purchase analysis

---

## **2\. Proposed Solution**

SmartSpend is a full-stack expense intelligence system that:

1. Collects structured expense data via a web interface

2. Stores data in a normalized relational SQL database

3. Exposes data for advanced analysis in Power BI

4. Enables future AI-based forecasting and anomaly detection

---

## **3\. Architecture Overview**

### **Data Flow**

User → React Frontend → FastAPI Backend → MySQL Database → Power BI Dashboard

---

### **Frontend**

* React (JavaScript)

* Dynamic multi-item purchase form

* Edit & delete functionality

* Real-time total calculation

* Clean state management

---

### **Backend**

* FastAPI (Python)

* RESTful API design

* Full CRUD implementation

* Pydantic v2 schema validation

* Nested request/response models

* Structured data transformation

---

### **Database**

* MySQL

* SQLAlchemy ORM

* Fully normalized relational schema

* Foreign key relationships

* Purchase header \+ purchase item structure

---

### **Analytics Layer**

* Power BI connected directly to MySQL

* Designed for fact/dimension modeling

* KPI-driven dashboards

---

## **4\. Refined Data Model (Implementation Evolution)**

During implementation, the initial flat transaction model was refactored into a normalized relational design to support scalable analytics.

### **Core Tables**

* Users

* Shops

* Products

* Purchases (header-level data)

* PurchaseItems (line-level data)

### **Design Structure**

Each Purchase includes:

* User

* Shop

* Date

* Total amount

Each PurchaseItem includes:

* Product

* Quantity

* Unit price

* Subtotal

This structure enables:

* Multi-item basket analysis

* Item-level price evolution tracking

* Accurate total aggregation

* Clean Power BI fact modeling

* Future forecasting readiness

---

## **5\. MVP Definition**

The MVP focuses on delivering a functional data pipeline and analytics-ready backend.

### **Core Features Implemented**

✔ Create Users  
 ✔ Create Shops  
 ✔ Create Products  
 ✔ Register Purchases containing multiple items  
 ✔ Automatic subtotal calculation per item  
 ✔ Automatic total calculation per purchase  
 ✔ Edit and delete purchases  
 ✔ Persistent date tracking  
 ✔ Structured relational storage

### **Analytics (MVP Phase)**

✔ Power BI dashboard including:

* Total Monthly Spend

* User Comparison

* Category Breakdown

* Most Expensive Category

* Average Weekly Grocery Cost

* Shop-wise spend distribution

* Item price evolution

---

## **6\. Tech Stack Justification**

### **React**

Lightweight and suitable for structured data entry interfaces.

### **FastAPI**

High-performance Python framework ideal for API-based architectures and future AI integration.

### **SQLAlchemy**

Enables clean ORM modeling and scalable relational architecture.

### **MySQL**

Relational database required for structured analytical queries and BI integration.

### **Pydantic v2**

Ensures strict data validation and structured API contracts.

### **Power BI**

Industry-standard BI tool aligned with data analytics and data engineering workflows.

### **Python**

Facilitates transition toward machine learning, forecasting, and anomaly detection.

---

## **7\. Data Source & Processing**

### **Source**

* Real household receipts

* Manual structured data entry

### **Data Processing**

* Backend validation

* Consistent date formatting

* Structured foreign key relationships

* Automatic calculation logic

Future enhancements may include:

* Time-series forecasting (Prophet, Scikit-learn)

* Anomaly detection models

* OCR-based receipt ingestion

---

## **8\. Development Phases**

### **Phase 1 – Data Foundation (Completed)**

* Database schema design

* ER modeling

* FastAPI backend

* SQLAlchemy integration

* Full CRUD implementation

* Schema validation and refinement

### **Phase 2 – Frontend Integration (Completed)**

* React form design

* Multi-item purchase support

* Edit/Delete functionality

* API synchronization

### **Phase 3 – Business Intelligence (Next)**

* Power BI connection

* KPI dashboard design

* Analytical insights

### **Phase 4 – Predictive Layer (Future Scope)**

* Time-series forecasting

* Category-level predictive modeling

* Anomaly detection

* Deployment & authentication

---

## **9\. Technical Risks & Mitigation**

**Risk:** Data quality from manual input  
 **Mitigation:** Backend validation and schema enforcement

**Risk:** Overcomplicating AI phase  
 **Mitigation:** Prioritize descriptive analytics before predictive modeling

**Risk:** Power BI connection issues  
 **Mitigation:** Use structured relational schema for compatibility

---

## **10\. Strategic Value**

SmartSpend is not just an expense tracker.

It is:

* A structured relational data system

* A mini data engineering pipeline

* An analytics-ready architecture

* A foundation for predictive modeling

It demonstrates:

* Full-stack development capability

* Relational database modeling

* API contract design

* Data validation architecture

* Business intelligence integration

