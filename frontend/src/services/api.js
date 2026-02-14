/**
 * API service — centralised HTTP calls to the FastAPI backend.
 */

import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ── Transactions ────────────────────────────────────────────

export const createTransaction = (data) =>
  api.post("/transactions/", data).then((res) => res.data);

export const getTransactions = (skip = 0, limit = 100) =>
  api
    .get("/transactions/", { params: { skip, limit } })
    .then((res) => res.data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`);

// ── Users ───────────────────────────────────────────────────

export const createUser = (data) =>
  api.post("/transactions/users", data).then((res) => res.data);

export const getUsers = () =>
  api.get("/transactions/users").then((res) => res.data);

// ── Products ────────────────────────────────────────────────

export const createProduct = (data) =>
  api.post("/transactions/products", data).then((res) => res.data);

export const getProducts = () =>
  api.get("/transactions/products").then((res) => res.data);

export default api;
