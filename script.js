const API_KEY = "396e069f07514c9b9f50576868b89c63";
const url = "https://newsapi.org/v2/everything?q="

// feching the news in the begining
// addEventListener(type: "load", listener: (this: Window, ev: Event) )
window.addEventListener('load', ()=> fetchNews("India"));

//reloading the site when news logo is selected
function reload() {
    window.location.reload();
}


//  creating the asynchronous function fetchNews
//  so this is the type of query the api has 
// https://newsapi.org/v2/everything?q=tesla 
// &from=2023-07-14
// &sortBy=publishedAt & 
// apiKey=396e069f07514c9b9f50576868b89c63

async function fetchNews(query){
    //  we need to create a string matching the format of the api query
    // this fetch function will not directly return the news but its a promise to await upon
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    // now converting the data int he json format to use
    const data = await res.json(); // this also return a promise so await 
    bindData(data.articles);
}

// for adding data we will make clone of template present in html and add it to the mainfunction in html
// to get html we need ids
function bindData(articles){
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    // making the innerhtml as null cause each time bindData is called 
    // it will keep on calling 100 news card it will pile up on each other
    cardsContainer.innerHTML = "";

    articles.forEach(article => {
        // those news cards that dont have any image with them , dont show them to make a better looking ui
        if(!article.urlToImage) return;
        // cloning all the elemts in the div of news card template ie making a deep copy 
        const cardClone = newsCardTemplate.content.cloneNode(true);
        // adding news data to the card
        fillDataInCard(cardClone, article);
        // now putting the clone in the card container
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article){
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    // adding specifics values of data to the cards
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    // the date time if the api is in ez fromat so convert it in normal form
    const date = new Date(article.publishedAt).toLocaleDateString("en-US",{
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // if user click the news article it must open the original news article at its original url locatin 
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "blank"); // open article in new window so blank
    });
}


let curSelectedNav = null; // to show which nav link is currently selected
// making the on click function for the nav links 
function onNavItemClick(id) {
    fetchNews(id); // it fetch the news and bind the data
    // handling the active class
    const navItem = document.getElementById(id);
    // if it is null then remove it 
    curSelectedNav?.classList.remove('active');
    // change the curr 
    curSelectedNav = navItem;
    // add new one in class list
    curSelectedNav.classList.add('active');
}

// input box and search button 
const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

// now whenever the button is clicked 
searchButton.addEventListener('click', () =>{
    const query = searchText.value;
    // if user clicked the button without entering any input 
    if(!query) return;
    fetchNews(query);
    // it will happen that user has searched the type of news from the input button 
    // but the active class from the nav link is also showing active so have to make it inactive
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
});
