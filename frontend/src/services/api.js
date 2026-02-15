/**
 * API service — centralised HTTP calls to the FastAPI backend.
 */

import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ── Purchases ───────────────────────────────────────────────

export const createPurchase = (data) =>
  api.post("/purchases/", data).then((res) => res.data);

export const getPurchases = (skip = 0, limit = 100) =>
  api
    .get("/purchases/", { params: { skip, limit } })
    .then((res) => res.data);

export const deletePurchase = (id) =>
  api.delete(`/purchases/${id}`);

export const updatePurchase = (id, data) =>
  api.put(`/purchases/${id}`, data).then((res) => res.data);

// ── Users ───────────────────────────────────────────────────

export const createUser = (data) =>
  api.post("/users/", data).then((res) => res.data);

export const getUsers = () =>
  api.get("/users/").then((res) => res.data);

// ── Products ────────────────────────────────────────────────

export const createProduct = (data) =>
  api.post("/products/", data).then((res) => res.data);

export const getProducts = () =>
  api.get("/products/").then((res) => res.data);

// ── Shops ───────────────────────────────────────────────────

export const createShop = (data) =>
  api.post("/shops/", data).then((res) => res.data);

export const getShops = () =>
  api.get("/shops/").then((res) => res.data);

export default api;
