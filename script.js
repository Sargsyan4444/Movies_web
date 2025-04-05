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
let searchImg = document.querySelector('.searchImg')
let logo = document.querySelector('.logo')
let closebtn = document.querySelector('.closebtn')
var selectedgenre = []

searchImg.addEventListener('click',()=>{
    searchImg.style.display="none"
    searchInp.style.display="flex"
    logo.style.display="none"
})

closebtn.addEventListener('click',()=>{
    searchImg.style.display="block"
    searchInp.style.display="none"
    logo.style.display="block"
})


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
            <img src="${img_url + movie.poster_path}" />
            <h2>${movie.title}</h2>
        `;
        root.append(card);
    });
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


// for movies genres
// fetch(`https://api.themoviedb.org/3/genre/movie/list?${api_key}`)
//   .then(response => response.json())
//   .then(data => {
//     categoriespart.innerHTML = `
//     <h2>Categories</h2>
//     <button class="popularPage">Popular</button>
//     `; 
//      allCategories.innerHTML = ''
//     data.genres.forEach(genre => {
//       let btn = document.createElement('button');
//       btn.classList.add('btn')
//       btn.id = genre.id
//       btn.innerText = genre.name;
//     btn.addEventListener('click',()=>{
//         if (selectedgenre.length == 0) {
//             selectedgenre.push(genre.id)
//         }else{
//             if (selectedgenre.includes(genre.id)) {
//                 selectedgenre.forEach((id,index)=>{
//                     if (id === genre.id) {
//                         selectedgenre.splice(index,1)
//                     }
//                 })
//             }else{
//                 selectedgenre.push(genre.id)
//             }
//         }
        
//     })
//     allCategories.append(btn);
//     });
//   })
  




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
      btn.onclick = () => getMoviesByCategory(genre.id, btn);
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
      })

    document.querySelectorAll('.categories button').forEach(button => {
        button.style.backgroundColor = '';
        button.style.color = '';
    });
    btn.style.backgroundColor = 'white';
    btn.style.color = 'red';
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
let actorsContainer = document.querySelector('.actors__container');

function fetchActors() {
    fetch(`https://api.themoviedb.org/3/person/popular?${api_key}`)
        .then(res => res.json())
        .then(data => {
            createActorsSlider(data.results);
        })
}

function createActorsSlider(actors) {
    actorsContainer.innerHTML = `
     <h2>Actors</h2>
        <div class="actors-slider-wrapper">
            <div class="actors-slider">
                ${actors.slice(0, 10).map(actor => `
                    <div class="actor-slide">
                        <img src="${img_url + actor.profile_path}" alt="">
                        <p>${actor.name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    let slider = document.querySelector('.actors-slider');
    let slides = document.querySelectorAll('.actor-slide');

    slides.forEach(slide => {
        let clone = slide.cloneNode(true);
        slider.appendChild(clone);
    });

    startActorSlider();
}

let actorIndex = 0;
function startActorSlider() {
    let slider = document.querySelector('.actors-slider');
    let slideWidth = document.querySelector('.actor-slide').offsetWidth + 15; 
    setInterval(() => {
        actorIndex++;
        slider.style.transition = "transform 0.5s ease-in-out";
        slider.style.transform = `translateX(-${actorIndex * slideWidth}px)`;
        setTimeout(() => {
            if (actorIndex >= 10) {
                actorIndex = 0;
                slider.style.transition = "none";
                slider.style.transform = `translateX(0)`;
            }
        }, 500);
    }, 3000); 
}

fetchActors();



// videos slider
