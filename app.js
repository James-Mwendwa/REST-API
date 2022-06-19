const Joi = require("joi");
const express = require("express");

const app = express();

app.use(express.json());

const courses = [
  {
    id: 1,
    name: "courses1",
  },
  {
    id: 2,
    name: "courses2",
  },
  {
    id: 3,
    name: "courses3",
  },
];

app.get("/", (req, res) => {
  res.send("Hello there");
});

//READ
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("NOT FOUND");
  res.send(course);
});


// CREATE
app.post("/api/courses", (req, res) => {
   const { error } = validateCourse(req.body);
   if (error) return res.status(400).send(error.details[0].message);


  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});


//UPDATE
app.put("/api/courses/:id", (req, res) => {

  //Look for the course
  //Does not exist. return 404 - Not Found
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("NOT FOUND");

  //Validate
  //If invalid return 400 - Bad Request
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  

  //Update the Course
  course.name = req.body.name;
  //Return the Updated Course
  res.send(course);
});


//DELETE
app.delete('/api/courses/:id', (req,res) => {
  
  //Look for the course
  // Does not exist, return 404 - Not Found
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("NOT FOUND");

  //Delete course
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //return course
  res.send(course)

})


function validateCourse(course){
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
