export default function adminGuard(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
