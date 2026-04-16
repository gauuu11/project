"use client";
import { useEffect, useState } from "react";

type Purchase = {
  id: number;
  product_id: number;
  supplier_name: string;
  quantity: number;
  purchase_price: number;
  total_price: number;
};

export default function PurchasePage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [message, setMessage] = useState<string>("");

  const [form, setForm] = useState({
    product_id: "",
    supplier_name: "",
    quantity: "",
    purchase_price: "",
  });

  const fetchPurchases = async () => {
    const res = await fetch("http://127.0.0.1:8000/purchase/");
    const data = await res.json();
    setPurchases(data.data);
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:8000/purchase/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: Number(form.product_id),
        supplier_name: form.supplier_name,
        quantity: Number(form.quantity),
        purchase_price: Number(form.purchase_price),
      }),
    });

    setMessage("✅ Purchase Added Successfully!");
    setTimeout(() => setMessage(""), 2000);

    setForm({
      product_id: "",
      supplier_name: "",
      quantity: "",
      purchase_price: "",
    });

    fetchPurchases();
  };

  const deletePurchase = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/purchase/${id}`, {
      method: "DELETE",
    });

    setMessage("🗑️ Purchase Deleted!");
    setTimeout(() => setMessage(""), 2000);

    fetchPurchases();
  };

  const updatePurchase = async (item: Purchase) => {
    const quantity = prompt("Enter new quantity:", String(item.quantity));
    const price = prompt("Enter new price:", String(item.purchase_price));

    if (!quantity || !price) return;

    await fetch(`http://127.0.0.1:8000/purchase/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: item.product_id,
        supplier_name: item.supplier_name,
        quantity: Number(quantity),
        purchase_price: Number(price),
      }),
    });

    setMessage("✏️ Purchase Updated!");
    setTimeout(() => setMessage(""), 2000);

    fetchPurchases();
  };

  return (
    <div style={container}>
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>📦 Purchase Management</h1>
        <p style={subtitle}>Manage your purchases efficiently</p>
      </div>

      {/* MESSAGE */}
      {message && <div style={toast}>{message}</div>}

      {/* FORM */}
      <div style={card}>
        <h2 style={cardTitle}>Add Purchase</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            name="product_id"
            placeholder="Product ID"
            value={form.product_id}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="supplier_name"
            placeholder="Supplier Name"
            value={form.supplier_name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="purchase_price"
            placeholder="Price"
            value={form.purchase_price}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button type="submit" style={addButton}>
            + Add
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div style={card}>
        <h2 style={cardTitle}>Purchase List</h2>

        <table style={table}>
          <thead>
            <tr style={theadRow}>
              <th style={thtd}>ID</th>
              <th style={thtd}>Product</th>
              <th style={thtd}>Supplier</th>
              <th style={thtd}>Qty</th>
              <th style={thtd}>Price</th>
              <th style={thtd}>Total</th>
              <th style={thtd}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {purchases.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  background: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                }}
              >
                <td style={thtd}>{item.id}</td>
                <td style={thtd}>{item.product_id}</td>
                <td style={thtd}>{item.supplier_name}</td>
                <td style={thtd}>{item.quantity}</td>
                <td style={thtd}>{item.purchase_price}</td>
                <td style={thtd}>{item.total_price}</td>
                <td style={thtd}>
                  <button
                    style={editButton}
                    onClick={() => updatePurchase(item)}
                  >
                    Edit
                  </button>
                  <button
                    style={deleteButton}
                    onClick={() => deletePurchase(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* STYLES */

const container = {
  minHeight: "100vh",
  padding: "40px 20px",
  background: "linear-gradient(to right, #e0e7ff, #f8fafc)",
  fontFamily: "Segoe UI, sans-serif",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "20px",
};

const title = {
  fontSize: "32px",
  fontWeight: "bold",
};

const subtitle = {
  color: "#555",
};

const toast = {
  textAlign: "center" as const,
  background: "#22c55e",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  width: "300px",
  margin: "10px auto",
};

const card = {
  maxWidth: "1000px",
  margin: "20px auto",
  padding: "25px",
  borderRadius: "15px",
  background: "white",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
};

const cardTitle = {
  textAlign: "center" as const,
  marginBottom: "20px",
};

const formStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "15px",
  justifyContent: "center",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  minWidth: "160px",
};

const addButton = {
  padding: "10px 20px",
  background: "linear-gradient(45deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  textAlign: "center" as const,
};

const theadRow = {
  background: "#c7d2fe",
};

const thtd = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

const editButton = {
  marginRight: "5px",
  padding: "6px 12px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteButton = {
  padding: "6px 12px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
