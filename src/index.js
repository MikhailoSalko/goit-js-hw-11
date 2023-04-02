// import axios from 'axios';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Photo } from './js/fetchPhotos';
import { renderPhotos } from './js/renderMarkup';

const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', handleSubmitFetchPhotos);
loadMoreBtn.addEventListener('click', fetchAndRenderMarkupOfGallery);

const fetchPhoto = new Photo();

async function handleSubmitFetchPhotos(e) {
  e.preventDefault();

  fetchPhoto.searchQuery = e.currentTarget.searchQuery.value.trim();
  if (fetchPhoto.searchQuery === '') {
    return;
  }
  try {
    gallery.innerHTML = '';
    fetchPhoto.page = 1;
    fetchAndRenderMarkupOfGallery();
  } catch (error) {
    console.log(error.message);
  }
}

async function fetchAndRenderMarkupOfGallery() {
  const result = await fetchPhoto.fetchPhotos();
  const arrayOfPhotos = result.data.hits;
  getGallery(arrayOfPhotos);
  fetchPhoto.pageCount();
}

function getGallery(arr) {
  gallery.insertAdjacentHTML('beforeend', renderPhotos(arr));
  let lightbox = new SimpleLightbox('.gallery a');
}
