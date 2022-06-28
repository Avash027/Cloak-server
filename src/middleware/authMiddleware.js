import jwt from "jsonwebtoken";

export default async function authMiddleware(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(400).send("User unauthorized");
    }

    const { uid } = jwt.verify(req.headers.authorization, process.env.SECRET);

    req.uid = uid;
    next();
  } catch (error) {
    res.status(400).send("Unauthorized");
  }
}
