import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
dotenv.config()

// Import des routes
import authRoutes from "./routes/authRoutes"
import adminRoutes from "./routes/adminRoutes"

import path from "path"

const app = express()

app.use(cors())
app.use(express.json())

// Use path.join to reliably resolve the swagger file path relative to the current directory
// In production (dist/), __dirname points to dist/. In dev (src/), it points to src/.
const swaggerPath = path.join(__dirname, "swagger", "auth.yaml")
const swaggerDoc = YAML.load(swaggerPath)

// Route /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))

// Route /auth
app.use("/auth", authRoutes)

// Route /admin
app.use("/admin", adminRoutes)

export default app