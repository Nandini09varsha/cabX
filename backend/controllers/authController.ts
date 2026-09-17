import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PublicKey } from "@solana/web3.ts";
import User from "../models/User.ts";
import { asyncHandler, httpError } from "../middleware/errorHandler.ts";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password || !role) {
    throw httpError(
      400,
      "name, email, phone, password and role are required",
    );
  }

  if (password.length < 6) {
    throw httpError(400, "Password must be at least 6 characters");
  }

  const allowedRoles = ["rider", "driver", "admin"];
  if (!allowedRoles.includes(role)) {
    throw httpError(400, "Invalid role");
  }

  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { phone }],
  });

  if (existingUser) {
    throw httpError(409, "Email or phone already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
    rating: 0,
  });

  const token = generateToken(user._id);

  return res.status(201).json({
    message: "Registration successful",
    token,
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw httpError(400, "email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw httpError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw httpError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);

  return res.status(200).json({
    message: "Login successful",
    token,
    user,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({ user: req.user });
});

export const linkWallet = asyncHandler(async (req, res) => {
  const { walletAddress, tokenAccount } = req.body;

  if (!walletAddress) {
    throw httpError(400, "walletAddress is required");
  }

  let pubkey;
  try {
    pubkey = new PublicKey(walletAddress);
  } catch (_error) {
    throw httpError(400, "Invalid Solana wallet address");
  }

  const address = pubkey.toBase58();
  const taken = await User.findOne({
    walletAddress: address,
    _id: { $ne: req.user._id },
  });

  if (taken) {
    throw httpError(409, "Wallet already linked to another account");
  }

  req.user.walletAddress = address;
  if (tokenAccount) {
    req.user.tokenAccount = tokenAccount;
  }
  await req.user.save();

  return res.status(200).json({
    message: "Wallet linked",
    user: req.user,
  });
});
