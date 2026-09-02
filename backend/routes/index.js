import express from 'express';
import bookroutes from "./bookRoutes.js"
import adminBookRoutes from "./adminBookRoutes.js"
import authroutes from "./authRoutes.js"
import borrowRoutes from "./borrowRoutes.js"

const router = express.Router()

router.use("/books" , bookroutes)
router.use("/admin/books" , adminBookRoutes)
router.use("/auth" , authroutes)
router.use("/borrow" , borrowRoutes)

export default router