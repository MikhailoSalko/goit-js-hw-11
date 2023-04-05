import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Photo } from './js/fetchPhotos';
import { renderMarkup } from './js/renderMarkup';
import InfiniteAjaxScroll from '@webcreate/infinite-ajax-scroll';

const form = document.querySelector('.search-form');
// const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const fetchPhoto = new Photo();
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});
let totalPages = 0;

form.addEventListener('submit', handleSubmitFetchPhotos);
// loadMoreBtn.addEventListener('click', handleLoadMoreBtnFetchPhotos);

async function handleSubmitFetchPhotos(e) {
  e.preventDefault();

  fetchPhoto.searchQuery = e.currentTarget.searchQuery.value.trim();

  if (fetchPhoto.searchQuery === '') {
    return;
  }
  // loadMoreBtn.classList.add('is-hidden');
  gallery.innerHTML = '';
  fetchPhoto.page = 1;
  try {
    const photo = await fetchPhoto.fetchPhotos();
    if (photo.data.totalHits === 0) {
      Notify.failure(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
      return;
    }

    Notify.success(`Hooray! We found ${photo.data.totalHits} images.`);
    renderGallery(photo.data.hits);
    fetchPhoto.increasePageCount();

    const infiniteScroll = new InfiniteAjaxScroll('.gallery', {
      item: '.gallery-link',
      next: '.next',
      pagination: '.pagination',
    });
    infiniteScroll.on('load', handleLoadMoreBtnFetchPhotos);
    infiniteScroll.on('last', handleLoadMoreBtnFetchPhotos);

    // loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    console.log(error.message);
  }
}

async function handleLoadMoreBtnFetchPhotos() {
  const photo = await fetchPhoto.fetchPhotos();
  renderGallery(photo.data.hits);
  fetchPhoto.increasePageCount();
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 1.5,
    behavior: 'smooth',
  });
  totalPages = photo.data.totalHits / fetchPhoto.per_page;

  if (totalPages < fetchPhoto.page) {
    Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    // infiniteScroll.unbind();
    // loadMoreBtn.classList.add('is-hidden');
  }
}

function renderGallery(arr) {
  gallery.insertAdjacentHTML('beforeend', renderMarkup(arr));
  lightbox.refresh();
}
