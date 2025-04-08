var selectedgenre = []
let categories = document.querySelector('.categories__container')
let categoriespart = document.querySelector('.categoriespart')
let allCategories = document.querySelector('.allCategories')

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