# 🍽️ QR Menu --- Code Snippets Reference (Backend + Frontend)

This document contains **clean, production-ready code snippets** for the
**Menu Module**:

-   Backend (Node.js + Express + Prisma/Sequelize)
-   API Routes
-   Upload Middleware
-   Menu Controller
-   Frontend API (Axios)
-   State Store (Zustand)
-   Menu Page UI
-   Cart Logic
-   Admin Dashboard (List + Form)

You can paste this directly into Cursor as your coding reference.

------------------------------------------------------------------------

# 🟦 1. Backend --- Express App Setup

``` js
import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menu.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/menu", menuRoutes);

app.listen(5000, () => console.log("API running on port 5000"));
```

------------------------------------------------------------------------

# 🟦 2. Backend --- Menu Model (Sequelize Example)

``` js
import { DataTypes } from "sequelize";
import db from "../db.js";

const MenuItem = db.define("MenuItem", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL,
  category: DataTypes.STRING,
  image_url: DataTypes.STRING,
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default MenuItem;
```

------------------------------------------------------------------------

# 🟦 3. Backend --- Upload Middleware

``` js
import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const upload = multer({ storage });
```

------------------------------------------------------------------------

# 🟦 4. Backend --- Menu Routes

``` js
import express from "express";
import { upload } from "../middleware/upload.js";
import {
  getAllMenu,
  getOneMenu,
  createMenu,
  updateMenu,
  deleteMenu
} from "../controllers/menu.controller.js";

const router = express.Router();

router.get("/", getAllMenu);
router.get("/:id", getOneMenu);
router.post("/", upload.single("image"), createMenu);
router.put("/:id", upload.single("image"), updateMenu);
router.delete("/:id", deleteMenu);

export default router;
```

------------------------------------------------------------------------

# 🟦 5. Backend --- Menu Controller

``` js
import MenuItem from "../models/menu.model.js";

export const getAllMenu = async (req, res) => {
  const items = await MenuItem.findAll();
  res.json(items);
};

export const getOneMenu = async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  res.json(item);
};

export const createMenu = async (req, res) => {
  const item = await MenuItem.create({
    ...req.body,
    image_url: req.file ? `/uploads/${req.file.filename}` : null
  });
  res.json(item);
};

export const updateMenu = async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);

  await item.update({
    ...req.body,
    image_url: req.file ? `/uploads/${req.file.filename}` : item.image_url
  });

  res.json(item);
};

export const deleteMenu = async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  await item.destroy();
  res.json({ message: "Item deleted" });
};
```

------------------------------------------------------------------------

# 🟦 6. Frontend --- Axios API Wrapper

``` ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://yourdomain.com/api/menu"
});

export const getMenu = () => api.get("/");
export const getOneMenu = (id: number) => api.get(`/${id}`);

export const createMenu = (formData: FormData) =>
  api.post("/", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateMenu = (id: number, formData: FormData) =>
  api.put(`/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteMenu = (id: number) => api.delete(`/${id}`);
```

------------------------------------------------------------------------

# 🟦 7. Frontend --- Zustand Cart Store

``` ts
import { create } from "zustand";

export const useCart = create((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((x) => x.id === item.id);
      if (exists) {
        return {
          items: state.items.map((x) =>
            x.id === item.id ? { ...x, qty: x.qty + 1 } : x
          )
        };
      }
      return { items: [...state.items, { ...item, qty: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id)
    })),

  clear: () => set({ items: [] })
}));
```

------------------------------------------------------------------------

# 🟦 8. Frontend --- Menu Page

``` tsx
import { useEffect, useState } from "react";
import { getMenu } from "../api/menu.api";
import { useCart } from "../store/cart.store";

export default function Menu() {
  const [items, setItems] = useState([]);
  const addToCart = useCart((s) => s.addItem);

  useEffect(() => {
    getMenu().then((res) => setItems(res.data));
  }, []);

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow p-3">
          <img src={item.image_url} className="rounded-lg mb-2" />
          <h3 className="font-bold">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.description}</p>
          <p className="font-semibold mt-2">KES {item.price}</p>

          <button
            onClick={() => addToCart(item)}
            className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-lg"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
```

------------------------------------------------------------------------

# 🟦 9. Frontend --- WhatsApp Checkout Link

``` ts
export const buildWhatsAppCheckout = (cart, phone) => {
  const message =
    `Order:\n\n` +
    cart.items.map((i) => `${i.qty} × ${i.name} - ${i.qty * i.price}`).join("\n") +
    `\n\nTotal: ${cart.items.reduce((a, b) => a + b.qty * b.price, 0)}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
```

------------------------------------------------------------------------

# 🟦 10. Admin Dashboard --- List Page

``` tsx
import { getMenu, deleteMenu } from "../api/menu.api";
import { useEffect, useState } from "react";

export default function AdminMenuList() {
  const [items, setItems] = useState([]);

  const load = () => getMenu().then((res) => setItems(res.data));

  useEffect(() => load(), []);

  return (
    <div className="p-6">
      <a href="/admin/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Add Item
      </a>

      <table className="w-full mt-4 border">
        <thead>
          <tr className="border">
            <th>Name</th><th>Category</th><th>Price</th><th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((i) => (
            <tr key={i.id} className="border">
              <td>{i.name}</td>
              <td>{i.category}</td>
              <td>{i.price}</td>
              <td>
                <a href={`/admin/edit/${i.id}`} className="text-blue-600">Edit</a>
                {" | "}
                <button
                  className="text-red-600"
                  onClick={() => deleteMenu(i.id).then(load)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

------------------------------------------------------------------------

# 🟦 11. Admin Dashboard --- Create/Edit Form

``` tsx
import { createMenu, updateMenu, getOneMenu } from "../api/menu.api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function AdminMenuForm() {
  const { id } = useParams();
  const editing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null
  });

  useEffect(() => {
    if (editing) {
      getOneMenu(id).then((res) =>
        setForm({ ...res.data, image: null })
      );
    }
  }, [id]);

  const submit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => v && data.append(k, v));

    const req = editing ? updateMenu(id, data) : createMenu(data);
    req.then(() => (window.location.href = "/admin"));
  };

  return (
    <form className="p-6 space-y-3" onSubmit={submit}>
      <input className="input" placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <textarea className="input" placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input className="input" placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <input className="input" placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input type="file"
        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
        {editing ? "Update Item" : "Create Item"}
      </button>
    </form>
  );
}
```

------------------------------------------------------------------------

# ✅ End of Code Snippet Reference

This file is prepared for Cursor or any IDE as a coding guide.
