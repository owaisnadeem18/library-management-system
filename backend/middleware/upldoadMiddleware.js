import multer from "multer";
import path from "path";
import { AppError } from "../utils/appError";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/covers/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `book-${uniqueSuffix}${ext}`);
  },
});

// MIME Type Validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type! Only JPG, PNG, and WEBP image files are allowed.', 400), false);
  }
};

export const uploadCover = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB Max Limit
  },
});
