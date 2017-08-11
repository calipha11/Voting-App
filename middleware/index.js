var Quiz = require("../models/quiz");

var middlewareObj = {};

middlewareObj.checkQuizOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Quiz.findById(req.params.id, function(err, foundQuiz){
            if(err){
                res.redirect("back");
            } else {
                if(foundQuiz.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;