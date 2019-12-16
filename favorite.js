(function() {
  const BASE_URL = 'https://movie-list.alphacamp.io';
  const POSTER_URL = BASE_URL + '/posters/';
  const dataPanel = document.getElementById('data-panel');
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
  const pagination = document.getElementById('pagination');
  const ITEM_PER_PAGER = 12;
  let paginationData = [];

  // initial render
  getTotalPages(data);
  getPageData(1, data);

  // listen to dele or more
  dataPanel.addEventListener('click', event => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id);
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id);
    }
  });
  // listen to pagination
  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page);
    }
  });

  function displayDataList(data) {
    let htmlContent = '';
    data.forEach(function(item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `;
    });
    dataPanel.innerHTML = htmlContent;
  }
  function removeFavoriteItem(id) {
    // find movie by id
    const index = data.findIndex(item => item.id === Number(id));
    if (index === -1) return;

    // removie movie and update localStorage
    console.log(id);
    data.splice(index, 1);
    localStorage.setItem('favoriteMovies', JSON.stringify(data));

    // repaint dataList
    displayDataList(data);
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
  function getPageData(pageNum, data) {
    paginationData = data || paginationData;
    let offset = (pageNum - 1) * ITEM_PER_PAGER;
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGER);
    displayDataList(pageData);
  }
})();
