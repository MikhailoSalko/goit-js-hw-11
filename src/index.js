import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Photo } from './js/fetchPhotos';
import { renderMarkup } from './js/renderMarkup';
// import InfiniteAjaxScroll from '@webcreate/infinite-ajax-scroll';

// const loadMoreBtn = document.querySelector('.load-more');
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const fetchPhoto = new Photo();
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});
let lastImage = null;
let totalPages = 0;
const infiniteScrollObserver = new IntersectionObserver(
  ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      handleFetchForInfiniteScrollObserver();
    }
  },
  {
    threshold: 0.1,
  }
);
// const infiniteScroll = new InfiniteAjaxScroll('.gallery', {
//   item: '.gallery-link',
//   next: '.next',
//   pagination: '.pagination',
//   bind: false,
// });

form.addEventListener('submit', handleSubmitFetchPhotos);
// infiniteScroll.on('loaded', handleLoadMoreBtnFetchPhotos);
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
    lastImage = document.querySelector('.gallery-link:last-child');
    if (lastImage) {
      infiniteScrollObserver.observe(lastImage);
    }

    // infiniteScroll.bind();
    // loadMoreBtn.classList.remove('is-hidden');
    return lastImage;
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
  totalPages = photo.data.totalHits / fetchPhoto.perPage;
  if (totalPages < fetchPhoto.page) {
    // infiniteScroll.unbind();
    Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    // loadMoreBtn.classList.add('is-hidden');
  }
}

async function handleFetchForInfiniteScrollObserver() {
  const photo = await fetchPhoto.fetchPhotos();
  renderGallery(photo.data.hits);
  fetchPhoto.increasePageCount();
  lastImage = document.querySelector('.gallery-link:last-child');
  if (lastImage) {
    infiniteScrollObserver.observe(lastImage);
  }
  totalPages = photo.data.totalHits / fetchPhoto.perPage;
  if (totalPages < fetchPhoto.page) {
    infiniteScrollObserver.unobserve(lastImage);
    setTimeout(() => {
      Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }, 1000);
  }
}

function renderGallery(arr) {
  gallery.insertAdjacentHTML('beforeend', renderMarkup(arr));
  lightbox.refresh();
}
