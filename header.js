let searchImg = document.querySelector('.searchImg');
let logo = document.querySelector('.logo');
let closebtn = document.querySelector('.closebtn');
let burgerMenu = document.getElementById('burgermenu');
let mobileMenu = document.querySelector('.mobileMenu');
let closeMenuBtn = document.querySelector('.closeMenuBtn');

if (searchImg && searchInp && closebtn && logo && burgerMenu) {
    searchImg.addEventListener('click', () => {
        searchImg.style.display = "none";
        searchInp.style.display = "flex";
        logo.style.display = "none";
        burgerMenu.style.display = "none";
    });

    closebtn.addEventListener('click', () => {
        searchImg.style.display = "block";
        searchInp.style.display = "none";
        logo.style.display = "block";
        burgerMenu.style.display = "block";
    });
}

if (burgerMenu && mobileMenu && closeMenuBtn && searchImg && logo) {
    burgerMenu.addEventListener('click', () => {
        searchImg.style.display = "none";
        logo.style.display = "none";
        mobileMenu.style.display = "flex";
        burgerMenu.style.display = "none";
    });

    closeMenuBtn.addEventListener('click', () => {
        searchImg.style.display = "block";
        logo.style.display = "block";
        mobileMenu.style.display = "none";
        burgerMenu.style.display = "block";
    });
}
