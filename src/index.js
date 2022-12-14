import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './getImages';
import { renderCardItems } from './markup';

export const API_KEY = '31904814-f4bcbbfe75d97904192d1a917';
export const perPage = 40;
let page = 1;
// ;;;
const refs = {
  form: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  inputEl: document.querySelector('input'),
};

refs.loadMoreBtn.classList.add('is-hidden');

const gallery = new SimpleLightbox('.gallery a', {
  sourceAttr: 'href',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  nav: true,
});

const updateList = (clearContainer = '') => {
  return (refs.galleryContainer.innerHTML = clearContainer);
};

const onHandleSubmit = async e => {
  e.preventDefault();
  const value = await e.target.elements.searchQuery.value.trim();

  if (!value) return;
  updateList();
  const page = 1;

  try {
    const data = await getImages(value, page);
    const totalHits = await data.data.totalHits;
    Notiflix.Notify.success(`Hooray! We found "${totalHits}" images.`);
    await toShowImages(data);
    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

const toShowImages = async data => {
  const markup = await renderCardItems(data);
  updateList(markup);
  smoothyScroll();
  gallery.refresh();
};

const pageCounter = () => (page += 1);

const onPagination = async () => {
  const value = refs.inputEl.value.trim();
  pageCounter();
  updateList();
  try {
    const data = await getImages(value, page);
    await toShowImages(data);
  } catch (error) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    ),
      refs.loadMoreBtn.classList.add('is-hidden');
  }
};

refs.form.addEventListener('submit', onHandleSubmit);
refs.loadMoreBtn.addEventListener('click', onPagination);

const smoothyScroll = () => {
  const { height: cardHeight } =
    refs.galleryContainer.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};
