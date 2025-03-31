let api_key = "api_key=9b702a6b89b0278738dab62417267c49"
let img_url_original = "https://image.tmdb.org/t/p/original"
let img_url = "https://image.tmdb.org/t/p/w500"
let root = document.getElementById('root')
let searchInp= document.querySelector('.search_input')
let pageBtns = document.getElementById('pageBtns')
let categories = document.querySelector('.categories')

function printAllMovieCards(currentPage = 1) {
    
    fetch('https://api.themoviedb.org/3/movie/popular?'+api_key)
      .then(response => response.json())
      .then(response=>printMoviesCards(response.results) )
      .catch(err => console.error(err));
}
printAllMovieCards()


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


// page to page //but it's not ready
fetch('https://dummyjson.com/products')
.then(res=>res.json())
.then(res=>printBtns(res.total))

function printBtns(totalProducts) {
    pageBtns.innerHTML = ''
    let pagesCount = Math.ceil(totalProducts / 30)
    for (let i = 1; i <= pagesCount; i++) {
        let pageBtn = document.createElement('button')
        pageBtn.innerHTML = i
        pageBtn.addEventListener('click',()=>{
            printAllProducts(i)
            document.querySelectorAll('button').forEach(btn => { 
                btn.style.backgroundColor = ''
            })
            pageBtn.style.backgroundColor = 'yellow'
        })
        pageBtns.append(pageBtn)
    }
}

// categories

// fetch('https://dummyjson.com/products/categories')
// .then(res => res.json())
// .then(res=>res.forEach((e)=>{
//     categories.innerHTML+=`<button onclick="getProductsByCategories('${e.url}',this)" >${e.name}</button>`
// })); 

fetch('https://api.themoviedb.org/3/movie/popular?'+api_key)
.then(response => response.json())
.then(response => response.forEach((e)=>{
    categories.innerHTML +=`<button onclick="getProductsByCategories('${e.url}',this)" >${e.name}</button>`
}))
function getProductsByCategories(url,elm){
    fetch(url)
    .then(res=>res.json())
    .then(res=>printCards(res.products))
    elm.classList.add("catBtn")
    elm.style.background= "purple"
   
} 