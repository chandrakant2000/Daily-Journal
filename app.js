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

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = " You can mail me on xyz@gmail.com for any queries. ";

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
