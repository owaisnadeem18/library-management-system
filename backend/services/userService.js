import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/appError.js';
import jwt from 'jsonwebtoken';

// create a new class of UserService
export class UserService {
  // Create New User Account (Registration)
  static async createUser({ name, email, password }) {
    // 1. Check if user already exists
    const [existingUser] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUser?.length > 0) {
      throw new AppError(
        "An account with this email address already exists.",
        400,
      );
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert User into Database (Default role: MEMBER)
    const query =
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "MEMBER")';
    const [result] = await pool.execute(query, [name, email, hashedPassword]);

    return { id: result.insertId, name, email, role: "MEMBER" };
  }

  // Authenticate User (Login Verification)
  static async authenticateUser({ email, password }) {
    // 1. Fetch User Record
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      throw new AppError("Invalid email or password.", 401);
    }

    const user = users[0];

    // 2. Verify Hashed Password Match
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password.", 401);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
