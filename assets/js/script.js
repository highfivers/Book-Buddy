// variables

// functions
//call Open Library with the genre and get that cream filling

function getStuff() {
  fetch("http://openlibrary.org/search.json?subject=fantasy&limit=10")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
//display results

//filter results based on page number (lodash)
//call display results function

// event listeners
//submit for genre
//filter(s)
getStuff();
