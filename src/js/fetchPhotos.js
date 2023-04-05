import axios from 'axios';

class Photo {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34983151-308c1e13d6f3ee051936793b8';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 100;
  }

  async fetchPhotos() {
    const response = await axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.searchQuery,
        page: this.page,
        per_page: this.per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });

    return response;
  }

  increasePageCount() {
    this.page += 1;
  }
}

export { Photo };
