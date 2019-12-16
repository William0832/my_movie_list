(function() {
  const BASE_URL = 'https://movie-list.alphacamp.io/';
  const INDEX_URL = BASE_URL + 'api/v1/movies/';
  const POSTER_URL = BASE_URL + 'posters/';
  const data = [];
  const dataPannel = document.getElementById('data-panel');
  const searchForm = document.getElementById('search');
  const searchInput = document.getElementById('search-input');
  const pagination = document.getElementById('pagination');
  const ITEM_PER_PAGER = 12;
  let paginationData = [];

  //   new variable
  const displayOption = document.getElementById('displayOption');
  let displayType = 'card';
  let page = 1;

  //get API data and initial render
  axios
    .get(INDEX_URL)
    .then(response => {
      data.push(...response.data.results);
      //add pagination
      getTotalPages(data);
      getPageData(page, data);
    })
    .catch(error => console.log(error));

  // listen to displayOption
  displayOption.addEventListener('click', event => {
    if (event.target.tagName === 'I') {
      displayType = event.target.id;
      // console.log(page)
      getPageData(page, paginationData);
    }
  });

  //listen to data panel
  dataPannel.addEventListener('click', event => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id);
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id);
    }
  });

  //listen to search form submit event
  searchForm.addEventListener('submit', event => {
    event.preventDefault(); // 防止submit刷新頁面
    let input = searchInput.value.toLowerCase();
    let results = [];
    // const regex = new RegExp(serchInput.value, 'i'); //?
    results = data.filter(movie => movie.title.toLowerCase().includes(input));
    page = 1;
    getTotalPages(results);
    getPageData(page, results);
  });

  //listen to pagination click event
  pagination.addEventListener('click', event => {
    // console.log('page:', event.target.dataset.page);
    if (event.target.tagName === 'A') {
      page = event.target.dataset.page;
      getPageData(page);
    }
  });

  function displayDataList(data) {
    let htmlContent = '';
    if (displayType === 'card') {
      data.forEach(item => {
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " 
                 src="${POSTER_URL}${item.image}" 
                 alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>
            
            <!-- "more button " -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `;
      });
    } else if (displayType === 'list') {
      htmlContent = '<table class="table"><tbody>';
      data.forEach(item => {
        htmlContent += `
          <tr>
            <td clas="col-6">${item.title}</td>
            <td clas="col-6 text-right ">
              <button class="btn btn-primary btn-show-movie" 
                      data-toggle="modal" 
                      data-target="#show-movie-modal" 
                      data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" 
                      data-id="${item.id}">+</button>
            </td>
          </tr> 
        `;
      });
      htmlContent += '</tbody></table>';
    }
    dataPannel.innerHTML = htmlContent;
  }
  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title');
    const modalImage = document.getElementById('show-movie-image');
    const modalDate = document.getElementById('show-movie-date');
    const modalDescription = document.getElementById('show-movie-description');
    //set request url
    const url = INDEX_URL + id;
    //send request to show api
    axios
      .get(url)
      .then(response => {
        const data = response.data.results;
        // insert data into modal ui
        modalTitle.textContent = data.title;
        modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class ="img-fluid" alt="Responsive image">`;
        modalDate.textContent = `release at : ${data.release_date}`;
        modalDescription.textContent = `${data.description}`;
      })
      .catch(error => {
        console.log(error);
      });
  }
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const movie = data.find(item => item.id === Number(id));
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`);
    } else {
      list.push(movie);
      alert(`added ${movie.title} to your favorite list!`);
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list));
  }
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGER) || 1;
    let pageItemContent = '';
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i +
        1}</a>
        </li>
      `;
    }
    pagination.innerHTML = pageItemContent;
  }
  function getPageData(page, data) {
    paginationData = data || paginationData;
    let offset = (page - 1) * ITEM_PER_PAGER;
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGER);
    displayDataList(pageData);
  }
})();
