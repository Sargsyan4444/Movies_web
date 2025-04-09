let api_key = "api_key=9b702a6b89b0278738dab62417267c49";
let img_url_original = "https://image.tmdb.org/t/p/original";
let img_url = "https://image.tmdb.org/t/p/w500";
let root = document.getElementById('root');
let searchInp = document.querySelector('.search_input');
let pageBtns = document.getElementById('pageBtns');
let currentPage = 1;
let slider = document.getElementById("slider");

function printAllMovieCards(page = 1) {
    fetch(`https://api.themoviedb.org/3/movie/popular?${api_key}&page=${page}`)
        .then(response => response.json())
        .then(response => {
            printMoviesCards(response.results);
            printBtns(response.total_pages);
        });
}
printAllMovieCards();

// Print movie cards
function printMoviesCards(arr) {
    root.innerHTML = '';
    let favs = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    arr.forEach(movie => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.onclick = () => openMoviePage(movie.id);
        card.innerHTML = `
            <div class="cardMain">
                <i class="fa-solid fa-heart heart-icon"></i>
                <img src="${img_url + movie.poster_path}" class="mainImg" />
                <h2>${movie.title}</h2>
            </div>
            <div class="rating-stars"></div>
        `;

        // Star rating
        let ratingContainer = card.querySelector(".rating-stars");
        let stars = createStars(movie.vote_average, 10);
        ratingContainer.append(stars);

        // Heart logic
        let heart = card.querySelector('.heart-icon');
        if (favs.includes(movie.id)) {
            heart.style.color = "red";
        }
        heart.addEventListener('click', (event) => {
            event.stopPropagation();
            let favs = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

            if (favs.includes(movie.id)) {
                favs = favs.filter(id => id !== movie.id);
                heart.style.color = "";
            } else {
                favs.push(movie.id);
                heart.style.color = "red";
            }
            localStorage.setItem("favoriteMovies", JSON.stringify(favs));
        });

        root.append(card);
    });
}

function createStars(rating, maxStars = 10) {
    const starContainer = document.createElement("div");
    starContainer.classList.add("stars");
    let fullStars = Math.round(rating / 2);
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.innerHTML = i <= fullStars ? "★" : "☆";
        star.style.color = "gold";
        star.style.fontSize = "20px";
        starContainer.appendChild(star);
    }
    return starContainer;
}

function openMoviePage(movieId) {
    window.location.href = `single.html?id=${movieId}`;
}

// Search
let timerId;
searchInp.addEventListener('input', (e) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
        const query = e.target.value.trim();
        if (query === '') {
            fetch(`https://api.themoviedb.org/3/movie/popular?${api_key}`)
                .then(response => response.json())
                .then(response => printMoviesCards(response.results));
        } else {
            fetch(`https://api.themoviedb.org/3/search/movie?${api_key}&query=${query}`)
                .then(res => res.json())
                .then(res => {
                    if (res.results.length === 0) {
                        root.innerHTML = "There aren't any results for that search.";
                    } else {
                        printMoviesCards(res.results);
                    }
                });
        }
    }, 1000);
});

// Page buttons
function printBtns(totalPages) {
    pageBtns.innerHTML = '';
    for (let i = 1; i <= Math.min(totalPages, 20); i++) {
        let pageBtn = document.createElement('button');
        pageBtn.classList.add('pageBtn');
        pageBtn.innerHTML = i;
        if (i === currentPage) {
            pageBtn.style.backgroundColor = 'black';
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            printAllMovieCards(i);
            highlightPageButton(i);
        });
        pageBtns.append(pageBtn);
    }
}

function highlightPageButton(activePage) {
    document.querySelectorAll('#pageBtns button').forEach((btn) => {
        btn.style.backgroundColor = '';
        btn.style.color = '';
        if (btn.innerHTML == activePage) {
            btn.style.backgroundColor = 'black';
            btn.style.color = 'red';
        }
    });
}

// Slider part
function loadRandomMovies() {
    fetch(`https://api.themoviedb.org/3/movie/popular?${api_key}`)
        .then(res => res.json())
        .then(data => {
            let randomMovies = data.results.sort(() => 0.5 - Math.random()).slice(0, 5);
            createSlider(randomMovies);
        })
        .catch(err => console.error(err));
}

function createSlider(movies) {
    slider.innerHTML = "";
    movies.forEach(movie => {
        let slide = document.createElement("div");
        slide.classList.add("slide");
        slide.style.backgroundImage = `url(${img_url_original + movie.backdrop_path})`;
        slide.innerHTML = `
            <div class="slide-info">
                <h2>${movie.title}</h2>
                <p>${movie.overview.substring(0, 100)}...</p>
            </div>
        `;
        slide.addEventListener('click', () => {
            openMoviePage(movie.id);
        });
        slider.appendChild(slide);
    });
    startSlideAnimation();
}

let currentIndex = 0;
function startSlideAnimation() {
    setInterval(() => {
        currentIndex = (currentIndex + 1) % 5;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }, 4000);
}

loadRandomMovies();
