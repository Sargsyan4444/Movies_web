let movieInfo = document.querySelector('.movieInfo');
let movieId = location.href.split('=')[1];
let bgcImage = document.getElementById('movie__container');
let smallImg = document.getElementById('smallImg');
let actorsList = document.getElementById('actorsList');
let movieBox = document.getElementById('movieBox')
let popupBody = document.querySelector(".video-popup");

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
        <div class="mainInfo">
        <h1>${res.title}</h1>
        <p>${res.overview}</p>
        </div>
        <div class="littleInfo">
        <h2>Genre: ${genres}</h2>
        <h2>Language: ${res.original_language}</h2>
        <h3>${res.status}</h3>
        <h2>Release Date: ${res.release_date}</h2>
        </div>
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


    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?${api_key}`)
    .then(res => res.json())
    .then(res => {
      if (res.results.length === 0) {
        movieBox.innerHTML = `<p style="color: #E50000; font-weight: bold; font-size: 18px;">No trailers found</p>`;
      } else {
        res.results.forEach((e) => {
          let videoBox = document.createElement('div');
          videoBox.classList.add('videoBox');
          videoBox.innerHTML = `
          <div class="vd_card">
          <iframe width="400" height="400" src="https://www.youtube.com/embed/${e.key} class="videoCard"
          title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;
          encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen onclick="openPopup('${e.key}')"></iframe>
           <button onclick="openPopup('${e.key}')" class="openPopupBtn">Watch Trailer</button>
          </div>
          `;
          movieBox.append(videoBox);
        });
      }
    });

    



    function openPopup(videoKey) {
      popupBody.style.display = "flex";
      popupBody.innerHTML = `
          <div class="popup-main">
              <div class="popup-header">
                  <button onclick="closePopup()">X</button>
              </div>
              <div class="popup-info">
                  <iframe width="100%" height="500" src="https://www.youtube.com/embed/${videoKey}" 
                  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;
                  encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              </div>
          </div>
      `;
  }
  
  function closePopup() {
      popupBody.innerHTML = "";
      popupBody.style.display = "none";
  }