import { API_KEY } from '.';
import { perPage } from '.';
import axios from 'axios';

export const getImages = async (value, page) => {
  try {
    const data = await axios(
      `https://pixabay.com/api/?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    const imgObject = await data.data.hits.length;
    if ((await imgObject) === 0) return error;
    return data;
  } catch (error) {
    throw new Error(data);
  }
};
