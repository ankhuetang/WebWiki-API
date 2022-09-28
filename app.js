//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

//create schema
const articleSchema = {
  title: String,
  content: String,
}

//create model
const Article = mongoose.model("Article", articleSchema);

////TARGETING ALL ARTICLES//////chain the functions to the route /articles
app.route("/articles")
//create GET route to fetch all articles
.get(function(req, res){
  //find all articals with /articles route
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})
//Post one article to the articles route
.post(function(req, res){
  //create article from model
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  //save article
  newArticle.save(function(err){
    if(!err) res.send("Added new article");
    else res.send(err);
  });
})
//delete an articles
.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("deleted all articles");
    }else res.send(err);
  })
});

////////TARGETING A SPECIFIC ARTICLE///////////////////
app.route("/articles/:articleTitle")//dung : de specify paramenter de chon article
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}/*conditions*/, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else res.send(err);
  })//title fai = express params
})
//replace ca document bang ducment moi
.put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleTitle},//conditions
    {title: req.body.title, content: req.body.content},//update content va title moi
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }
    }
  );
})

//modify document
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article (patch).")
      }
      else{
        res.send(err);
      }
    }
  );
})
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("DeleteOne Successfully");
      }else res.send(err);
    })
  });
;









app.listen(3000, function() {
  console.log("Server started on port 3000");
});
