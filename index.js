import express from 'express'
import appRoutes from './src/routes/index.js'
import 'dotenv/config'

const PORT = process.env.PORT 
const app = express()
app.use(express.json())
app.use(appRoutes)

app.listen(PORT,()=>console.log("App is listening to " + PORT))