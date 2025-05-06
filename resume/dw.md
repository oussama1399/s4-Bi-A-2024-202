
# 📚 Summary - Data Warehousing

## 🧩 1. Introduction to Data Warehousing

### 🔹 Why Do We Need a Data Warehouse?

- **Reactivity to change is Time-related (takes organizational history into account)**
- Beyond reactivity, organizations need to be **proactive**
- Weed out important data from the rest
- **Need: Single version of the truth**

---

## 🧩 2. How Do We Get There?

- **Get the data**
- **Transform the data**
- **Persist the transformed data**
- **Visualize the data**

---

## 🧩 3. What Is a Data Warehouse?

> “A data warehouse is a subject-oriented, integrated, time-variant, and nonvolatile collection of data in support of management’s decision-making process.”  
> – W.H. Inmon

---

## 🧩 4. Data Warehouse Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Subject-Oriented** | Organized around major subjects like customer, product, sales |
| **Integrated** | Consolidates data across multiple domains within the organization |
| **Time-Variant** | Focuses on identifying trends, hidden patterns, and relationships |
| **Nonvolatile** | Data is loaded and accessed but not updated in the general sense |

---

## 🧩 5. Key Features of a Data Warehouse

- **Structured for simplicity of access and high-speed query performance**
- **End users desire speed-of-thought response times**
- **Large amounts of historical data used (100 GB–few Terabytes)**
- **Queries often retrieve large volumes of data**
- **Both predefined and ad hoc queries are common**
- **Data load involves multiple sources and transformations**

---

## 🧩 6. Data Mart

- A **subset of data** stored within the overall data warehouse
- Goal is to **isolate or partition smaller sets of data** for easier access by end consumers
- Differs from a data warehouse in the **scope of data stored**—covers one subject area
- Can be created from an existing data warehouse (**top-down approach**) or other sources

---

## 🧩 7. Types of Data Marts

| Type | Description |
|------|-------------|
| **Dependent** | Created from an enterprise data warehouse; can be logical view or physical subset |
| **Independent** | Standalone system with data extracted from internal/external sources |
| **Hybrid** | Combines data from a data warehouse and other operational systems |

---

## 🧩 8. OLAP (Online Analytical Processing)

- **OLAP** enables analysts, managers, and executives to gain insight through fast, consistent, interactive access to multidimensional views of data.
- Facilitates **interactive query and complex analysis**.
- Allows **drill down** for greater detail or **roll up** for aggregation along dimensions.

---

## 🧩 9. OLAP Models

| Model | Description |
|-------|-------------|
| **MOLAP** | Multidimensional OLAP — stores data in hypercubes in a multidimensional database |
| **ROLAP** | Relational OLAP — uses relational databases with semantic metadata layer |
| **HOLAP** | Hybrid model combining strengths of MOLAP and ROLAP |
| **DOLAP** | Desktop OLAP — portable datasets for local machines |
| **Web OLAP** | Accessible via web browsers |

---

## 🧩 10. Benefits of OLAP

- **Self-service BI for ad-hoc analyses**
- **Faster delivery of applications**
- **More efficient operations** through reduced query execution time and network traffic
- **Increased productivity** of business managers, executives, and analysts

---

## 🧩 11. Architectural Design

- The **data warehouse environment** consists of two parts:
  - **Data-integration area** (Kitchen)
  - **Presentation area** (Dining room)

### 🔹 Data Integration Area (Kitchen)

- Transforms raw source data into a target model efficiently
- Ensures **quality, integrity, and consistency**
- Off-limits to end-users and application developers

### 🔹 Presentation Area (Dining Room)

- Data must be **safe, well-prepared, and user-friendly**
- Designed for **comfort and usability (UX)**
- Delivered promptly in an appealing form at a manageable cost

---

## 🧩 12. ETL (Extract, Transform, Load)

### 🔹 Extraction

- **Full extraction**: Complete data from the source
- **Incremental extraction**: Only changed data since last load
- Change tracking is essential for near real-time warehousing
- Timestamps help track changes in staging tables

### 🔹 Transformation

- Most complex part of ETL
- Includes **simple conversions to complex scrubbing**
- Pipelined processing to improve data quality and enforce conformed metrics

### 🔹 Load

- Inserting transformed data into the data warehouse or datamart
- Ensuring **consistency and accuracy**

---

## 🧩 13. Dimensional Modeling

- Used for **BI reporting, querying, and analysis**
- Key components:
  - **Facts**
  - **Dimensions**
  - **Attributes**

### 🔹 Fact Table

- Contains **keys and measures**
- Relationships with dimensions are **one-to-many**
- Best practice: **Foreign keys should never be null**

#### 🔹 Types of Facts

| Type              | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| **Additive**      | Can be added across all dimensions (e.g., quantity sold)   |
| **Semi-additive** | Added across some dimensions only (e.g., inventory levels) |
| **Non-additive**  | Cannot be meaningfully aggregated (e.g., ratios)           |

#### 🔹 Types of Fact Tables

| Type | Description |
|------|-------------|
| **Transaction** | Smallest granularity, captures individual events |
| **Periodic** | Snapshots at regular intervals |
| **Accumulating** | Tracks entire lifetime of an event |
| **Factless** | No numeric measures, tracks events that didn’t happen |

---

## 🧩 14. Dimensions

- Provide **context for facts**
- Define **who, what, where, and why** of the dimensional model
- Often hierarchical and contain **multiple hierarchies**

### 🔹 Slowly Changing Dimensions (SCD)

| Type | Description |
|------|-------------|
| **Type 0** | Retain original value |
| **Type 1** | Overwrite old value |
| **Type 2** | Add new row for each change |
| **Type 3** | Track limited changes using separate columns |

---

## 🧩 15. Schemas

### 🔹 Star Schema

- Most common schema for dimensional models
- One fact table surrounded by dimension tables
- Easy to understand and optimize for queries

### 🔹 Snowflake Schema

- Normalizes hierarchies within dimensions
- Reduces redundancy but increases complexity and join overhead

---

## 🧩 16. Kimball's Approach to Dimensional Modeling

According to Ralph Kimball:

1. **Select the business process**
2. **Declare the grain**
3. **Identify the dimensions**
4. **Identify the facts**

Also consider:
- **Duration of the database**
- **How far back in time** to go for historical data

---

## 🧩 17. Example Use Case: Retail Sales

- **Business Process**: POS retail sales transactions
- **Grain**: Individual product on a POS transaction
- **Dimensions**: Date, Product, Store, Promotion, Cashier, Method of Payment
- **Facts**: Sales quantity, per unit price, discount, net paid price, extended discount, sales dollar amount

---

## ✅ Conclusion

This document provides a comprehensive overview of **data warehousing concepts, design, and architecture**, covering key elements such as:
- **Data warehouses vs. data marts**
- **ETL processes**
- **Dimensional modeling**
- **OLAP technologies**
- **Schema designs (Star & Snowflake)**

Understanding these concepts is essential for designing and implementing effective **business intelligence solutions** and **data-driven decision-making systems**.

---
