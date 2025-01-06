
const API_KEY = '44000056582142fea0a363f78c89cd23';
const BASE_URL = 'https://newsapi.org/v2';


const categorySelect = document.querySelector('.category');
const countrySelect = document.querySelector('.country');
const searchInput = document.querySelector('input[type="text"]');
const searchButton = document.querySelector('.button');
const newsDiv = document.querySelector('.NewsDiv');


async function fetchNews(endpoint, params = {}) {
    try {
    
        params.apiKey = API_KEY;
        
        
        const queryString = new URLSearchParams(params).toString();
        const url = `${BASE_URL}/${endpoint}?${queryString}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching news:', error);
        return null;
    }
}

function renderNews(articles, container) {
    if (!articles || !container) return;

    const newsHTML = articles.map(article => `
        <div class="news-card p-4 m-2 border rounded shadow-sm hover:shadow-md transition-shadow">
            <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}" 
                 class="w-full h-48 object-cover mb-2 rounded">
            <h3 class="font-bold text-xl mb-2">${article.title}</h3>
            <p class="text-gray-600 mb-2">${article.description || ''}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">${new Date(article.publishedAt).toLocaleDateString()}</span>
                <a href="${article.url}" target="_blank" 
                   class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Read More
                </a>
            </div>
        </div>
    `).join('');
        console.log(newsHTML)
        console.log("-----------------------------------------------")
        console.log(articles)
        console.log("-----------------------------------------------")
        console.log(container)
    newsDiv.innerHTML = newsHTML;
}


async function loadInitialNews() {
    try {

        const worldNews = await fetchNews('top-headlines', {
            country:'us',
            pageSize: 8,
            language: 'en'
        });
        renderNews(worldNews?.articles, newsDiv);
    } catch (error) {
        console.error('Error loading initial news:', error);
    }
}


categorySelect?.addEventListener('change', async (e) => {
    const category = e.target.value;
    if (category === 'All') return;

    try {
        const categoryNews = await fetchNews('everything', {
            q: category.toLowerCase(),
            pageSize: 10,
            language: 'en'
        });
        console.log(categoryNews)
        renderNews(categoryNews.articles, newsDiv);
    } catch (error) {
        console.error('Error loading category news:', error);
    }
});


countrySelect?.addEventListener('change', async (e) => {
    const country = e.target.value;
    if (country === 'All') return;

    try {
        const countryNews = await fetchNews('everything', {
            country: country.toLowerCase(),
            pageSize: 10
        });
        renderNews(countryNews?.articles, newsDiv);
    } catch (error) {
        console.error('Error loading country news:', error);
    }
});


let searchTimeout;
searchButton?.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) return;

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        try {
            const searchResults = await fetchNews('everything', {
                q: searchTerm,
                pageSize: 10,
                language: 'en',
                sortBy: 'relevancy'
            });
            renderNews(searchResults?.articles, newsDiv);
        } catch (error) {
            console.error('Error searching news:', error);
        }
    }, 300);
});


const menuButton = document.querySelector('.menu');
const navigation = document.querySelector('.navigation');

menuButton?.addEventListener('click', () => {
    navigation.classList.toggle('hidden');
});


document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'images.jpeg';
    }
}, true);


document.addEventListener('DOMContentLoaded', loadInitialNews);
