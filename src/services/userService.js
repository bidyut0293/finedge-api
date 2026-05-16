const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { readJSON, writeJSON } = require("../utils/fileHelper");

const userPath = path.join(__dirname, "../data/users.json");

async function registerUser(data) {
  const users = await readJSON(userPath);

  // Check for duplicate email
  const existingUser = users.find(u => u.email === data.email);
  if (existingUser) {
    const CustomError = require("../utils/customError");
    throw new CustomError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = {
    id: uuidv4(),
    name: data.name,
    email: data.email,
    password: hashedPassword
  };

  users.push(newUser);

  await writeJSON(userPath, users);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    user: newUser,
    token
  };
}

module.exports = {
  registerUser
};