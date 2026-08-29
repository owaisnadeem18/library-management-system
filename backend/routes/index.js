import express from 'express';
import bookroutes from "./bookRoutes.js"
import adminBookRoutes from "./adminBookRoutes.js"
import authroutes from "./authRoutes.js"

const router = express.Router()

router.use("/books" , bookroutes)
router.use("/admin/books" , adminBookRoutes)
router.use("/auth" , authroutes)

export default router