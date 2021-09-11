//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! ... Shutting down...');
    console.log(err.name, err.message);
    process.exit();
});

const homeStartingContent = "Welcome to my Daily Journal. You can read any journal of your interest. Click on compose button to compose a new journal.";
const aboutContent = "This website is for the people who want to read journals for free and who want to post their journals for free.";
const contactContent = "Mail us at xyz@gmail.com for any queries.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const url = 'mongodb+srv://' + process.env.DATABASE_USER + ':' + process.env.DATABASE_PASSWORD +
            '@cluster0.q9dui.mongodb.net/' + process.env.DATABASE_NAME + '?retryWrites=true';

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection is successful"));

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

const postSchema = new mongoose.Schema ({
    title: String,
    content: String
});

const Post = mongoose.model ("Post",postSchema);



app.get("/", function(req, res){
  
    Post.find(function(err, posts) {
        if(!err) {
            res.render("home", {
              startingContent: homeStartingContent,
              posts: posts,
            });
        }
    })

    
});
 
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const newPost = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  newPost.save(function(err) {
      if (!err) {
        console.log("Saved the item successfully");
      }
  })

  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findById(requestedPostId, function(err, post) {

    
      res.render("post", {
        title: post.title,
        content: post.content
      });
    
  });

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
