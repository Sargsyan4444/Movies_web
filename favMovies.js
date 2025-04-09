let root = document.getElementById("root");
let api_key = "api_key=9b702a6b89b0278738dab62417267c49";
let img_url = "https://image.tmdb.org/t/p/w500";

let favMovieIds = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

if (favMovieIds.length === 0) {
    root.innerHTML = "<h2>You don't have favorite movies</h2>";
} else {
    favMovieIds.forEach(id => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?${api_key}`)
            .then(res => res.json())
            .then(movie => {
                let card = document.createElement("div");
                card.classList.add("card");
                card.onclick = () => {
                    window.location.href = `single.html?id=${movie.id}`;
                };
                card.innerHTML = `
                    <div class="cardMain">
                        <img src="${img_url + movie.poster_path}" class="mainImg" />
                        <h2>${movie.title}</h2>
                    </div>
                `;
                root.appendChild(card);
            });
    });
}
