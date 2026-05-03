/* ============================================================
   DHARMAN HANDBAGS — supabase.js
   Shared Supabase client — included in every page
   ============================================================ */

const SUPABASE_URL = 'https://nfldefinzuejykxzjkdu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wFbL4YWY3rV4ScjAWeETKg_THvv8iE9';

// Load Supabase client from CDN (already included via script tag)
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ────────────────────────────────────────────────────────────
   PRODUCTS
   ──────────────────────────────────────────────────────────── */
async function getProducts() {
  const { data, error } = await db.from('products').select('*').order('id');
  if (error) { console.warn('Supabase products error:', error); return null; }
  return data;
}

async function saveProduct(product) {
  if (product.id) {
    const { error } = await db.from('products').update(product).eq('id', product.id);
    return !error;
  } else {
    const { error } = await db.from('products').insert(product);
    return !error;
  }
}

async function deleteProduct(id) {
  const { error } = await db.from('products').delete().eq('id', id);
  return !error;
}

/* ────────────────────────────────────────────────────────────
   SITE CONTENT
   ──────────────────────────────────────────────────────────── */
async function getContent() {
  const { data, error } = await db.from('site_content').select('*');
  if (error) { console.warn('Supabase content error:', error); return null; }
  // Convert array of {key, value} to plain object
  const obj = {};
  (data || []).forEach(row => {
    try { obj[row.key] = JSON.parse(row.value); }
    catch(e) { obj[row.key] = row.value; }
  });
  return obj;
}

async function saveContent(key, value) {
  const val = typeof value === 'string' ? value : JSON.stringify(value);
  const { error } = await db.from('site_content').upsert({ key, value: val }, { onConflict: 'key' });
  return !error;
}

/* ────────────────────────────────────────────────────────────
   ORDERS
   ──────────────────────────────────────────────────────────── */
async function getOrders() {
  const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false });
  if (error) { console.warn('Supabase orders error:', error); return []; }
  return data || [];
}

async function saveOrder(order) {
  const { error } = await db.from('orders').upsert(order, { onConflict: 'id' });
  return !error;
}

async function updateOrderStatus(id, status) {
  const { error } = await db.from('orders').update({ status }).eq('id', id);
  return !error;
}
