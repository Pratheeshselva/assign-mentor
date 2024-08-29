import { MongoClient } from "mongodb"
import 'dotenv/config'
import { v4 as uuid } from "uuid"


const url = process.env.DB_URL
const dbName = process.env.DB_NAME
const client = new MongoClient(url)


const getAllStudents = async (req, res) => {
    try {
        await client.connect()
        const studentcollection = client.db(dbName).collection('students')
        let students = await studentcollection.find().toArray()
        res.status(200).send({
            message: "Data Fetch successfull",
            data: students
        })


    } catch (error) {
        // console.log(`Error in ${req.params}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally {
        client.close()
    }
}

const createStudents = async (req, res) => {
    try {
        await client.connect()
        const studentcollection = client.db(dbName).collection('students')
        let student = await studentcollection.findOne({ email: req.body.email })
        if (!student) {
            req.body.id = uuid()
            req.body.mentor = null
            await studentcollection.insertOne(req.body)
            res.status(201).send({
                message: "Student Created successfully"
            })
        }
        else {
            res.status(400).send({ message: `User with ${req.body.email} already exist` })
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally {
        client.close()
    }
}

const deleteStudentById = async (req, res) => {
    try {
        await client.connect()
        const studentcollection = client.db(dbName).collection('students')
        let { id } = req.params
        let student = await studentcollection.findOne({ id: id })
        if (student) {
            await studentcollection.deleteOne({ id: id })
            res.status(200).send({
                message: "Student Deletion successfull"
            })
        }
        else {
            res.status(400).send({ message: `User with ${req.body.id}does not exist` })
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally {
        client.close()
    }
}


const editStudentById = async (req, res) => {
    try {
        await client.connect()
        const studentcollection = client.db(dbName).collection('students')
        let { id } = req.params
        let student = await studentcollection.findOne({ id: id })
        if (student) {
            await studentcollection.updateOne({ id: id }, { $set: { ...student, ...req.body } })
            res.status(200).send({
                message: "Student Edited successfully"
            })
        }
        else {
            res.status(400).send({ message: `User with this Id does not exist` })
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally {
        client.close()
    }
}

const assignStudentToMentor = async (req, res) => {
    try {
        await client.connect()
        const mentorcollection =  client.db(dbName).collection('mentor')
        let mentor = await mentorcollection.findOne({ id: req.body.mentorId })
        console.log(mentor)
        if (!mentor) {
            console.log(mentor)
           return res.status(404).send({ message: "Mentor not found" })
        }

        const studentcollection =  client.db(dbName).collection('students')
        const studentIds =  req.body.studentId
        let students = await studentcollection.find({id:{$in:studentIds}}).toArray()
        const studentsToUpdate = students.filter(student => !student.mentor)

        if (students.length !== studentIds.length) {
            return res.status(404).send({ message: "Some students not found" });
        }
        if (studentsToUpdate.length === 0) {
          return  res.status(404).send({ message: "All students are assigned with mentors" })
        }
      
        await client.db(dbName).collection('students').updateMany({ id:{$in:studentsToUpdate.map(student => student.id) } }, { $set: { mentor:req.body.mentorId } })
        {console.log(req.body.studentId)}
        {console.log(req.body.mentorId)}
        res.status(200).send({ message: "Student successfully assigned to mentor" })



    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally {
        client.close()
    }
}

const changeMentorForAstudent = async(req,res)=>{
    try {
        await client.connect()
        const studentcollection = client.db(dbName).collection('students')
        const mentorcollection = client.db(dbName).collection('mentor')

        const {studentId, mentorId} = req.body

      
        let mentor = await mentorcollection.findOne({ id: mentorId })
        if (!mentor) {
            console.log(mentor)
           return res.status(404).send({ message: "Mentor not found" })
        }
        let student = await studentcollection.findOne({ id: studentId })
        if (!student) {
            console.log(mentor)
           return res.status(404).send({ message: "Student not found" })
        }
        if(mentorId === student.mentor){
            return res.status(400).send({ message: "You are trying to assign the same mentor again" })
        }
        let previousMentorIdArray = student.previousMentorId || []
        console.log(previousMentorIdArray)
        if(student.mentor){
            previousMentorIdArray.push(student.mentor)
            console.log(previousMentorIdArray)
        }
        console.log(previousMentorIdArray)
        student.previousMentorId = previousMentorIdArray

        const update = await studentcollection.updateOne({id:studentId},{$set:{mentor:mentorId, previousMentorId: previousMentorIdArray}})
       
        console.log(update)
        if (update.matchedCount === 0) {
            return res.status(400).send({ message: 'Failed to assign mentor' });
        }
        res.status(200).send({ message: 'Mentor updated successfully'});

        
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally{
        client.close()
    }
}

const displayPreviousMentorByStudentId = async(req,res)=>{
    try {
        await client.connect()
        const {id} = req.params
        const studentcollection = client.db(dbName).collection('students')
        let studentCheck = await studentcollection.findOne({ id: id })
        if(!studentCheck){
          return  res.status(400).send({ message: `User with this Id does not exist` })
        }
        let students = await studentcollection.aggregate([
            {$match:{id:id}},
            {$lookup:{
          from:'mentor',
          localField:'previousMentorId',
          foreignField:'id',
          as:'mentorname'
          }},
           
            {$project:{
          id:1,name:1, email:1, age:1, previousMentors:'$mentorname.name'
          }},
          ]).toArray()

          res.status(200).send({message:"Data Fetch Successfull", PreviousMentors:students })
        
    } catch (error) {
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally{
        client.close()
    }
}


export default { getAllStudents, createStudents, deleteStudentById, editStudentById, assignStudentToMentor, changeMentorForAstudent,displayPreviousMentorByStudentId}