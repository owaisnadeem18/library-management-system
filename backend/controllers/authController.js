import { UserService } from "../services/userService.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "supersecretkey123",
    { expiresIn: "1d" },
  );
};

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if ((!name || !email || !password)) {
    return next(new AppError("Name, email, and password are required.", 400));
  }

  const user = await UserService.createUser({ name, email, password });
  const token = generateToken(user);

  res.status(201).json({
    status: "success",
    message: "Account created successfully!",
    token,
    data: { user },
  });
});

export const login = catchAsync(async (req , res , next) => {
    const {email , password} = req.body
    
    if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const user = await UserService.authenticateUser({email , password})
  const token = generateToken(user)

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully!',
    token,
    data: { user }
  });


})