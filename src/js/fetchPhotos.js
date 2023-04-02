import axios from 'axios';

async function fetchPhotos() {
  const responce = await axios.get('https://pixabay.com/api/docs/');
  const result = await responce.json();
  console.log(result);
  return result;
}

export { fetchPhotos };
