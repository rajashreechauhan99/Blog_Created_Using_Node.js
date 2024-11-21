document.addEventListener('DOMContentLoaded',function(){

    const allButtons = document.querySelectorAll('.searchbtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');


    for(var i = 0 ;i< allButtons.length ; i++){

        allButtons[i].addEventListener('click',function(){
            searchBar.style.visibilty = 'visible';
            searchBar.classList.add('open');
            // The Element.classList is a read-only property that returns a live DOMTokenList collection of the class attributes of the element. This can then be used to manipulate the class list.
            this.setAttribute('aria-expanded','true');
            searchInput.focus();
        });
    }

    searchClose.addEventListener('click',function(){
        searchBar.style.visibilty = 'hidden';
        searchBar.classList.remove('open')
        this.setAttribute('aria-expanded','false');
    });


})