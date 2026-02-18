/**
 * API service — centralised HTTP calls to the FastAPI backend.
 */

import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ── Users ─────────────────────────────────────

export const createUser = (data) =>
  api.post("/users/", data).then((res) => res.data);

export const getUsers = () =>
  api.get("/users/").then((res) => res.data);

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data).then((res) => res.data);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`).then((res) => res.data);

// ── Products ──────────────────────────────────

export const createProduct = (data) =>
  api.post("/products/", data).then((res) => res.data);

export const getProducts = () =>
  api.get("/products/").then((res) => res.data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data).then((res) => res.data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((res) => res.data);

// ── Categories ────────────────────────────────

export const createCategory = (data) =>
  api.post("/categories/", data).then((res) => res.data);

export const getCategories = () =>
  api.get("/categories/").then((res) => res.data);

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data).then((res) => res.data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`).then((res) => res.data);

// ── Shops ─────────────────────────────────────

export const createShop = (data) =>
  api.post("/shops/", data).then((res) => res.data);

export const getShops = () =>
  api.get("/shops/").then((res) => res.data);

export const updateShop = (id, data) =>
  api.put(`/shops/${id}`, data).then((res) => res.data);

export const deleteShop = (id) =>
  api.delete(`/shops/${id}`).then((res) => res.data);

// ── Purchases ─────────────────────────────────

export const createPurchase = (data) =>
  api.post("/purchases/", data).then((res) => res.data);

export const getPurchases = () =>
  api.get("/purchases/").then((res) => res.data);

export const deletePurchase = (id) =>
  api.delete(`/purchases/${id}`).then((res) => res.data);

export const updatePurchase = (id, data) =>
  api.put(`/purchases/${id}`, data).then((res) => res.data);

export default api;
