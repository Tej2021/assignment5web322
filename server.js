/********************************************************************************* 
* WEB322 – Assignment 05 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students. 
* 
* Name: Tej Parekh  Student ID: 144914207   Date: 2022-03-20
* 
* Online (Heroku) Link: ________________________________________________________ 
* 
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path"); 
var multer = require("multer"); 
var fs = require("fs");
var static = require("serve-static"); 
var dataService = require("./data-service.js"); 
var bodyParser = require('body-parser');
var exphbs = require("express-handlebars");
var app = express();

function onHttpStart() 
{
    console.log("Express http server listening on %s",HTTP_PORT); 
    return new Promise ((res,req) =>
    {
        dataService.initialize()
        .then(function(data)
        {
            console.log(data);
         })
         .catch(function(err)
         {
            console.log(err);
         });
    });
};

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) 
    {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  

const upload = multer({ storage: storage });

//// GET //// GET //// GET //// GET //// GET //// GET //// GET //// GET //// GET ////
app.get("/", (req, res) => 
{
    res.render("home");
});

app.get('/', function (req, res, next) 
{
    res.render('home', {layout: false});
});

app.get("/about",(req,res) =>
{
    res.render("about");
}); 

app.get ("/images",(req,res) =>
{
    fs.readdir('./public/images/uploaded',(err,files)=>
    {
    if(err){
        console.log(err);
        res.status(500).send("sever error"); 
    }
    res.render("images",{"images": files});
    }); 

}); 

app.get("/images/add",(req,res) =>
{
    res.render("addImage"); 
}); 

app.get("/employees", (req, res) => 
{
    if(req.query.status)
    {
        dataService.getEmployeesByStatus(req.query.status)
       .then(function(data)
       {
        res.render("employees",{"employees": data, title : "Employees"});
       })
       .catch(function(err)
       {
        res.render({message: "no results"});
       });

    }else if(req.query.department){
        dataService.getEmployeesByDepartment(req.query.department)
        .then(function(data)
        {   
            res.render("employees",{"employees": data, title: "Employees(Managers)"});
        })
        .catch(function(err)
        {
            res.render({message: "no results"});
        });

    }else if(req.query.manager){
        dataService.getEmployeesByManager(req.query.manager)
        .then(function(data)
        {   
            res.render("employees",{"employees": data, title: "Employees"});
        })
        .catch(function(err)
        {
            res.render({message: "no results"});
        });

    }else{
        dataService.getAllEmployees()
        .then(function(data)
        {   
            res.render("employees", {"employees": data, title: "Employees"});
        })
        .catch(function(err)
        { 
            res.render({message: "no results"});
        });
    }
});

app.get("/employee/:num", (req, res) => 
{
    dataService.getEmployeeByNum(req.params.num)
    .then(function(data)
    {
        res.render("employee", {"employee": data });
    })
    .catch(function(err)
    {
      res.status(404).send("Employee Not Found!!!");
    });
});


app.get("/employees/add",(req,res)=>
{
    dataService.getDepartments()
        .then(function(data)
        {
            res.render("addEmployee", {"departments": data});
        })
        .catch(function(err)
        {
            res.render({message: "no results"});
        });
}); 

app.get("/managers", (req, res) => 
{
    dataService.getManagers()
          .then(function(data)
          {
            res.render("employees", {"employees": data, title: "Employees (Managers)"  });
          })
          .catch(function(err)
          {
            res.render({message: "no results"});
          });
});

app.get("/departments", (req, res) => 
{
    dataService.getDepartments()
          .then(function(data)
           {
            res.render("departments", { "departments": data, title: "Departments" });
           })
          .catch(function(err)
           {
            res.render({message: "no results"});
           });
});

//// POST //// POST //// POST //// POST //// POST //// POST //// POST //// POST ////
app.post("/images/add",upload.single("imageFile"),(req,res)=>
{
    res.redirect('/images'); 
});

app.post("/employees/add", (req, res) => 
{
    dataService.addEmployee(req.body)
        .then(function(data)
        {
            console.log(req.body);
            res.redirect("/employees");
        })
        .catch(function(err)
        {
            console.log(err);
        })
});

app.post("/employee/update", (req, res) => 
{
    dataService.updateEmployee(req.body)
        .then(function(data)
        {
            res.redirect("/employees");
            console.log("complete"); 
        })
        .catch(function(err)
        {
            console.log(err);
            console.log("fail");
        })
});

//// USE //// USE //// USE //// USE //// USE //// USE //// USE //// USE //// USE ////
app.use(function(req,res,next)
{
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});
 
app.use((err, req, res, next) => 
{ 
    console.error(err.stack);
    res.status(404).send("Page Not Found");
});

app.use('/', static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

//// ETC //// ETC //// ETC //// ETC //// ETC //// ETC //// ETC //// ETC //// ETC ////
app.engine('.hbs',exphbs({
    extname:".hbs",
    defaultLayout: 'main',
    helpers :{equal: (lvalue, rvalue, options) => 
        {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) 
            {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }},
            navLink: (url, options) => 
            {
                return '<li' +((url == app.locals.activeRoute) ? ' class="active" ' : '') +'><a href="' + url + '">' + options.fn(this) + '</a></li>';}
            }  
})); 

app.set("view engine",".hbs"); 

app.listen(HTTP_PORT, onHttpStart);