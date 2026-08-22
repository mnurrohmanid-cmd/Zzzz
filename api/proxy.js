// Vercel serverless proxy
// Deploy this file as: /api/proxy.js

export default async function handler(req, res) {
  try {
    const target = new URL(req.url, `https://${req.headers.host}`);
    const upstreamBase = process.env.UPSTREAM_API_URL || 'https://dash-opr-mobile-dot-opr-mobile-reporting-sat-prd.et.r.appspot.com/iktDashboard';

    if (!upstreamBase) {
      return res.status(500).json({ error: "UPSTREAM_API_URL belum dikonfigurasi." });
    }

    // Forward the query string from /api/proxy?... to the upstream API.
    const upstreamUrl = new URL(upstreamBase);
    target.searchParams.forEach((value, key) => {
      upstreamUrl.searchParams.set(key, value);
    });

    const response = await fetch(upstreamUrl.toString(), {
      method: req.method,
      headers: {
        "Accept": req.headers.accept || "application/json",
        "Content-Type": req.headers["content-type"] || "application/json"
      },
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body
    });

    const contentType = response.headers.get("content-type") || "application/json";
    const body = await response.text();

    res.status(response.status);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.send(body);
  } catch (error) {
    return res.status(500).json({
      error: "Proxy error",
      message: error?.message || String(error)
    });
  }
}
