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

      if (books[0].available_copies <= 0) {
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
      throw err;
    }

    finally {
        connection.release();
    }
  }


    // 2. Return Book:
    
    static async returnBook(userId, bookId) {
        const connection = await pool.getConnection();

        try {

            await connection.beginTransaction();

            // Check 1: Book exists & issued to user
            const [borrows] = await connection.query(
                'SELECT id FROM borrows WHERE user_id = ? AND book_id = ? AND status = "ISSUED" FOR UPDATE',
                [userId, bookId]
            );

            if (borrows.length === 0) {
                throw new AppError('No issued record found for this book and user.', 404);
            }

            const borrowRecord = borrows[0];
      const returnDate = new Date();
      const dueDate = new Date(borrowRecord.due_date);

      // Late Fine Calculation Logic (Rs. 50 per day)
      let fineAmount = 0;
      const timeDiff = returnDate.getTime() - dueDate.getTime();
      const lateDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (lateDays > 0) {
        fineAmount = lateDays * 50;
      }

      // Update Borrow Record
      await connection.query(
        `UPDATE borrows 
         SET return_date = ?, fine_amount = ?, status = 'RETURNED' 
         WHERE id = ?`,
        [returnDate, fineAmount, borrowId]
      );

      // Increment Available Copies
      await connection.query(
        'UPDATE books SET available_copies = available_copies + 1 WHERE id = ?',
        [borrowRecord.book_id]
      );

      await connection.commit();
      return {
        borrow_id: borrowId,
        fine_amount: fineAmount,
        status: 'RETURNED'
      };

        
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }

        finally {
            connection.release();
        }
    }

    // 3. User History
  async getUserHistory(userId) {
    const [rows] = await pool.query(
      `SELECT b.id, bk.title, bk.author, b.issue_date, b.due_date, b.return_date, b.fine_amount, b.status
       FROM borrows b
       JOIN books bk ON b.book_id = bk.id
       WHERE b.user_id = ?
       ORDER BY b.id DESC`,
      [userId]
    );
    return rows;
  }

}

