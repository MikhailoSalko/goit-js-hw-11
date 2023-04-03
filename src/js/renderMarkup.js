function renderMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a href="${largeImageURL}" class='gallery-link'>
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class='gallery-img'/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
      
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>
</a>`
    )
    .join('');

  return markup;
}

export { renderMarkup };
