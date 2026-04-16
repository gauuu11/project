"use client";
import { useEffect, useState } from "react";

type Sale = {
  id: number;
  product_id: number;
  customer_name: string;
  quantity: number;
  sale_price: number;
  total_price: number;
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [message, setMessage] = useState<string>("");

  const [form, setForm] = useState({
    product_id: "",
    customer_name: "",
    quantity: "",
    sale_price: "",
  });

  const fetchSales = async () => {
    const res = await fetch("http://127.0.0.1:8000/sales/");
    const data = await res.json();
    setSales(data.data);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:8000/sales/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: Number(form.product_id),
        customer_name: form.customer_name,
        quantity: Number(form.quantity),
        sale_price: Number(form.sale_price),
      }),
    });

    setMessage("💰 Sale Added Successfully!");
    setTimeout(() => setMessage(""), 2000);

    setForm({
      product_id: "",
      customer_name: "",
      quantity: "",
      sale_price: "",
    });

    fetchSales();
  };

  const deleteSale = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/sales/${id}`, {
      method: "DELETE",
    });

    setMessage("🗑️ Sale Deleted!");
    setTimeout(() => setMessage(""), 2000);

    fetchSales();
  };

  const updateSale = async (item: Sale) => {
    const quantity = prompt("Enter new quantity:", String(item.quantity));
    const price = prompt("Enter new price:", String(item.sale_price));

    if (!quantity || !price) return;

    await fetch(`http://127.0.0.1:8000/sales/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: item.product_id,
        customer_name: item.customer_name,
        quantity: Number(quantity),
        sale_price: Number(price),
      }),
    });

    setMessage("✏️ Sale Updated!");
    setTimeout(() => setMessage(""), 2000);

    fetchSales();
  };

  return (
    <div style={container}>
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>📊 Sales Management</h1>
        <p style={subtitle}>Track and manage your sales efficiently</p>
      </div>

      {/* TOAST */}
      {message && <div style={toast}>{message}</div>}

      {/* FORM */}
      <div style={card}>
        <h2 style={cardTitle}>Add Sale</h2>

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
            name="customer_name"
            placeholder="Customer Name"
            value={form.customer_name}
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
            name="sale_price"
            placeholder="Price"
            value={form.sale_price}
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
        <h2 style={cardTitle}>Sales List</h2>

        <table style={table}>
          <thead>
            <tr style={theadRow}>
              <th style={thtd}>ID</th>
              <th style={thtd}>Product</th>
              <th style={thtd}>Customer</th>
              <th style={thtd}>Qty</th>
              <th style={thtd}>Price</th>
              <th style={thtd}>Total</th>
              <th style={thtd}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  background: index % 2 === 0 ? "#f0f9ff" : "#ffffff",
                }}
              >
                <td style={thtd}>{item.id}</td>
                <td style={thtd}>{item.product_id}</td>
                <td style={thtd}>{item.customer_name}</td>
                <td style={thtd}>{item.quantity}</td>
                <td style={thtd}>{item.sale_price}</td>
                <td style={thtd}>{item.total_price}</td>
                <td style={thtd}>
                  <button style={editButton} onClick={() => updateSale(item)}>
                    Edit
                  </button>
                  <button
                    style={deleteButton}
                    onClick={() => deleteSale(item.id)}
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
  background: "linear-gradient(to right, #e0f2fe, #f0f9ff)",
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
  background: "#0ea5e9",
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
  background: "linear-gradient(45deg, #0ea5e9, #0284c7)",
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
  background: "#bae6fd",
};

const thtd = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

const editButton = {
  marginRight: "5px",
  padding: "6px 12px",
  background: "#2563eb",
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