import { AsyncRequestHandler } from "../utils/requestHandler"
import { PrismaClient } from "@prisma/client"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import env from "../utils/validateEnv"

const prisma = new PrismaClient()

export const signupUser: AsyncRequestHandler = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const findUser = await prisma.user.findUnique({
      where: { email },
    })

    if (findUser) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "There was an issue with your signup. Please try again.",
      })
    }

    const hashPassword = bcryptjs.hashSync(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    })

    const response = {
      success: true,
      statusCode: 201,
      message: "User created successfully!",
      data: { userId: user.id, createdAt: user.createdAt },
    }
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
}

export const loginUser: AsyncRequestHandler = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Invalid username or password.",
      })
    }

    const validatePassword = bcryptjs.compareSync(password, user.password)

    if (!validatePassword) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Incorrect password.",
      })
    }

    const access_token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: "3d",
    })

    const response = {
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: { userId: user.id, access_token },
    }
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

export const deleteUser: AsyncRequestHandler = async (req, res, next) => {
  const userId = req.user?.userId
  try {
    await prisma.user.delete({
      where: { id: userId },
    })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export const getUser: AsyncRequestHandler = async (req, res, next) => {
  const user = req.user
  try {
    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized",
      })
    }
    const response = {
      success: true,
      statusCode: 200,
      message: "User retrieved successfully.",
      data: { userId: user.userId, access_token: user.access_token },
    }
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}
