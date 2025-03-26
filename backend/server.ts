// server.ts
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import toolRoutes from './routes/toolRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())

// API Routes
app.use('/api/tools', toolRoutes)
app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
