const BASE_URL = '/';
const input = document.getElementById('fname');
const suggestions = document.getElementById('movie-suggestions');
const searchButton = document.getElementById('search-button');
const status = document.getElementById('search-status');
const resultsContent = document.getElementById('results-content');
const resultCount = document.getElementById('result-count');

const setStatus = (message, tone = '') => {
  status.textContent = message;
  status.dataset.tone = tone;
};

const showSuggestions = (titles) => {
  suggestions.replaceChildren();
  titles.forEach((title) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'suggestion';
    option.setAttribute('role', 'option');
    option.textContent = title;
    option.addEventListener('click', () => {
      input.value = title;
      suggestions.classList.remove('is-visible');
      loadRecommendations(title);
    });
    suggestions.appendChild(option);
  });
  suggestions.classList.toggle('is-visible', titles.length > 0);
};

const loadMovies = async (value) => {
  const query = value.trim();
  showSuggestions([]);
  if (query.length < 2) {
    setStatus('Type at least two letters to see movie suggestions.');
    return;
  }

  try {
    setStatus('Searching the movie library…', 'loading');
    const response = await fetch(`${BASE_URL}movies/search?startwith=${encodeURIComponent(query)}&n=5`);
    if (!response.ok) throw new Error(`Search failed (${response.status})`);
    const data = await response.json();
    showSuggestions(data.li);
    setStatus(data.li.length ? `${data.li.length} title${data.li.length === 1 ? '' : 's'} found. Select one or keep typing.` : 'No matching titles yet. Try another search.');
  } catch (error) {
    setStatus('The movie search is unavailable. Please try again.', 'error');
  }
};

const renderEmpty = (message) => {
  resultsContent.className = 'results-empty';
  resultsContent.innerHTML = `<div class="empty-art" aria-hidden="true">✦</div><h3>No recommendations found</h3><p>${message}</p>`;
  resultCount.textContent = '';
};

const renderRecommendations = (data) => {
  const [selected, ...movies] = data.recommended;
  if (!selected) {
    renderEmpty('Try selecting a movie title from the suggestions.');
    return;
  }

  resultsContent.className = 'results-grid';
  resultsContent.innerHTML = `
    <article class="selected-movie">
      <img src="${selected[1]}" alt="Poster for ${selected[0]}" onerror="this.style.visibility='hidden'">
      <p class="selected-label">You selected</p>
      <h3>${selected[0]}</h3>
      <p>The reference movie for this match set.</p>
    </article>
    <div class="recommendation-grid">
      ${movies.slice(0, 4).map((movie, index) => `
        <article class="movie-card">
          <img src="${movie[1]}" alt="Poster for ${movie[0]}" onerror="this.style.visibility='hidden'">
          <p class="movie-number">0${index + 1}</p>
          <h3>${movie[0]}</h3>
        </article>`).join('')}
    </div>`;
  const displayedCount = Math.min(movies.length, 4);
  resultCount.textContent = `${displayedCount} similar title${displayedCount === 1 ? '' : 's'} shown`;
};

const loadRecommendations = async (value) => {
  const movie = value.trim();
  if (!movie) {
    renderEmpty('Choose a movie title above and we’ll line up films with a similar feel.');
    return;
  }
  searchButton.disabled = true;
  searchButton.textContent = 'Loading matches…';
  setStatus('Comparing movie details to find the closest matches…', 'loading');
  suggestions.classList.remove('is-visible');
  try {
    const response = await fetch(`${BASE_URL}movies/recommend?n=5&name=${encodeURIComponent(movie)}`);
    if (!response.ok) throw new Error(`Recommendation failed (${response.status})`);
    renderRecommendations(await response.json());
  } catch (error) {
    renderEmpty('That title was not found. Select an exact title from the suggestions and try again.');
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = 'Find matches <span aria-hidden="true">→</span>';
  }
};

input.addEventListener('input', () => loadMovies(input.value));
searchButton.addEventListener('click', () => loadRecommendations(input.value));
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') loadRecommendations(input.value);
});



