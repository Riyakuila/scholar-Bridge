import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "scholarbridge_secret_key_2024";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
};

export default generateToken;
