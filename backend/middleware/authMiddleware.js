import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

// Authentication Guard (Verify JWT)
export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please provide a valid token.", 401),
    );
  }

  // Decode JWT Payload
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attach User payload (id, role) to Context
  req.user = { id: decoded.id, role: decoded.role };
  next();
});

// Authorization Guard (Role Restrictions)
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles?.includes(req?.user?.role)) {
      return next(
        new AppError(
          "Permission Denied: You do not have access to perform this action.",
          403,
        ),
      );
    }

    next();
  };
};
