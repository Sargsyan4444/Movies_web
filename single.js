let movieInfo = document.querySelector('.movieInfo');
let movieId = location.href.split('=')[1];
let bgcImage = document.getElementById('movie__container');
let smallImg = document.getElementById('smallImg');
let actorsList = document.getElementById('actorsList');
let movieBox = document.getElementById('movieBox')

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
        <div class="littleInfo">
        <h2>Genre: ${genres}</h2>
        <h2>Language: ${res.original_language}</h2>
        <h3>${res.status}</h3>
        <h2>Release Date: ${res.release_date}</h2>
        </div>
            <p>${res.overview}</p>
        `;
    })



     fetch(`https:api.themoviedb.org/3/movie/${movieId}/credits?${api_key}`)
    .then(res => res.json())
    .then(res=>res.cast.forEach(actor => {
        actorsList.innerHTML+=`
        <div class="actor_card">
            <img src=${img_url+actor.profile_path} />
            <h3>${actor.name}</h3>
        </div>
        `
    }))


    // fetch(`https:api.themoviedb.org/3/movie/${movieId}/videos?${api_key}`)
    // .then(res=>res.json())
    // .then(res => res.results.forEach((e)=>{
    //     let videoBox = document.createElement('div')
    //     videoBox.classList.add('videoBox')
    //     videoBox.innerHTML=`
    //         <iframe width="400" height="400" src="https://www.youtube.com/embed/${e.key}"
    //          title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
    //         gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    //     `
    //     movieBox.append(videoBox)
    // }))