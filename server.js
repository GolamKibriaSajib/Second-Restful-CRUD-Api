var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var mongojs=require("mongojs");//Here i used mongoJS and it is easy than mongoose
var ObjectId=mongojs.ObjectId;
 var bodyParser=require("body-parser");
 var expressValidator=require("express-validator");
 var myglobal;
 //var mongojs=require("mongojs");
 //var db=mongojs('customerapp',['users']);
 var databaseUrl="mongodb://127.0.0.1:27017/customerapp";
 var collection=("customerapp",["users"]);
 var db=mongojs(databaseUrl,collection);
 
var app = express();
 
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extened:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"/")));
// In this example, the formParam value is going to get morphed into form body format useful for printing. 
app.use(function(req,res,next){
	res.locals.errors=null;
	next();
});

app.use(expressValidator({   //this is just validator middleware before goes to any validator routes
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.get("/show",function(req,res){
	
	db.users.find(function(err,docs){
		 myglobal=docs;
		//console.log(docs);
		res.render("index",
	{title:"Customers",
	user:docs
	});
	})
	/*res.render("index",
	{title:"Customers",
	user:users
	});*/
});

app.delete("/users/delete/:id",function(req,res){
	db.users.remove({_id:ObjectId(req.params.id)},function(err){
		
		if(err){
			throw err;
		}
		else{
			res.redirect("/show");
		}
	});
	
	
});
app.post("/users/add",function(req,res){
	req.checkBody("first_name","First Name Required").notEmpty();
	req.checkBody("last_name","Last Name Required").notEmpty();
	req.checkBody("email","Email Required").notEmpty();
	var errors=req.validationErrors();
	if(errors){
		res.render("index",
	{title:"Customers",
	user:myglobal,
	errors:errors
	});
	}
	else{
		var newUser={
			first_name:req.body.first_name,
			last_name:req.body.last_name,
			email:req.body.email
		}
		db.users.insert(newUser,function(err,results){
			if(err){
				throw err;
			}
			else{
				res.redirect("/show");
			}
		});
	}
	
	
	
});


app.listen(3000);
