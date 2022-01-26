// variables
let resultsDiv = document.getElementById("results");
let bookResults = [];
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

function displayResults(results) {
  resultsDiv.innerHTML = "";

  results.forEach((result) => {
    console.log(result.title);
    const firstSentence = result.hasOwnProperty("first_sentence") ? result.first_sentence[0] : "First sentence not available";
    const pageNumbers = result.hasOwnProperty("number_of_pages_median") ? result.number_of_pages_median : "Page numbers not available";
    const coverArt = result.hasOwnProperty("cover_i") ? result.cover_i : "No image avaiable";
    //create button link to amazon purchase page
    const amazonId = result.hasOwnProperty("id_amazon") ? result.id_amazon[0] : "Book is currently unavailable on Amazon";
    let linkToBuy = `​​https://www.amazon.com/s?k=${amazonId}`;
    resultsDiv.innerHTML += `<img src="https://covers.openlibrary.org/b/id/${coverArt}-M.jpg"> <div class="has-text-link is-size-3 has-text-weight-bold">${result.title}</div> <div>${firstSentence}</div> <div>Number of Pages: ${pageNumbers}</div> <a href="${linkToBuy}" target="_blank" id="amazonLink" class="button is-warning"> Buy Now!</a>`;
  });
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
  displayResults(filterResults);
}
//call display results function

// event listeners
//submit for genre
//filter(s)

//event listeners
document.querySelector("#genreBtn").addEventListener("click", handleResults);
document.querySelector("#filter").addEventListener("change", handleFilter);
