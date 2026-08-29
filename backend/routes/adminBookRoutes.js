import express from 'express';
import { createBook, deleteBook } from '../controllers/bookController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.use(protect, restrictTo('ADMIN', 'LIBRARIAN'));

// POST /api/admin/books
router.post('/', upload.single('cover_image'), createBook);

// DELETE /api/admin/books/:id
router.delete('/:id', deleteBook);

export default router;