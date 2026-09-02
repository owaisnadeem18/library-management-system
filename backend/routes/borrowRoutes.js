import express from "express"
import { Router } from "express"
import { getMyHistory, issueBook, returnBook } from "../controllers/borrowController";

const router = express.Router()

router.post('/issue', issueBook);
router.put("/return/:id" , restrictTo("ADMIN" , "LIBRARIAN") , returnBook )
router.get("/my-history" , getMyHistory)

export default router