var express=require('express');
var router=express.Router();
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy; 
var flash=require('connect-flash'); 

var User=require("../models/user");

router.get('/register',function(req,res){
	res.render('register');

});
router.get('/login',function(req,res){
	res.render('login');


});

router.get('/logout',function(req,res){
	req.logout();
	req.flash('sucess_msg',' You Are logged out');

 res.redirect('/users/login');

});
router.post('/register',function(req,res){
	
	var name=req.body.name;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;
	var password2=req.body.password2;
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(password2);
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','email is required').notEmpty();
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','password2 is required').equals(req.body.password);

    var errors=req.validationErrors();
    if(errors){
    	res.render('register',{
    		errors:errors
    	})
    }
else{
var newUser = new User({
	name:name,
	email:email,
	username:username,
	password:password
});
User.createUser(newUser,function(err,user){


if(err) throw err;
});
req.flash('sucess_msg','You Are register can now login');
res.redirect('/users/login');
}
});

 
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username,function(err,user){
    	if(err)throw err;
    	if(!user){
    		return done(null, false,{message:"UnknoeUser"});
         }
    	User.comparePassword(password, user.password,function(err,isMatch){
    		if(err) throw err;
    		if(isMatch){
                
                 console.log(user);
    			return done(null,user);

    		}else{
    			return done(null,false,{message:"Invalid Paaword"});

    		}
     });
    });
    }));





passport.serializeUser(function(user, done) {

  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserByUsername(id, function(err, user) {
    done(err, user);
  });
});





router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
   
    if (err) { 
    	return next(err);
    	 }
    if (!user)
     {
     var errorss;
     return res.render('login',{
       errorss:user
    	}); 
 }
    req.logIn(user, function(err) {
    	var errorss
      if (err) {
       return next(err);
        }
      return res.render('',
      	{
       errorss:user
    	}
      	);
    });
  })(req, res, next);
});




/*router.post('/login',
  passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login',failureFlash:true}),
  function(req, res) {
    res.redirect('/');
  });*/
module.exports=router;