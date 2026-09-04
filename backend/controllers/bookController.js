import { BookService } from "../services/bookService.js";
import { AppError } from "../utils/appError.js";
import {catchAsync} from "../utils/catchAsync.js";

export const createBook = catchAsync(async (req, res, next) => {
  const { title, author, isbn, category, total_copies } = req.body;

  if (!title || !author || !isbn || !category || !total_copies) {
    return next(
      new AppError(
        "All fields (title, author, isbn, category, total_copies) are required.",
        400,
      ),
    );
  }

  const coverImage = req.file ? req.file.filename : null;

  const book = await BookService.createBook({
    title,
    author,
    isbn,
    category,
    total_copies: parseInt(total_copies),
    coverImage,
  });

  
  res.status(201).json({
    status: "success",
    data: { book },
  });
});

export const getAllBooks = catchAsync(async (req, res) => {
  const { search } = req.query;
  const books = await BookService.getAllBooks(search);

  res.status(200).json({
    status: "success",
    results: books.length,
    data: { books },
  });
});

export const getBookById = catchAsync(async (req, res) => {
  const book = await BookService.getBookById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { book },
  });
});

export const getCategories = catchAsync(async (req, res) => {
  const categories = await BookService.getCategories();
  res.status(200).json({
    status: "success",
    data: { categories },
  });
});

export const deleteBook = catchAsync(async (req , res) => {
    const book = await BookService.deleteBook(req.params.id)

    res.status(200).json({
        status: 'success',
        message: 'Book deleted successfully.'
    })

})