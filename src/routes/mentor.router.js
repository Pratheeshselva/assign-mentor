import express from 'express'
import mentorController from '../controller/mentor.controller.js'


const router = express.Router()

router.get('/getAllMentor' , mentorController.getAllMentor)
router.post('/createMentor' , mentorController.createMentor)
router.put('/editMentorById/:id' , mentorController.editMentorById)
router.delete('/deleteMentorById/:id' , mentorController.deleteMentorById)
router.get('/displayAllstudentsByMentorId/:id',mentorController.displayAllstudentsByMentorId)



export default router