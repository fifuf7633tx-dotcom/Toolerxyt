// Vercel Serverless Function. Uses Upstash Redis REST API.
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const KEY = "toolerxyt:site-passwords";

async function redis(command) {
  if (!REDIS_URL || !REDIS_TOKEN) throw new Error("Database is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.");
  const response = await fetch(REDIS_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command)
  });
  const result = await response.json();
  if (!response.ok || result.error) throw new Error("Database request failed.");
  return result.result;
}
function send(res, status, data) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(data);
}
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let out = 0; for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
module.exports = async (req, res) => {
  try {
    const action = req.query.action;
    if (action === "verify") {
      if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
      const password = req.body && req.body.password;
      if (typeof password !== "string" || !password || password.length > 128) return send(res, 400, { valid: false, error: "পাসওয়ার্ড লিখুন।" });
      const passwords = await redis(["SMEMBERS", KEY]);
      return send(res, 200, { valid: Array.isArray(passwords) && passwords.some(p => safeEqual(p, password)) });
    }

    if (action !== "admin") return send(res, 404, { error: "Not found" });
    if (!ADMIN_SECRET) return send(res, 500, { error: "Vercel-এ ADMIN_SECRET Environment Variable সেট করা হয়নি।" });
    if (!safeEqual(req.headers["x-admin-secret"], ADMIN_SECRET)) return send(res, 401, { error: "Admin Secret সঠিক নয়।" });

    if (req.method === "GET") {
      const passwords = await redis(["SMEMBERS", KEY]);
      return send(res, 200, { passwords: Array.isArray(passwords) ? passwords : [] });
    }
    if (req.method === "POST") {
      const password = req.body && req.body.password;
      if (typeof password !== "string" || password.trim().length < 4 || password.length > 128) return send(res, 400, { error: "পাসওয়ার্ড ৪ থেকে ১২৮ অক্ষরের হতে হবে।" });
      await redis(["SADD", KEY, password.trim()]);
      return send(res, 200, { ok: true });
    }
    if (req.method === "DELETE") {
      const password = req.body && req.body.password;
      if (typeof password !== "string" || !password) return send(res, 400, { error: "পাসওয়ার্ড দেওয়া হয়নি।" });
      await redis(["SREM", KEY, password]);
      return send(res, 200, { ok: true });
    }
    res.setHeader("Allow", "GET, POST, DELETE");
    return send(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return send(res, 500, { error: error.message || "Server error" });
  }
};
