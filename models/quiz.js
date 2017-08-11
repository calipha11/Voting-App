var mongoose = require("mongoose");

/*var answerSchema = new mongoose.Schema({
    ansChoice: String,
    amount: Number
});*/

var QuizSchema = new mongoose.Schema({
    name: String,
    ansChoices: {},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});


/*choice1: {
            value: String,
            amount: {type: Number, default: 0}
        },
        choice2: {
            value: String,
            amount: {type: Number, default: 0}
        }*/

module.exports = mongoose.model("Quiz", QuizSchema);