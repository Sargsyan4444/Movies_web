let api_key = "api_key=9b702a6b89b0278738dab62417267c49"
let img_url_original = "https://image.tmdb.org/t/p/original"
let img_url = "https://image.tmdb.org/t/p/w500"
let root = document.getElementById('root')
let searchInp= document.querySelector('.search_input')
let pageBtns = document.getElementById('pageBtns')
let categories = document.querySelector('.categories')
let currentPage = 1; 


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
        root.innerHTML = ''
        arr.forEach(movie => {
            let card = document.createElement('div')
            card.classList.add('card')
            card.innerHTML=`
                 <img src=${img_url+movie.poster_path} />
                 <h2>${movie.title}</h2>
            `
            root.append(card)
        });
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


// Էջերի կոճակներ ստեղծելու ֆունկցիա
function printBtns(totalPages) {
    pageBtns.innerHTML = ''; 
    for (let i = 1; i <= Math.min(totalPages, 20); i++) { // Ցույց ենք տալիս 10 էջ առավելագույնը
        let pageBtn = document.createElement('button');
        pageBtn.innerHTML = i;
        if (i === currentPage) {
            pageBtn.style.backgroundColor = 'yellow'; // Ընթացիկ էջը նշում ենք
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i; // Թարմացնում ենք ընթացիկ էջը
            printAllMovieCards(i);
            highlightPageButton(i);
        });
        pageBtns.append(pageBtn);
    }
}

// Ակտիվ էջի կոճակը գունավորելու ֆունկցիա
function highlightPageButton(activePage) {
    document.querySelectorAll('#pageBtns button').forEach(btn => {
        btn.style.backgroundColor = '';
        if (btn.innerHTML == activePage) {
            btn.style.backgroundColor = 'yellow';
        }
    });
}

// take the generes
fetch(`https://api.themoviedb.org/3/genre/movie/list?${api_key}`)
  .then(response => response.json())
  .then(data => {
    categories.innerHTML = ''; 
    data.genres.forEach(genre => {
      let btn = document.createElement('button');
      btn.innerText = genre.name;
      btn.onclick = () => getMoviesByCategory(genre.id, btn);
      categories.append(btn);
    });
  })

//print movies bt their genre
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

    // Սեղմած կոճակը նշում ենք որպես ակտիվ
    document.querySelectorAll('.categories button').forEach(button => {
        button.style.backgroundColor = '';
    });
    btn.style.backgroundColor = 'red';
}

