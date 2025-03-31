let api_key = "api_key=9b702a6b89b0278738dab62417267c49"
let img_url_original = "https://image.tmdb.org/t/p/original"
let img_url = "https://image.tmdb.org/t/p/w500"


  fetch('https://api.themoviedb.org/3/movie/popular?'+api_key)
    .then(response => response.json())
    .then(response => printProducts(response.results))
    .catch(err => console.error(err));