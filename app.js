require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "This is the daily journal blog post website. You can post your blogs here and store your day to day memories.";
const contactContent = "You can contact us at";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URL);

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);

let posts = [];

app.get("/", function (req, res) {

    Post.find({}, function(err, posts){

        if (err) {
            console.log(err);
        } else {
            res.render("home", {
                startingContent: homeStartingContent,
                posts: posts
            });
        }
    });
});

app.get("/contact", function (req, res) {
    res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
    res.render("compose");
});

app.post("/compose", function (req, res) {
    if(req.body.postTitle==="") return res.redirect("/")
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });
    
    post.save(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });

});

app.post("/delete", function (req, res) {

    const title = Object.keys(req.body)[0];

    Post.deleteOne({title: title}, function(err){
        if(err){
            console.log(err);
        } else {
            return res.redirect("/");
        }
    });

});

app.get("/posts/:id", function (req, res) {
    const requestedId = req.params.id;

    Post.findById(requestedId, function(err, post){
        if(err) {
            console.log(err);
        } else {
            console.log(post);
            res.render("post", {title: post.title, content:post.content});
        }
    });

});

app.listen(process.env.PORT, function () {
    console.log(`http://localhost:${process.env.PORT}`);
});
