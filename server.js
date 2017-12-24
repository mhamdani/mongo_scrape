// Dependencies
var express = require("express");
var mongojs = require('mongojs');
// Dependencies that enable scraping
var request = require("request");
var cheerio = require("cheerio");

// Initialize express with app
var app = express();

// Set up a static folder for web app
app.use(express.static("public"));

// Configure mongojs database
var databaseURL = "news"
var collections = ["topStories"];

// Hook monogojs config to our db variable
var db = mongojs(databaseURL, collections);
  db.on("error", function(error){
    console.log("Database ran into Error: ", error);
  });

// Routes
  // Config main route
  app.get("/", function(req, res){
    res.send("Hello World");
  });

  // Config route to retrieve all data from topStories collection as JSON
  app.get("/all", function(req,res){
    db.topStories.find({}, function(err, docs){
      if (err){
        console.log(err);
      }
      else {
        res.json(docs);
      }
  });
});

app.get("/all", function(req,res){
  db.news.find({})
     .then(function(docs){
        res.json(docs);
    }).catch(function(err){
         console.log(err);
    });
});

// Config route to scrape data from news site and save it to MongoDB
app.get("/scrape", function(req, res){
  request("https://www.npr.org/sections/news/", function(error, response, html){
    var $ = cheerio.load(html);
// Scrape the a link associated with the specific class ('title') and display as text
// Assign that text as the title and set the link of that title as an attribute
    $(".title").each(function(i, element){
      var title = $(this).children("a").text();
      var link = $(this).children("a").attr("href");

      // If title and link exist, save data into MongoDB
      if (title && link){
        db.topStories.save({
          title: title,
          link: link
        },
        function(error, saved) {
          if (error){
            console.log(error);
          }
          else {
            console.log(saved);
          }
        });
      }

    });
  });
  res.send("Scrape complete!");
});

app.listen(3000, function(){
  console.log("Server is working! App is running on port 3000.");
});
