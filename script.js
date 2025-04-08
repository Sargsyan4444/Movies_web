let api_key = "api_key=9b702a6b89b0278738dab62417267c49"
let img_url_original = "https://image.tmdb.org/t/p/original"
let img_url = "https://image.tmdb.org/t/p/w500"
let root = document.getElementById('root')
let searchInp= document.querySelector('.search_input')
let pageBtns = document.getElementById('pageBtns')
let categories = document.querySelector('.categories__container')
let categoriespart = document.querySelector('.categoriespart')
let allCategories = document.querySelector('.allCategories')
let currentPage = 1; 
let slider = document.getElementById("slider");
var selectedgenre = []


function printAllMovieCards(page = 1) {
    fetch(`https://api.themoviedb.org/3/movie/popular?${api_key}&page=${page}`)   
        .then(response => response.json())
        .then(response => {
            printMoviesCards(response.results);
            printBtns(response.total_pages); 
        })
}
printAllMovieCards();


// print Cards
function printMoviesCards(arr) {
    root.innerHTML = '';
    arr.forEach(movie => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.onclick = () => openMoviePage(movie.id); 
        card.innerHTML = `
            <div class="cardMain">
            <img src="${img_url + movie.poster_path}" class="mainImg" />
            <h2>${movie.title}</h2>
            </div>
            <div class="rating-stars"></div>
        `;
        let ratingContainer = card.querySelector(".rating-stars");
        let stars = createStars(movie.vote_average, 10);

        ratingContainer.append(stars);
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
    window.location.href = `single.html?id=${movieId}`
}


// search
let timerId;
searchInp.addEventListener('input', (e) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
        const query = e.target.value.trim();
        if (query === '') {
            fetch('https://api.themoviedb.org/3/movie/popular?' + api_key)
                .then(response => response.json())
                .then(response => printMoviesCards(response.results))
        } else {
            fetch(`https://api.themoviedb.org/3/search/movie?${api_key}&query=${query}`)
                .then(res => res.json())
                .then(res => {
                    if (res.results.length === 0) {
                        root.innerHTML = "There aren't any results for that search.";
                    } else {
                        printMoviesCards(res.results);
                    }
                })
        }
    }, 1000);
});




// page to page
function printBtns(totalPages) {
    pageBtns.innerHTML = ''
    for (let i = 1; i <= Math.min(totalPages, 20); i++) {
        let pageBtn = document.createElement('button');
        pageBtn.classList.add('pageBtn')
        pageBtn.innerHTML = i;
        if (i === currentPage) {
            pageBtn.style.backgroundColor = 'black'; 
        }
        pageBtn.addEventListener('click',()=>{
            currentPage = i; 
            printAllMovieCards(i);
             highlightPageButton(i);
        })
        pageBtns.append(pageBtn)
    }
}

function highlightPageButton(activePage) {
    document.querySelectorAll('#pageBtns button').forEach((btn)=>{
        btn.style.backgroundColor = '';
                btn.style.color = '';
                if (btn.innerHTML == activePage) {
                    btn.style.backgroundColor = 'black';
                    btn.style.color = 'red';
                }
    })
}



  fetch(`https://api.themoviedb.org/3/genre/movie/list?${api_key}`)
  .then(response => response.json())
  .then(data => {
    categoriespart.innerHTML = `
    <h2>Categories</h2>
    <button class="popularPage">Popular</button>
    `; 
     allCategories.innerHTML = ''
    data.genres.forEach(genre => {
      let btn = document.createElement('button');
      btn.classList.add('btn')
      btn.id = genre.id
      btn.innerText = genre.name;
      btn.addEventListener('click', () => {
        let index = selectedgenre.indexOf(genre.id);
        if (index > -1) {
            selectedgenre.splice(index, 1); 
        } else {
            selectedgenre.push(genre.id);
        }
        getMoviesByCategory(selectedgenre, btn);
    });
    allCategories.append(btn);
    });
    document.querySelector('.popularPage').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
  })
  

// print movies bt their genre
function getMoviesByCategory(genreId, btn) {
    fetch(`https://api.themoviedb.org/3/discover/movie?${api_key}&with_genres=${genreId}`)
      .then(res => res.json())
      .then(data => {
        if (data.results.length === 0) {
            root.innerHTML = "<p>No movies found for this category.</p>";
        } else {
            printMoviesCards(data.results);
        }
        document.querySelectorAll('.btn').forEach((elm)=>{
            if (!selectedgenre.includes(parseInt(elm.id))) {
                elm.classList.remove('active')
            }else{
                elm.classList.add('active')
            }
        })
      })
}
// slider part
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
        slide.addEventListener('click',()=>{
            openMoviePage(movie.id);
        })
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


// actors part

