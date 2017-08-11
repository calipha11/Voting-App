var express = require("express"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User    = require("./models/user"),
    LocalStrategy = require("passport-local"),
    Quiz    = require("./models/quiz"),
    middleware = require("./middleware"),
    app     = express();
    
var url = process.env.DATABASEURL || "mongodb://localhost/voting_app";
mongoose.connect(url);  

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "A secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    Quiz.find({}, function(err, allQuizzes){
        if(err){
            console.log(err);
        } else {
            res.render("home", {quizzes: allQuizzes});
        }
    });
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("/quiz1", function(req, res){
    res.render("quiz1");
});

app.get("/newquiz", middleware.isLoggedIn, function(req, res){
    res.render("newquiz");
});

app.post("/newquiz", function(req, res){
    var name = req.body.name;
    var body = req.body;
    delete body.name;
    delete body.submitValue;
    
    var ansChoices = {};
    Object.keys(body).forEach(function(key){
        ansChoices[key] = {
            value: body[key],
            amount: 0
        };    
    });
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newQuiz = {name: name, ansChoices: ansChoices, author: author};
    Quiz.create(newQuiz, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/");
        }
    });
});

app.get("/quiz/:id", function(req, res){
    Quiz.findById(req.params.id).exec(function(err, foundQuiz){
        if(err){
            console.log(err);
        } else {
            res.render("quiz", {quiz: foundQuiz});
        }
    });
});

app.post("/quiz/update/:id", function(req, res){
    Quiz.findById(req.params.id, function(err, found){
        Object.keys(found.ansChoices).forEach(function(key){
            if(found.ansChoices[key].value == req.body.choice.replace(/['"]+/g, '')){
                var a = found.ansChoices;
                a[key].amount += 1;
                Quiz.update({ _id: req.params.id}, { $set: {ansChoices: a}}, function(){
                    res.redirect("/quiz/" + req.params.id);
                });
            }
        });
    });
});

app.delete("/quiz/:id", middleware.checkQuizOwnership, function(req, res){
    Quiz.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Server started...");
});