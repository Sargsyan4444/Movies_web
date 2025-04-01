let movieInfo = document.querySelector('.movieInfo');
let movieId = location.href.split('=')[1];
let bgcImage = document.getElementById('movie__container');
let smallImg = document.getElementById('smallImg');

let api_key = "api_key=9b702a6b89b0278738dab62417267c49";
let img_url_original = "https://image.tmdb.org/t/p/original";
let img_url = "https://image.tmdb.org/t/p/w500";

fetch(`https://api.themoviedb.org/3/movie/${movieId}?${api_key}`)
    .then(res => res.json())  
    .then(res => {
        bgcImage.style.backgroundImage = `url(${img_url_original + res.backdrop_path})`;
        smallImg.src = img_url + res.poster_path;
        let genres = res.genres.map(genre => genre.name).join(', ');

        movieInfo.innerHTML = `
            <h1>${res.title}</h1>
            <h2>Genre: ${genres}</h2>
            <h2>Language: ${res.original_language}</h2>
            <p>${res.overview}</p>
            <h3>${res.status}</h3>
            <h2>Release Date: ${res.release_date}</h2>
        `;
    })
    .catch(error => console.error("Error fetching movie data:", error));

function goBack() {
    window.history.back();
}
