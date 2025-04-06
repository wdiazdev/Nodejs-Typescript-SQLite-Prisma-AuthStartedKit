import { Router } from "express"
import { deleteUser, getUser, loginUser, signupUser } from "../controllers/auth.controller"
import authFieldsMiddleware from "../middleware/authFieldsMiddleware"
import authMiddleware from "../middleware/authMiddleware"

const router = Router()

router.post("/signup", authFieldsMiddleware, signupUser)
router.post("/login", authFieldsMiddleware, loginUser)
router.delete("/delete", authMiddleware, deleteUser)
router.get("/user", authMiddleware, getUser)

export default router
