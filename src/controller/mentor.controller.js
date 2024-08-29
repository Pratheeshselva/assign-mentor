import { MongoClient } from "mongodb"
import 'dotenv/config'
import { v4 as uuid } from "uuid"


const url = process.env.DB_URL
const dbName = process.env.DB_NAME
const client = new MongoClient(url)


const getAllMentor = async (req, res) => {
    try {
        await client.connect()
        const mentorcollection = client.db(dbName).collection('mentor')
        let mentor = await mentorcollection.find().toArray()
        res.status(200).send({
            message: "Data Fetch successfull",
            data: mentor
        })


    } catch (error) {
        console.log(`Error in ${req.params}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally {
        client.close()
    }
}

const createMentor = async (req, res) => {
    try {
        await client.connect()
        const mentorcollection = client.db(dbName).collection('mentor')
        let mentor = await mentorcollection.findOne({ email: req.body.email })
        if (!mentor) {
            req.body.id = uuid()
            await mentorcollection.insertOne(req.body)
            res.status(201).send({
                message: "Mentor Created successfully"
            })
        }
        else {
            res.status(400).send({ message: `Mentor with ${req.body.email} already exist` })
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally {
        client.close()
    }
}

const deleteMentorById = async (req, res) => {
    try {
        await client.connect()
        const mentorcollection = client.db(dbName).collection('mentor')
        let { id } = req.params
        let mentor = await mentorcollection.findOne({ id: id })
        if (mentor) {
            await mentorcollection.deleteOne({ id: id })
            res.status(200).send({
                message: "Mentor Deletion successfull"
            })
        }
        else {
            res.status(400).send({ message: `Mentor with ${req.body.id}does not exist` })
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally {
        client.close()
    }
}


const editMentorById = async (req, res) => {
    try {
        await client.connect()
        const mentorcollection = client.db(dbName).collection('mentor')
        let { id } = req.params
        let mentor = await mentorcollection.findOne({ id: id })
        if (mentor) {
            await mentorcollection.updateOne({ id: id }, { $set: { ...mentor, ...req.body } })
            res.status(200).send({
                message: "Mentor Edited successfully"
            })
        }
        else {
            res.status(400).send({ message: `Mentor with this Id does not exist` })
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally {
        client.close()
    }
}

const displayAllstudentsByMentorId = async (req, res) => {
    try {
        await client.connect()
        const { id } = req.params
        const mentorcollection = client.db(dbName).collection('mentor')
        const paramcheck = await mentorcollection.findOne({id:id})
        if(!paramcheck){
           return res.status(400).send({ message: `Mentor with this Id does not exist` })
        }

        const studentcollection = client.db(dbName).collection('students')
        const studentlist = await studentcollection.aggregate([
            {$match:{mentor:id}},
            {
                $lookup: {
                    from: 'mentor',
                    localField: 'mentor',
                    foreignField: 'id',
                    as: 'mentorname'
                }
            },
            { $unwind: '$mentorname' },
            {
                $project: {
                    name: 1, email: 1, age: 1, mentor: '$mentorname.name'
                }
            }
        ]).toArray()

     
        res.status(200).send({ message: "Data Fetch Successful", studentlist })


    } catch (error) {
        console.log(`Error in ${req.params}`)
        res.status(500).send({ message: error.message || "Internal server error" })
    }
    finally {
        client.close()
    }
}


export default { getAllMentor, createMentor, editMentorById, deleteMentorById, displayAllstudentsByMentorId }