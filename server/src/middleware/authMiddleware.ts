import jwt from "jsonwebtoken"
import env from "../utils/validateEnv"
import { AsyncRequestHandler } from "../utils/requestHandler"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const authMiddleware: AsyncRequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Unauthorized. No access access_token provided.",
    })
  }

  try {
    const access_token = authHeader.split(" ")[1]
    const decoded = jwt.verify(access_token, env.JWT_SECRET) as { userId: number }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized.",
      })
    }

    req.user = {
      userId: user.id,
      access_token,
    }

    next()
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized. Invalid or expired access_token.",
      })
    }

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error.",
    })
  }
}

export default authMiddleware
