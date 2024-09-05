const API_KEY = "de19526806414c23a3d100f59e2f1b95";//1d3a0eefa97b499d8fbc4ee93eeb40b7
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));
//reload the page
function reload() {
    window.location.reload();
}

async function fetchNews(query) {
  try {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (!data || !data.articles) {
      throw new Error('Invalid API response data');
    }
    bindData(data.articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    displayErrorMessage('Failed to fetch news. Please try again later.');
  }
}

function bindData(articles) {
  try {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    if (!cardsContainer || !newsCardTemplate) {
      throw new Error('Invalid HTML structure');
    }

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
      if (!article.urlToImage) return;
      const cardClone = newsCardTemplate.content.cloneNode(true);
      fillDataInCard(cardClone, article);
      cardsContainer.appendChild(cardClone);
    });
  } catch (error) {
    console.error('Error binding data:', error);
    displayErrorMessage('Failed to display news. Please try again later.');
  }
}
function fillDataInCard(cardClone, article) {
  try {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    if (!newsImg || !newsTitle || !newsSource || !newsDesc) {
      throw new Error('Invalid HTML structure');
    }

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
  } catch (error) {
    console.error('Error filling data in card:', error);
    displayErrorMessage('Failed to display news. Please try again later.');
  }
}
//error-handling
function displayErrorMessage(message) {
  const errorMessageElement = document.getElementById('error-message');
  if (errorMessageElement) {
    errorMessageElement.innerHTML = message;
    errorMessageElement.style.display = 'block';
  } else {
    console.error('Error message element not found');
  }
}

let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
//added enter key in event
searchText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
  }
});