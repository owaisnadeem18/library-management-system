import pool from "../config/db.js";
import { AppError } from "../utils/appError.js";

export class BookService {
  static async createBook(data) {
    const { title, author, isbn, category, total_copies, coverImage } = data;

    const [existing] = await pool.execute(
      "SELECT id FROM books WHERE isbn = ?",
      [isbn],
    );

    if (existing?.length > 0) {
      throw new AppError("Book with this ISBN already exists.", 400);
    }

    const query = `
      INSERT INTO books (title, author, isbn, category, total_copies, available_copies, coverImage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      title,
      author,
      isbn,
      category,
      total_copies,
      total_copies, // Initially available copies = total copies
      coverImage,
    ]);

    return { id: result.insertId, ...data, available_copies: total_copies };
  }

  static async getAllBooks(search) {
    let query = "SELECT * FROM books";
    let params = [];

    if (search) {
      query += " WHERE title LIKE ? OR author LIKE ? OR category LIKE ?";
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm];
    }

    const [books] = await pool.execute(query, params);
    return books;
  }

  static async getBookById(id) {
    const [books] = await pool.execute("SELECT * FROM books WHERE id = ?", [
      id,
    ]);
    if (books.length == 0) {
      throw new AppError("Book not found with this ID.", 404);
    }

    return books[0];
  }

  static async getCategories() {
    const [rows] = await pool.execute('SELECT DISTINCT category FROM books');
    return rows.map((row) => row.category);
  }

  static async deleteBook(id) {
    const [result] = await pool.execute("DELETE FROM books WHERE id = ?", [id]);
    if (result.affectedRows == 0) {
      throw new AppError("Book Not Found", 404);
    }
    return true;
  }
}
