import { User } from "../../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validate from "../../validator/auth.validator.js";
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;
    const validationError = validate(
      name,
      username,
      email,
      password,
      confirmPassword
    );
    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }
    const normalizedName = name.trim();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = {
      name: normalizedName,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashPassword
    };
    await User.create(user);
    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const payload = {
      userid: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    return res.status(200).json({
      message: "Login successful",
      token: token
    });
  } catch (err) {
    console.log("Something went wrong!!", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { registerUser, loginUser };
