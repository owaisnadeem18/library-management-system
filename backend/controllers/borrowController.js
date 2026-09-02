import { catchAsync } from "../utils/catchAsync";

export const issueBook = catchAsync(async (req , res , next) => { 
    const { book_id } = req.body;
  const userId = req.user.id
})