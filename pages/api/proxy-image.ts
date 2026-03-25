import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  const response = await fetch(url);
  if (!response.ok) {
    return res.status(response.status).json({ error: "Failed to fetch image" });
  }

  const contentType = response.headers.get("content-type") ?? "image/png";
  const buffer = Buffer.from(await response.arrayBuffer());
  const base64 = buffer.toString("base64");

  res.status(200).json({ base64: `data:${contentType};base64,${base64}` });
}
