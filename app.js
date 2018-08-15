var flash=require('connect-flash'); 

var express=require('express'); 
var path=require('path'); 
var cookieparser=require('cookie-parser'); 
var expressValidator=require('express-validator');
var bodyparser=require('body-parser'); 
var exphbs=require('express-handlebars'); 
var session=require('express-session'); 
var passport=require('passport');
  
var LocalStrategy=require('passport-local').Strategy; 
var mongo=require('mongodb'); 
var mongoose=require('mongoose');
mongoose.connect('mongodb://main:main123@ds147011.mlab.com:47011/demodatabse');
var db =mongoose.connection;

var app =express();
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({'defaultLayout':'layout'}));
app.set('view engine','handlebars');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({'extended':false}));
app.use(cookieparser());
var routes = require('./routes/index');
var users = require('./routes/users');
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
	errorFormatter:function(param,msg,value){
 var namespace=param.split('.')
 , root =namespace.shift()
 , formParam=root;
 while(namespace.length){
 	formParam+='['+namespace.shift()+']';
 }
 return{
 	param:formParam,
 	msg:msg,
 	value:value
 };
}
}));




app.use(flash());
app.use(function (req,res,next) {

res.locals.success_msg=req.flash('success_msg');
res.locals.error_msg=req.flash('error_msg');
res.locals.error=req.flash('error');
res.locals.user=req.user;

next();
});
app.use('/', routes);
app.use('/users', users);

app.set('port',(process.env.PORT || 3000));
app.listen(app.get('port'),function(){
	console.log("Server Start on port"+app.get('port'));

});

