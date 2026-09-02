import { BorrowService } from "../services/borrowService";
import { catchAsync } from "../utils/catchAsync";

export const issueBook = catchAsync(async (req , res , next) => { 
    const { book_id } = req.body;
    const userId = req.user.id

    if (!book_id) return next(new AppError('Book ID is required.', 400));

    const result = await BorrowService.issueBook(userId, book_id);

    res.status(201).json({ status: 'success', data: { borrow: result } });

})