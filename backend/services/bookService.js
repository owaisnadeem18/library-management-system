import pool from "../config/db";
import { AppError } from "../utils/appError";

export class BookService {

    static async createBook (data) {
        const { title, author, isbn, category, total_copies, cover_image } = data;

        const [existing] = await pool.execute('SELECT id FROM books WHERE isbn = ?', [isbn]);

        if (existing?.length > 0) {
            throw new AppError("Book with this ISBN already exists." , 400)
        }

        const query = `
      INSERT INTO books (title, author, isbn, category, total_copies, available_copies, cover_image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      title,
      author,
      isbn,
      category,
      total_copies,
      total_copies, // Initially available copies = total copies
      cover_image
    ])

    return { id: result.insertId, ...data, available_copies: total_copies };

    }

    static async getAllBooks (search) {
        let query = "SELECT * FROM books"
        let params = []

        if (search) {
      query += ' WHERE title LIKE ? OR author LIKE ? OR category LIKE ?';
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm];
    }

        const [books] = await pool.execute(query , params)
        return books 
    }

    static async getBookById (id) {
        const [books] = await pool.execute("SELECT * FROM books WHERE id = ?" , [id])
        if (books.length == 0) {
            throw new AppError("Book not found with this ID." , 404)
        }

        return books[0]
    }

    static async deleteBook (id) {
        const [result] = await pool.execute('DELETE FROM books WHERE id = ?', [id]);
        if (result.affectedRows == 0) {
            throw new AppError("Book Not Found" , 404)
        }
        return true
    }

}

