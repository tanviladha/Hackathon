//require express and ejs to create the application 
const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user");

//connecting to mongoose 
//creates a variable for my database and then establishes a connection to it
var myDB = 'mongodb+srv://tanvi:ilovelearning@cluster0.gmlphhm.mongodb.net/?retryWrites=true&w=majority'; 
mongoose.connect(myDB);

//the connect() function returns whether the connection was successful in the form mongoose.connection
var dbConnection = mongoose.connection; 

//for debugging purposes after attempting database connection:
//when the connection is successfully established: 
dbConnection.once('connected', function() {
	console.log('Default connection established'); 
}); 
//when error is thrown 
dbConnection.once('error', function(err) {
	console.log('Connection error: ' + err);
}); 

//creating the session 
app.use(require("express-session") ({
	//to decode or encode a session 
	secret: "password", 
	resave: false, 
	saveUninitialized: false
})); 

//decode and encode the session 
passport.serializeUser(User.serializeUser());       
passport.deserializeUser(User.deserializeUser());   
passport.use(new LocalStrategy(User.authenticate()));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/views'));

//set up ejs 
//app.set("view engine","ejs");
//links to pages the different pages depending on where the user is within the website hierarchy 
//notes is the home page where the user starts; there are links from there to access the login and sign up pages 
app.get("/", (req,res) =>{
    res.render("home.ejs");
})

app.post("/userprofile" ,isLoggedIn, (req,res) =>{
    res.render("userprofile");
})

//index is the login page
app.get("/login",(req,res) =>{
    res.render("login.ejs");
});
//if it fails to login have them try again if it is a success takes the user to their user profile 
app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret.ejs",
    failureRedirect:"/login.ejs"
}),function (req, res){
});
app.get("/register",(req,res) =>{
    res.render("register.ejs");
});
app.post("/register",(req,res)=>{
    
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register.ejs");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("home.ejs");
    })    
    })
})
//once logged out, take user to home page 
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});
//logged in function to check if it is an authenticated account s
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/home.ejs");
}

//for debugging purposes and running the local host 
app.listen(process.env.PORT ||4000, function(err){
	if(err){
		console.log(err);
	}else{
		console.log("Server running at port 4000"); 
	}
}); 