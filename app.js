//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Here’s a little secret- virtual wedding guest books are even better than the real thing! No, really, hear me out! An in-person guest book, as beautiful as it may be, really only lets you do so much. Your guests basically just sign in and maybe leave a little note under their signature.";

const aboutContent = "FAU graduate. Working in the field of Geomatics Engineering, Photogrammetry, GIS, computational and Data (spatial) analysis, remote sensing, Data Science ,web development and Transportation Engineering, I am currently working towards getting licenses in the areas of Engineering, surveying, GIS, and other relevant areas of interest.";
const contactContent = "https://www.linkedin.com/in/rodriguezsantosjoel/";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  name: String,
  lastname: String,
  age:Date,
  school:String,
  country:String,
  major:String,
  gender: String,
  pet:String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    name: req.body.postName,
    lastname:req.body.postLastname,
    age:req.body.postAge,
    school:req.body.postSchool,
    country:req.body.postCountry,
    major:req.body.postMajor,
    gender:req.body.postGender,
    pet:req.body.postPet,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      name: post.name,
      lastname: post.lastname,
      age:post.age,
      school:post.school,
      country:post.country,
      major:post.major,
      gender:post.gender,
      pet:post.pet,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
