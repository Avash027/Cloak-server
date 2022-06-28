import AuthRepo from "../database/repo/auth.repo.js";
import crypto from "crypto";
import randomstring from "randomstring";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const domain = email.substring(email.lastIndexOf("@") + 1);

    const rows = await AuthRepo.getCollegeName(domain);

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid Email" });

    const userHash = crypto
      .createHash("sha256")
      .update(email + process.env.SECRET, "utf-8")
      .digest("base64")
      .substring(0, 5);

    const userExist = (await AuthRepo.findUserHash(userHash)).length > 0;

    if (userExist)
      return res.status(401).json({ message: "User already exist" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      uid: userHash,
      password: passwordHash,
      verificationToken: randomstring.generate(5),
      collegeName: rows[0].college_name,
      profilePic: `https://avatars.dicebear.com/api/bott/${randomstring.generate(
        5
      )}.svg`,
    };

    await AuthRepo.registerUser(user);

    sgMail.setApiKey(process.env.SENDGRID_MAIL_KEY);

    const msg = {
      to: email,
      from: "avashmitra007@gmail.com",
      subject: "Visit the link to activate your account",
      text: "Visit the link to activate your account",
      html: `<a href = "https://cloak-gilt.vercel.app/verify/${user.verificationToken}">Click here</a>`,
    };

    await sgMail.send(msg);

    res.status(200).json({ message: "Profile created Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userHash = crypto
      .createHash("sha256")
      .update(email + process.env.SECRET, "utf-8")
      .digest("base64")
      .substring(0, 5);

    const user = (await AuthRepo.findUserHash(userHash))[0];

    if (!user)
      return res.status(301).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(301).json({ message: "Invalid email or password" });

    if (user.banned) return res.status(401).send({ message: "User is banned" });

    if (!user.verified)
      return res.status(401).send({ message: "User not verified" });

    const payLoad = {
      uid: user.uid,
    };

    jwt.sign(payLoad, process.env.SECRET, { expiresIn: "2d" }, (err, token) => {
      if (err) throw err;
      res.status(200).json(token);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const verify = async (req, res) => {
  try {
    const { token } = req.params;
    const result = await AuthRepo.verifyUser(token);

    if (result.rowCount === 0)
      return res
        .status(400)
        .json({ message: "Invalid Token or User does not exist" });

    return res.status(201).json({ message: "User successfully verified" });
  } catch (error) {
    console.error(error);
    res.status(501).json({ error: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { uid } = req;
    const user = await AuthRepo.getUser(uid);

    console.log(user);

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
