import got from "got";

export async function isAdmin(req, res, next) {
  const nextAuthClient = got.extend({
    prefixUrl: process.env.NEXTAUTH_URL,
    headers: {
      cookie: req.headers.cookie,
    },
    throwHttpErrors: false,
    responseType: "json",
  });

  const response = await nextAuthClient.get("session");
  const session: any = response.body;

  if (session.user) {
    req.isAdmin = true;
  }

  next();
}
