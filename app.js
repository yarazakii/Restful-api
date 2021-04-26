// To validate objects
const Joi = require('joi');             // return class

const express = require('express');     // return a function
const app = express();                  // return an object

app.use(express.json());   // adding a piece of middleware 

const courses = [
    { id: 1, name: 'course1', code:'akl201' },
    { id: 2, name: 'course2' , code:'jsn292' },
    { id: 3, name: 'course3' , code: 'nsd202'}
];


const students= [
    {id: 1, name: "ahmed", code: 'jdnjkjd'},
    {id: 2, name: "aly", code: 'ksndkdw'}
]; 




// to get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// to get single course
// api/courses/1 to get course of id 1
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    res.send(course);
});

// Add course
app.post('/api/courses', (req, res) => {
    // validate request
    pattern = /[a-zA-Z]{3}\d{3}/i 
    const schema = {
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(pattern).length(6).required(),
        id: Joi.number().integer(),
        description: Joi.string().max(200).optional()
    }

    const result = Joi.validate(req.body, schema);
    // console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }


    // create a new course object
    const course = {
        id: courses.length + 1,
        name: req.body.name, // assuming that request body there's a name property
        code: req.body.code, 
    };
    courses.push(course);
    res.send(course);
});

// Updating resources
app.put('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    course.name = req.body.name;
    course.code = req.body.code;
    course.description= req.body.description;
    res.send(course);
});


// Deleting a course
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(5).required(),
        code: Joi.string().required(),  
        id: Joi.number().integer(),
        description: Joi.string().max(200).optional()
    }
    return Joi.validate(course, schema);
}



// to get all students
app.get('/api/students', (req, res) => {
    res.send(students);
});

// to get single student
app.get('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }
    res.send(student);
});


// Add student
app.post('/api/students', (req, res) => {
    // validate request
    pattern = /^[a-zA-Z'\-]+$/i
    const schema = {
        name: Joi.string().regex(pattern).required(),
        code: Joi.string().length(7).required(),
        id: Joi.number().integer(),
    
    }

    const result = Joi.validate(req.body, schema);
    // console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }


    // create a new course object
    const student = {
        id: students.length + 1,
        name: req.body.name, 
        code: req.body.code, 
    };

    students.push(student);
    res.send(student);
});

// Updating students
app.put('/api/students/:id', (req, res) => {
    // Look up the student 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    const { error } = validateStudent(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    student.name = req.body.name;
    student.code = req.body.code;
    res.send(student);
});

// Deleting a course
app.delete('/api/students/:id', (req, res) => {
    // Look up the student 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }

    // Delete
    const index = students.indexOf(student);
    students.splice(index, 1);
    
    // Return the same course
    res.send(student);
});

function validateStudent(student) {
    const schema = {
        name: Joi.string().regex(pattern).required(),
        code: Joi.string().length(7).required(),
        id: Joi.number().integer()
    }
    return Joi.validate(student, schema);
}



// Environment variable
const port = process.env.PORT || 3000

app.listen(port /*PortNumber*/, () => console.log(`Listeneing on port ${port}......`) /* optionally a function that called when the app starts listening to the given port */);


