I have created endpoints separately for students and mentors.

Student:
1. getAllStudents - https://assign-mentor-neqc.onrender.com/students/getAllStudents
2. createStuents - https://assign-mentor-neqc.onrender.com/students/createStudents 
   Example JSON format:
   {
    "name" : "kavi",
    "email" : "kavi@gmail.com",
    "age" :"27",
    "number":"12345670987",
    "role":"student"
}

3. editStudentById - https://assign-mentor-neqc.onrender.com/students/editStudentById/:id (Pass student Id as params)
4. deleteStudentById - https://assign-mentor-neqc.onrender.com/students/deleteStudentById/:id (Pass student Id as params)
5. assignStudentToMentor - https://assign-mentor-neqc.onrender.com/students/assignStudentToMentor
     Here studentId and mentorId should be sent. If there are one or more students pass the studentId data in the form of array
   Example format : {
    "studentId": ["717c002d-16d9-4957-8dfc-d613b82d63d7", "c9afa8c2-4c95-4339-8150-0333a85336e3" ],
    "mentorId":"0b4f93ad-0632-47e8-ab52-a12d2149c59a"
}

6. changeMentorForAstudent-  https://assign-mentor-neqc.onrender.com/students/changeMentorForAstudent
   Example format : {
    "mentorId":"0b4f93ad-0632-47e8-ab52-a12d2149c59a",
    "studentId":"717c002d-16d9-4957-8dfc-d613b82d63d7"
}

7. displayPreviousMentorByStudentId - https://assign-mentor-neqc.onrender.com/students/displayPreviousMentorByStudentId/:id  (Pass the StudentId in params to get the details for previous assigned mentors)


Mentor:
1. https://assign-mentor-neqc.onrender.com/mentor/getAllMentor
2. https://assign-mentor-neqc.onrender.com/mentor/createMentor
   Example format: {
    "name" : "alwin",
    "email" : "alwin@gmail.com",
    "age" :"33",
    "number":"3678922",
    "role":"mentor"
}
4. https://assign-mentor-neqc.onrender.com/mentor//editMentorById/:id (Pass the mentor Id in params and the key value pair to be edited)
5. https://assign-mentor-neqc.onrender.com/mentor//deleteMentorById/:id  (Pass the mentor Id to delete form the DB)
6. https://assign-mentor-neqc.onrender.com/mentor/displayAllstudentsByMentorId/:id (Pass the mentorId to get the list of students under him)
