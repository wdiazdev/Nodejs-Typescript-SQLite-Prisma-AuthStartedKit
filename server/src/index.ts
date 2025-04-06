import express from "express"
import env from "./utils/validateEnv"
import authRoutes from "./routes/auth.route"

const app = express()

app.use(express.json())

//Routes
app.use("/api/auth", authRoutes)

const port = env.PORT

app.listen(port, (err) => {
  if (err) {
    console.error("Failed to start server:", err)
    return
  }
  console.log(`Server is listening on port ${port}`)
})
