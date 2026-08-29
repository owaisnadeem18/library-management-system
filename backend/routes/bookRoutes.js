import express from 'express';
import { createBook, getAllBooks, getBookById, deleteBook } from '../controllers/bookController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { upload } from '../config/multer.js';

const router = express.Router()

router.get("/" , getAllBooks)
router.get("/:id" , getBookById)

// Protected Routes (Only ADMIN & LIBRARIAN)
router.post("/" , protect , restrictTo("ADMIN" , "LIBRARIAN") , upload.single('cover_image'), createBook )
router.delete('/:id', protect, restrictTo('ADMIN', 'LIBRARIAN'), deleteBook);

export default router