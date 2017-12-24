function displayResults(newsTitles) {
  $("tbody").empty();

  topStories.forEach(function(stories){
    $("tbody").append("<tr><td>" + stories.title + "</td>");
  });
}

// On load:
// Create AJAX function for loading table in index.html with data from MongoDB
$.getJSON("/all", function(data){
  displayResults(data);
});
