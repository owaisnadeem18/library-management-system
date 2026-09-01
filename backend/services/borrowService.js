import AppError from "../utils/appError.js";
import pool from "../config/db";

export class BorrowService {
  // 1. Issue Book
  static async issueBook(userId, bookId) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Check 1: Book exists & available
      const [books] = await connection.query(
        "SELECT available_copies FROM books WHERE id = ? FOR UPDATE",
        [bookId],
      );

      if (books?.length == 0) {
        throw new AppError("Book not found.", 404);
      }

      if (books?.available_copies <= 0) {
        throw new AppError('Book is currently out of stock.', 400)
    }

    // Check 2: Check if user already has this book issued
      const [existing] = await connection.query(
        'SELECT id FROM borrows WHERE user_id = ? AND book_id = ? AND status = "ISSUED"',
        [userId, bookId]
      );
      if (existing.length > 0) {
        throw new AppError('You have already issued this book.', 400);
      }

      // 14 Days Return Window Logic
      const issueDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(issueDate.getDate() + 14);

      // Record Insert
      const [result] = await connection.query(
        `INSERT INTO borrows (user_id, book_id, issue_date, due_date, status)
         VALUES (?, ?, ?, ?, 'ISSUED')`,
        [userId, bookId, issueDate, dueDate]
      );

      // Decrement Available Copies
      await connection.query(
        'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?',
        [bookId]
      );

      await connection.commit();
      return {
        id: result.insertId,
        user_id: userId,
        book_id: bookId,
        issue_date: issueDate,
        due_date: dueDate,
        status: 'ISSUED'
      };
    } catch (err) {
        await connection.rollback();
      throw error;
    }

    finally {
        connection.release();
    }
  }
}
