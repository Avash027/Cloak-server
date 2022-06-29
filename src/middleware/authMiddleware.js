import jwt from "jsonwebtoken";

export default async function authMiddleware(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(400).send("User unauthorized");
    }

    const { uid, admin } = jwt.verify(
      req.headers.authorization,
      process.env.SECRET
    );

    console.log(admin);

    req.uid = uid;
    req.admin = admin;
    next();
  } catch (error) {
    res.status(400).send("Unauthorized");
  }
}
