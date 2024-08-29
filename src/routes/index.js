import express from 'express'
import studentRoutes from './student.router.js'
import mentorRoutes from './mentor.router.js'

const router = express.Router()

router.use('/students', studentRoutes)
router.use('/mentor', mentorRoutes)


export default router