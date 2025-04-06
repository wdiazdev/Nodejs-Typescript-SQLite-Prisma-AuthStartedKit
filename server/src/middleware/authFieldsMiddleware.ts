import { AsyncRequestHandler } from "../utils/requestHandler"
import validator from "validator"

const authFieldsMiddleware: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "All fields are required",
      })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Oops! That doesn’t look like a valid email.",
      })
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Password’s a bit weak! Try adding 8+ characters, a number, and a symbol.",
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}

export default authFieldsMiddleware
