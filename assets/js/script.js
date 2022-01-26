// variables
let resultsDiv = document.getElementById("results");
let bookResults = [];
// need a variable for tracking index of page 0-4 or something like that
// functions

//call Open Library with the genre and get that cream filling
function handleResults(event) {
  event.preventDefault();
  //grab genre from dropdown
  const genres = document.querySelector("#genres").value;
  const fetchUrl = `http://openlibrary.org/search.json?subject=${genres}&limit=10`;

  //fetching results
  resultsDiv.innerHTML = "Loading Results";
  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayResults(data.docs);
      bookResults = data.docs;
    });
}

//display results
// rerun this function based on the page index every time it changes
function displayResults(results) {
  // clear results section
  resultsDiv.innerHTML = "";
  // loop throgh results
  results.forEach((result) => {
    console.log(result.title);

    // create cards for each result
    const cardDiv = document.createElement("div");

    // style card
    cardDiv.classList.add("card", "p-3", "m-3");

    //  display categories in result card. If category is unavailable display error message
    const firstSentence = result.hasOwnProperty("first_sentence") ? result.first_sentence[0] : "First sentence not available";
    const pageNumbers = result.hasOwnProperty("number_of_pages_median") ? result.number_of_pages_median : "Page numbers not available";
    cardDiv.innerHTML += `<div class="has-text-primary-dark is-size-4 has-text-weight-bold">${result.title}</div> <div><strong>First Sentence Teaser:</strong> ${firstSentence}</div> <div><strong>Number of Pages:</strong> ${pageNumbers}</div>`;

    // append card to results display section
    document.getElementById("results").appendChild(cardDiv);
  });
  // stack search dropdown and results display vertically
  document.getElementById("genreBox").className = "is-vertical";
  document.getElementById("genreSearches").classList.remove("is-vertical");
  document.getElementById("searchHistory").classList.remove("is-grouped");
  // document.getElementById("genreSearches").className = "is-5";
}

//filter results based on page number
function handleFilter() {
  const value = this.selectedOptions[0].getAttribute("data-value");
  const compare = this.selectedOptions[0].getAttribute("data-compare");
  let filterResults = [];
  //if the page number variable is less than selected number then displays books that fit that criteria
  if (compare === "under") {
    filterResults = bookResults.filter(function (e) {
      return e.number_of_pages_median < value;
    });
    //returns options that are greater than the value that is defined
  } else {
    filterResults = bookResults.filter(function (e) {
      return e.number_of_pages_median > value;
    });
  }
  console.log(filterResults);
  //call display results function
  displayResults(filterResults);
}

// event listeners
//submit for genre
//filter(s)

//event listeners
document.querySelector("#genreBtn").addEventListener("click", handleResults);
document.querySelector("#filter").addEventListener("change", handleFilter);
