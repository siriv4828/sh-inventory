
const API_URL = "https://eurtpr6xd1.execute-api.ap-south-1.amazonaws.com";
// const API_URL = "http://127.0.0.1:8000";

export async function addProduct({ name, quantity, price }) {
    console.log(name, quantity, price);
//     const res = await fetch(
//   `${API_URL}/api/products?name=${encodeURIComponent(name)}&quantity=${quantity}&price=${price}`,
//   {
//     method: "POST",
//   }
// );

  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantity, price }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function updateProduct(id, updates) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function getSummary() {
  const res = await fetch(`${API_URL}/api/products/summary`);
  if (!res.ok) throw new Error(await res.text() || `Request failed: ${res.status}`);
  return res.json(); // { total_count, total_value }
}