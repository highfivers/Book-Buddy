// variables
let resultsDiv = document.getElementById("results");
let bookResults = [];
let currentPage = 0;
let recordsPerPage = 10;
let genres = "";
let value = "";
let compare = "";

// functions
//call Open Library with the genre and get that cream filling
function handleResults(event) {
  event.preventDefault();
  //grab genre from dropdown
  genres = document.querySelector("#genres").value;
  const fetchUrl = `http://openlibrary.org/search.json?subject=${genres}&limit=10`;

  //fetching results
  resultsDiv.innerHTML = "Loading Results";
  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // makes "next" button visible after search is complete
      document.querySelector("#next").classList.remove("is-hidden");
      // displays results
      displayResults(data.docs);
      bookResults = data.docs;
    });
}

// handles page navigation
function pageResults() {
  const direction = this.getAttribute("data-type");
  // click "previous" button to go back 10 items
  if (direction === "previous") {
    if (currentPage > 9) {
      currentPage -= 10;
    }
    // hides "previous" button
    if (currentPage === 0) {
      document.querySelector("#previous").classList.add("is-hidden");
    }
    // makes "previous" button visible; shows next 10 items
  } else {
    document.querySelector("#previous").classList.remove("is-hidden");
    currentPage += 10;
  }

  const fetchUrl = `http://openlibrary.org/search.json?subject=${genres}&limit=10&offset=${currentPage}`;

  //fetching results
  resultsDiv.innerHTML = "Loading Results";
  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayResults(data.docs);
      bookResults = data.docs;
      handlePersistantFilter();
    });
}

//display results
function displayResults(results) {
  document.querySelector("#pageNumberFilter").classList.remove("is-hidden");
  resultsDiv.innerHTML = "";

  results.forEach((result) => {
    //create cards for each result
    const cardDiv = document.createElement("div");

    //style card
    cardDiv.classList.add("card", "p-3", "m-3");

    // display categories in result card. If category is unavabile diplay error message
    const firstSentence = result.hasOwnProperty("first_sentence")
      ? result.first_sentence[0]
      : "First sentence not available";
    const pageNumbers = result.hasOwnProperty("number_of_pages_median")
      ? result.number_of_pages_median
      : "Page numbers not available";
    const coverArt = result.hasOwnProperty("cover_i")
      ? result.cover_i
      : "No image avaiable";
    //create button link to amazon purchase page
    const amazonId = result.hasOwnProperty("id_amazon")
      ? result.id_amazon[0]
      : "Book is currently unavailable on Amazon";
    cardDiv.innerHTML += `<img src="https://covers.openlibrary.org/b/id/${coverArt}-M.jpg"> <div class="has-text-primary-dark is-size-4 has-text-weight-bold">${result.title}</div> <div><strong>First Sentence Teaser:</strong> ${firstSentence}</div> <div><strong>Number of Pages:</strong> ${pageNumbers}</div>`;

    let amazonLink = document.createElement("a");
    //generate amazon link to purchase
    amazonLink.href = "https://www.amazon.com/s?k=" + amazonId;
    amazonLink.innerHTML = "Buy Now!";
    amazonLink.className = "button is-warning";
    amazonLink.target = "_blank";
    cardDiv.appendChild(amazonLink);
    // append card to results display section
    document.getElementById("results").appendChild(cardDiv);
  });

  // stack search dropdown and results display vertically
  document.getElementById("genreBox").className = "is-vertical";
}

//filter results based on page number
function handleFilter() {
  value = this.selectedOptions[0].getAttribute("data-value");
  compare = this.selectedOptions[0].getAttribute("data-compare");
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
  displayResults(filterResults);
}

// run selected filter across navigated pages
function handlePersistantFilter() {
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
  displayResults(filterResults);
}

//event listeners
// submit genre
document.querySelector("#genreBtn").addEventListener("click", handleResults);
// filter results
document.querySelector("#filter").addEventListener("change", handleFilter);

// previous and next buttons
document.querySelector("#next").addEventListener("click", pageResults);
document.querySelector("#previous").addEventListener("click", pageResults);
