/* AAD Code Library – content extracted from AAD_Practical_PROPER_Executable_Codes.pdf (Units 1–10 only).
   Code is stored in template literals; backticks inside code are escaped as \` */
const NPM_EXPRESS = { label: "Install Express", lang: "sh", code: "npm install express" };
const NPM_MONGO = { label: "Install MongoDB driver", lang: "sh", code: "npm install mongodb" };
const NG = '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>';
const NG_NOTE = "Uses the AngularJS 1.x CDN, so internet access is needed for the script.";

const UNITS = [
{ n: 1, title: "Node.js", questions: [
 { q: 1, title: "Create HTTP Server", question: "Create an HTTP web server and respond to an HTTP request.",
   keywords: "http createServer listen node.js server built-in module",
   files: [{ name: "unit1_server.js", lang: "js", code: `const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end("<h1>Hello World</h1><p>Node.js Server</p>");
});
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});` }],
   cmds: [{ label: "Run", lang: "sh", code: "node unit1_server.js" }],
   url: "http://localhost:3000",
   notes: "Viva: http = built-in Node module. createServer() creates the server. listen(3000) starts it." },
 { q: 2, title: "Routing Without Express", question: "Demonstrate routing in Node.js without Express.",
   keywords: "routing req.url http node.js routes about home",
   files: [{ name: "unit1_routes.js", lang: "js", code: `const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("Home Page");
  } else if (req.url === "/about") {
    res.end("About Page");
  } else {
    res.end("Page Not Found");
  }
});
server.listen(3000, () => {
  console.log("http://localhost:3000");
});` }],
   cmds: [], url: "", notes: "" }
]},
{ n: 2, title: "Node.js Console / REPL", questions: [
 { q: 1, title: "Arithmetic Operations", question: "Addition, subtraction, multiplication and division.",
   keywords: "addition subtraction multiplication division console.log node.js math",
   files: [{ name: "unit2_math.js", lang: "js", code: `let a = 20;
let b = 5;
console.log("Addition =", a + b);
console.log("Subtraction =", a - b);
console.log("Multiplication =", a * b);
console.log("Division =", a / b);` }],
   cmds: [{ label: "Run", lang: "sh", code: "node unit2_math.js" }], url: "", notes: "" },
 { q: 2, title: "String Functions and typeof", question: "String functions and typeof.",
   keywords: "string length toUpperCase toLowerCase typeof node.js",
   files: [{ name: "unit2_string.js", lang: "js", code: `let name = "Gayatri";
console.log("Length =", name.length);
console.log("Upper =", name.toUpperCase());
console.log("Lower =", name.toLowerCase());
console.log("Type =", typeof name);` }],
   cmds: [], url: "", notes: "" },
 { q: 3, title: "Company Class Object", question: "Create a Company class and display its object value.",
   keywords: "class constructor object node.js Company",
   files: [{ name: "company.js", lang: "js", code: `class Company {
  constructor(name) {
    this.name = name;
  }
  display() {
    console.log("Company =", this.name);
  }
}
let c = new Company("ABC Company");
c.display();` }],
   cmds: [], url: "", notes: "" },
 { q: 4, title: "Server Displaying Your Name", question: "Create a server and display your name.",
   keywords: "http server createServer listen node.js name",
   files: [{ name: "name_server.js", lang: "js", code: `const http = require("http");
http.createServer((req, res) => {
  res.end("My Name is Gayatri");
}).listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});` }],
   cmds: [], url: "", notes: "" },
 { q: 5, title: "REPL Basic Commands", question: "REPL – basic commands.",
   keywords: "repl node console math sqrt pow round floor ceil exit",
   files: [{ name: "REPL session (type in terminal)", lang: "sh", noFile: true, code: `node
> 10 + 5
> "hello".toUpperCase()
> Math.sqrt(25)
> Math.pow(2, 3)
> Math.round(4.6)
> Math.floor(4.9)
> Math.ceil(4.1)
> .exit` }],
   cmds: [], url: "", notes: "REPL = Read, Evaluate, Print, Loop." }
]},
{ n: 3, title: "Custom Middleware in Express", questions: [
 { q: 1, title: "Custom Middleware", question: "Write a program to create custom middleware.",
   keywords: "express middleware next app.use node.js",
   files: [{ name: "unit3_middleware.js", lang: "js", code: `const express = require("express");
const app = express();
function myMiddleware(req, res, next) {
  console.log("Middleware executed");
  next();
}
app.use(myMiddleware);
app.get("/", (req, res) => { res.send("Hello World");
});
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});` }],
   cmds: [NPM_EXPRESS, { label: "Run", lang: "sh", code: "node unit3_middleware.js" }],
   url: "http://localhost:3000",
   notes: "Important viva: next() passes control to the next middleware/route." }
]},
{ n: 4, title: "Express Installation and Routes", questions: [
 { q: 1, title: "Express Hello World", question: "Hello World.", keywords: "express app.get hello world",
   files: [{ name: "hello.js", lang: "js", code: `const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(3000, () => {
  console.log("http://localhost:3000");
});` }],
   cmds: [{ label: "Setup (if not done)", lang: "sh", code: "npm install express" }, { label: "Run", lang: "sh", code: "node hello.js" }], url: "http://localhost:3000", notes: "" },
 { q: 2, title: "Display Current Time", question: "Display current time.", keywords: "express date toLocaleString time",
   files: [{ name: "time.js", lang: "js", code: `const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Current Time: " + new Date().toLocaleString());
});
app.listen(3000, () => {
  console.log("http://localhost:3000");
});` }],
   cmds: [{ label: "Run", lang: "sh", code: "node time.js" }], url: "http://localhost:3000", notes: "" },
 { q: 3, title: "Create a Route Displaying Hello World", question: "Create a route and display Hello World.", keywords: "express route /hello app.get",
   files: [{ name: "route.js", lang: "js", code: `const express = require("express");
const app = express();
app.get("/hello", (req, res) => {
  res.send("Hello World");
});
app.listen(3000, () => {
  console.log("http://localhost:3000/hello");
});` }],
   cmds: [{ label: "Run", lang: "sh", code: "node route.js" }], url: "http://localhost:3000/hello", notes: "" },
 { q: 4, title: "Function as Route Handler", question: "Create a function and route.", keywords: "express function route welcome app.get",
   files: [{ name: "Filename not given in PDF (e.g. function.js)", lang: "js", noFile: true, code: `const express = require("express");
const app = express();
function welcome(req, res) {
  res.send("Welcome to AAD");
}
app.get("/welcome", welcome);
app.listen(3000);` }],
   cmds: [], url: "http://localhost:3000/welcome", notes: "The PDF does not give a filename for this program. Route is /welcome." },
 { q: 5, title: "Route Parameters (req.params)", question: "Create a route and send parameters.", keywords: "express req.params route parameter :name student",
   files: [{ name: "parameter.js", lang: "js", code: `const express = require("express");
const app = express();
app.get("/student/:name", (req, res) => {
  res.send("Student Name: " + req.params.name);
});
app.listen(3000, () => {
  console.log("Try: http://localhost:3000/student/Gayatri");
});` }],
   cmds: [{ label: "Run", lang: "sh", code: "node parameter.js" }], url: "http://localhost:3000/student/Gayatri",
   notes: "Viva: :name is a route parameter. req.params.name reads its value." }
]},
{ n: 5, title: "MongoDB CRUD", questions: [
 { q: 1, title: "MongoDB CRUD Operations", question: "Implement Create, Read, Update and Delete.",
   keywords: "mongodb crud insertOne find updateOne deleteOne MongoClient students aad_db",
   files: [{ name: "unit5_crud.js", lang: "js", code: `const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
async function main() {
  try {
    await client.connect();
    const db = client.db("aad_db");
    const students = db.collection("students");
    // CREATE
    await students.insertOne({
      name: "Gayatri",
      course: "BSc CS"
    });
    console.log("Record inserted");
    // READ
    console.log("Records:");
    console.log(await students.find().toArray());
    // UPDATE
    await students.updateOne(
      { name: "Gayatri" },
      { $set: { course: "BSc Computer Science" } }
    );
    console.log("Record updated");
    // DELETE
    await students.deleteOne({ name: "Gayatri" });
    console.log("Record deleted");
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await client.close();
  }
}
main();` }],
   cmds: [NPM_MONGO, { label: "Run", lang: "sh", code: "node unit5_crud.js" }], url: "",
   notes: "Requirement: MongoDB server must be running. Remember: insertOne = Create, find = Read, updateOne = Update, deleteOne = Delete." }
]},
{ n: 6, title: "AngularJS", questions: [
 { q: 1, title: "Data Binding: First Name and Last Name", question: "FirstName and LastName with data binding.",
   keywords: "angularjs ng-app ng-model data binding first name last name",
   files: [{ name: "index.html", lang: "html", code: `<!DOCTYPE html>
<html ng-app="">
<head>
  <title>Data Binding</title>
  ${NG}
</head>
<body>
<h2>Student Name</h2>
First Name:
<input type="text" ng-model="firstName"><br><br>
Last Name:
<input type="text" ng-model="lastName"><br><br>
<h3>{{firstName}} {{lastName}}</h3>
</body>
</html>` }],
   cmds: [], url: "", notes: NG_NOTE + " Run: Open index.html in a browser. Type in the boxes; the name appears immediately." },
 { q: 2, title: "Calculator Using Evaluation Expressions", question: "Addition, subtraction, multiplication and division using evaluation expressions.",
   keywords: "angularjs calculator expressions ng-model number addition subtraction multiplication division",
   files: [{ name: "calculator.html", lang: "html", code: `<!DOCTYPE html>
<html ng-app="">
<head>
  ${NG}
</head>
<body>
<h2>Calculator</h2>
<input type="number" ng-model="a" placeholder="Enter A">
<input type="number" ng-model="b" placeholder="Enter B">
<p>Addition: {{a + b}}</p>
<p>Subtraction: {{a - b}}</p>
<p>Multiplication: {{a * b}}</p>
<p>Division: {{a / b}}</p>
</body>
</html>` }],
   cmds: [], url: "", notes: "Note: AngularJS converts number inputs to numeric values here, so arithmetic expressions work correctly. " + NG_NOTE },
 { q: 3, title: "AngularJS Controller", question: "AngularJS controller.",
   keywords: "angularjs controller ng-controller $scope module",
   files: [{ name: "controller.html", lang: "html", code: `<!DOCTYPE html>
<html ng-app="myApp">
<head>
  ${NG}
</head>
<body ng-controller="myCtrl">
<h2>{{name}}</h2>
<script>
var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) {
  $scope.name = "Gayatri";
});
</script>
</body>
</html>` }],
   cmds: [], url: "", notes: NG_NOTE },
 { q: 4, title: "Registration Form with Data Binding", question: "Registration form with data binding.",
   keywords: "angularjs registration form data binding ng-model email name",
   files: [{ name: "registration.html", lang: "html", code: `<!DOCTYPE html>
<html ng-app="">
<head>
  ${NG}
</head>
<body>
<h2>Registration Form</h2>
Name:
<input type="text" ng-model="name"><br><br>
Email:
<input type="email" ng-model="email"><br><br>
<p>Name: {{name}}</p>
<p>Email: {{email}}</p>
</body>
</html>` }],
   cmds: [], url: "", notes: NG_NOTE }
]},
{ n: 7, title: "AngularJS Filters", questions: [
 { q: 1, title: "Form with uppercase, lowercase, date and number Filters", question: "Form with uppercase, lowercase, date and number filters.",
   keywords: "angularjs filters uppercase lowercase date number ng-model controller",
   files: [{ name: "filters.html", label: "Original version", lang: "html", code: `<!DOCTYPE html>
<html ng-app="">
<head>
  ${NG}
</head>
<body>
Name:
<input ng-model="name">
<p>Uppercase: {{name | uppercase}}</p>
<p>Lowercase: {{name | lowercase}}</p>
<p>Today: {{today | date}}</p>
<p>Number: {{number | number:2}}</p>
<script>
document.addEventListener("DOMContentLoaded", function() {
  // Values can also be supplied through AngularJS model/controller.
});
</script>
</body>
</html>` },
   { name: "filters.html", label: "Alternate working version (controller)", lang: "html", code: `<!DOCTYPE html>
<html ng-app="myApp">
<head>
  ${NG}
</head>
<body ng-controller="myCtrl">
<input ng-model="name">
<p>Uppercase: {{name | uppercase}}</p>
<p>Lowercase: {{name | lowercase}}</p>
<p>Date: {{today | date}}</p>
<script>
var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) {
  $scope.name = "Gayatri";
  $scope.today = new Date();
});
</script>
</body>
</html>` }],
   cmds: [], url: "", notes: "For a completely reliable practical demonstration of filters, use the controller version (second tab). " + NG_NOTE },
 { q: 2, title: "Display a List and Sort with orderBy", question: "Display a list and sort it using orderBy.",
   keywords: "angularjs orderBy ng-repeat filter sort list students",
   files: [{ name: "Filename not given in PDF (e.g. orderby.html)", lang: "html", noFile: true, code: `<!DOCTYPE html>
<html ng-app="myApp">
<head>
  ${NG}
</head>
<body ng-controller="myCtrl">
<h3>Students</h3>
<ul>
  <li ng-repeat="x in students | orderBy">
    {{x}}
  </li>
</ul>
<script>
var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) {
  $scope.students = ["Rahul", "Gayatri", "Amit", "Neha"];
});
</script>
</body>
</html>` }],
   cmds: [], url: "", notes: "The PDF does not give a filename for this program. " + NG_NOTE },
 { q: 3, title: "Custom Filter (addStar)", question: "Create a custom filter.",
   keywords: "angularjs custom filter app.filter addStar controller",
   files: [{ name: "Filename not given in PDF (e.g. customfilter.html)", lang: "html", noFile: true, code: `<!DOCTYPE html>
<html ng-app="myApp">
<head>
  ${NG}
</head>
<body ng-controller="myCtrl">
<p>{{name | addStar}}</p>
<script>
var app = angular.module("myApp", []);
app.filter("addStar", function() {
  return function(value) {
    return value + " *";
  };
});
app.controller("myCtrl", function($scope) {
  $scope.name = "Gayatri";
});
</script>
</body>
</html>` }],
   cmds: [], url: "", notes: "The PDF does not give a filename for this program. " + NG_NOTE }
]},
{ n: 8, title: "Login Form Using Node.js + MongoDB", questions: [
 { q: 1, title: "Login Form with Node.js, Express and MongoDB", question: "Login form using Node.js + MongoDB. A complete basic login practical using Express and the MongoDB driver, intended for a local MongoDB lab setup.",
   keywords: "login form express mongodb findOne urlencoded post users username password",
   files: [{ name: "login.js", lang: "js", code: `const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const client = new MongoClient("mongodb://127.0.0.1:27017");
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send(\`
    <h2>Login Form</h2>
    <form method="POST" action="/login">
      Username: <input name="username"><br><br>
      Password: <input type="password" name="password"><br><br>
      <button type="submit">Login</button>
    </form>
  \`);
});
app.post("/login", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("aad_db");
    const users = db.collection("users");
    const user = await users.findOne({
      username: req.body.username,
      password: req.body.password
    });
    if (user) {
      res.send("Login successful");
    } else {
      res.send("Invalid username or password");
    }
  } catch (error) {
    res.send("Database error: " + error.message);
  } finally {
    await client.close();
  }
});
app.listen(3000, () => {
  console.log("Open http://localhost:3000");
});` }],
   cmds: [{ label: "Install", lang: "sh", code: "npm install express mongodb" },
     { label: "MongoDB shell: create one user before testing", lang: "mongo", code: `use aad_db
db.users.insertOne({
  username: "gayatri",
  password: "1234"
})` },
     { label: "Run", lang: "sh", code: "node login.js" }],
   url: "http://localhost:3000", notes: "Before testing, create one user in MongoDB. Then run node login.js, open http://localhost:3000 and enter gayatri / 1234." }
]},
{ n: 9, title: "Feedback Form Using Pug + Node.js + MongoDB + Express", questions: [
 { q: 1, title: "Feedback Form with Pug, Express and MongoDB", question: "Feedback form using Pug + Node.js + MongoDB + Express.",
   keywords: "feedback form pug express mongodb view engine res.render insertOne views",
   project: true, tree: "feedback-project/\n├── feedback.js\n└── views/\n    └── feedback.pug",
   steps: ["Create the folder feedback-project, and a folder named views inside it.", "Save feedback.js in feedback-project and feedback.pug inside views.", "Install the dependencies (below).", "Start MongoDB.", "Run node feedback.js from the feedback-project folder.", "Open http://localhost:3000, enter data and click Submit."],
   files: [{ name: "feedback.js", lang: "js", code: `const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const client = new MongoClient("mongodb://127.0.0.1:27017");
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("feedback");
});
app.post("/feedback", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("aad_db");
    const feedback = db.collection("feedback");
    await feedback.insertOne({
      name: req.body.name,
      message: req.body.message
    });
    res.send("Feedback saved successfully");
  } catch (error) {
    res.send("Error: " + error.message);
  } finally {
    await client.close();
  }
});
app.listen(3000, () => {
  console.log("Open http://localhost:3000");
});` },
   { name: "views/feedback.pug", lang: "pug", code: `doctype html
html
  head
    title Feedback
  body
    h2 Feedback Form
    form(method="POST", action="/feedback")
      label Name
      input(type="text", name="name", required)
      br
      br
      label Feedback
      textarea(name="message", required)
      br
      br
      button(type="submit") Submit` }],
   cmds: [{ label: "Install", lang: "sh", code: "npm install express pug mongodb" }, { label: "Run", lang: "sh", code: "node feedback.js" }],
   url: "http://localhost:3000", notes: "" }
]},
{ n: 10, title: "Simple MEAN Stack Website", questions: [
 { q: 1, title: "MEAN Website (MongoDB + Express + AngularJS + Node.js)", question: "Simple MEAN stack website. MEAN = MongoDB + Express + AngularJS + Node.js. A small integrated website demonstrating all four parts.",
   keywords: "mean stack website mongodb express angularjs node.js students ng-repeat $http static public insertMany",
   project: true, tree: "mean-project/\n├── server.js\n└── public/\n    └── index.html",
   steps: ["Create the required folders and files: a folder named public, with index.html inside it, and server.js next to it.", "Install the dependencies (below).", "Start MongoDB.", "Insert a few students into MongoDB (sample data below).", "Run node server.js from the mean-project folder.", "Open http://localhost:3000 in the browser."],
   files: [{ name: "server.js", lang: "js", code: `const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const client = new MongoClient("mongodb://127.0.0.1:27017");
app.use(express.json());
app.use(express.static("public"));
app.get("/students", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("aad_db");
    const students = db.collection("students");
    const data = await students.find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({error: error.message});
  } finally {
    await client.close();
  }
});
app.listen(3000, () => {
  console.log("Open http://localhost:3000");
});` },
   { name: "public/index.html", lang: "html", code: `<!DOCTYPE html>
<html ng-app="myApp">
<head>
  <title>MEAN Website</title>
  ${NG}
</head>
<body ng-controller="myCtrl">
<h2>Student List</h2>
<ul>
  <li ng-repeat="student in students">
    {{student.name}} - {{student.course}}
  </li>
</ul>
<script>
var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope, $http) {
  $http.get("/students").then(function(response) {
    $scope.students = response.data;
  });
});
</script>
</body>
</html>` }],
   cmds: [{ label: "Install", lang: "sh", code: "npm install express mongodb" },
     { label: "MongoDB shell: example sample data", lang: "mongo", code: `use aad_db
db.students.insertMany([
  {name:"Gayatri", course:"BSc CS"},
  {name:"Amit", course:"BSc CS"}
])` },
     { label: "Run", lang: "sh", code: "node server.js" }],
   url: "http://localhost:3000", notes: "The AngularJS script needs internet access (CDN)." }
]}
];
