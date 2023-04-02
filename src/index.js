import axios from 'axios';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhotos } from './js/fetchPhotos';

const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', handleSubmitFetchPhotos);
loadMoreBtn.addEventListener('click', handleLoadMoreBtnFetchPhotos);

async function handleSubmitFetchPhotos(e) {
  e.preventDefault();
  console.log(e.target);
  const photos = await fetchPhotos();
  console.log(photos);
}

async function handleLoadMoreBtnFetchPhotos(e) {
  console.log(e.target.type);
  fetchPhotos();
}
