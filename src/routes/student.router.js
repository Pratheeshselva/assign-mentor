import express from 'express'
import studentController from '../controller/student.controller.js'


const router = express.Router()

router.get('/getAllStudents' , studentController.getAllStudents)
router.post('/createStudents' , studentController.createStudents)
router.put('/editStudentById/:id' , studentController.editStudentById)
router.delete('/deleteStudentById/:id' , studentController.deleteStudentById)
router.put('/assignStudentToMentor', studentController.assignStudentToMentor )
router.put('/changeMentorForAstudent',studentController.changeMentorForAstudent)
router.get('/displayPreviousMentorByStudentId/:id', studentController.displayPreviousMentorByStudentId)


export default router