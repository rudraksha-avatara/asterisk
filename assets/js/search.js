/* ================= CONFIG ================= */
const API_PROXY = "https://omdb.jaydatt.workers.dev/";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours
const MIN_QUERY_LEN = 2;
const SKELETON_COUNT = 6;
const PAGE_SIZE = 10;
const PLACEHOLDER_IMG = "https://placehold.co/300x450?text=No+Image";

/* ================= ELEMENTS ================= */
const grid = document.getElementById("grid");
const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loadMore = document.getElementById("loadMore");
const state = document.getElementById("state");

/* ================= STATE ================= */
let query = "";
let page = 1;
let loading = false;
let debounceTimer;
let imageObserver;

/* ================= POPULAR ================= */
const popular = [
    "RRR", "Jawan", "Pathaan", "KGF", "Pushpa", "Dangal"
];

/* ================= INIT ================= */
initLazyImages();
initPopular();
bindEvents();

/* ================= EVENTS ================= */
function bindEvents() {
    input.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const val = input.value.trim();
            if (val.length < MIN_QUERY_LEN) {
                initPopular();
                return;
            }
            startSearch();
        }, 400);
    });

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") startSearch();
    });

    searchBtn.addEventListener("click", startSearch);

    loadMore.addEventListener("click", () => {
        if (!loading) {
            page++;
            fetchMovies();
        }
    });
}

/* ================= SEARCH ================= */
function startSearch() {
    const val = input.value.trim();
    if (val.length < MIN_QUERY_LEN) return;

    query = val;
    page = 1;
    grid.innerHTML = "";
    state.textContent = "";
    loadMore.hidden = true;

    fetchMovies();
}

/* ================= CACHE ================= */
const cacheKey = (q, p) => `movie_${q}_${p}`;

function getCache(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        const obj = JSON.parse(raw);
        if (Date.now() - obj.time > CACHE_TTL) {
            localStorage.removeItem(key);
            return null;
        }
        return obj.data;
    } catch {
        return null;
    }
}

function setCache(key, data) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify({ time: Date.now(), data })
        );
    } catch { }
}

/* ================= FETCH ================= */
async function fetchMovies() {
    if (loading) return;

    loading = true;
    lockUI(true);

    const key = cacheKey(query, page);
    const cached = getCache(key);

    if (cached) {
        render(cached);
        finalizePagination(cached);
        finishFetch();
        return;
    }

    showSkeletons(SKELETON_COUNT);

    try {
        const res = await fetch(
            `${API_PROXY}?s=${encodeURIComponent(query)}&page=${page}`
        );
        const data = await res.json();

        removeSkeletons();

        if (data.Response === "False" || !data.Search?.length) {
            if (page === 1) {
                state.textContent = "No movies found.";
            } else {
                state.textContent = "No more results.";
            }
            loadMore.hidden = true;
            finishFetch();
            return;
        }

        setCache(key, data);
        render(data);
        finalizePagination(data);

    } catch {
        state.textContent = "Service temporarily unavailable.";
        loadMore.hidden = true;
    } finally {
        finishFetch();
    }
}

function finalizePagination(data) {
    const total = Number(data.totalResults || 0);
    const loaded = page * PAGE_SIZE;

    if (data.Search.length < PAGE_SIZE || loaded >= total) {
        loadMore.hidden = true;
        state.textContent = "No more results.";
    } else {
        loadMore.hidden = false;
        state.textContent = "";
    }
}

function finishFetch() {
    loading = false;
    lockUI(false);
}

function lockUI(lock) {
    searchBtn.disabled = lock;
    loadMore.disabled = lock;
}

/* ================= RENDER ================= */
function render(data) {
    const frag = document.createDocumentFragment();

    data.Search.forEach(movie => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img
                data-src="${movie.Poster && movie.Poster !== "N/A"
                ? movie.Poster
                : PLACEHOLDER_IMG}"
                alt="${movie.Title}"
            >
            <div class="info">${movie.Title} (${movie.Year})</div>
        `;

        card.addEventListener("click", () => {
            location.href = `https://iiuo.org/watch?id=${movie.imdbID}`;
        });

        frag.appendChild(card);
        observeImage(card.querySelector("img"));
    });

    grid.appendChild(frag);
}

/* ================= SKELETON ================= */
function showSkeletons(count) {
    removeSkeletons();
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const s = document.createElement("div");
        s.className = "skeleton";
        frag.appendChild(s);
    }

    grid.appendChild(frag);
}

function removeSkeletons() {
    grid.querySelectorAll(".skeleton").forEach(el => el.remove());
}

/* ================= LAZY IMAGES ================= */
function initLazyImages() {
    imageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const img = entry.target;
            img.src = img.dataset.src || PLACEHOLDER_IMG;

            img.onerror = () => {
                img.src = PLACEHOLDER_IMG;
            };

            img.classList.add("loaded");
            imageObserver.unobserve(img);
        });
    }, { rootMargin: "200px" });
}

function observeImage(img) {
    if (img?.dataset?.src) imageObserver.observe(img);
}

/* ================= POPULAR ================= */
function initPopular() {
    grid.innerHTML = "";
    state.textContent = "";
    loadMore.hidden = true;

    showSkeletons(popular.length);

    popular.forEach(title => {
        fetch(`${API_PROXY}?t=${encodeURIComponent(title)}`)
            .then(r => r.json())
            .then(movie => {
                const sk = grid.querySelector(".skeleton");
                if (sk) sk.remove();

                if (!movie?.Title) return;

                const card = document.createElement("div");
                card.className = "card";

                card.innerHTML = `
                    <img
                        data-src="${movie.Poster && movie.Poster !== "N/A"
                        ? movie.Poster
                        : PLACEHOLDER_IMG}"
                        alt="${movie.Title}"
                    >
                    <div class="info">${movie.Title}</div>
                `;

                card.addEventListener("click", () => {
                    location.href = `https://iiuo.org/watch?id=${movie.imdbID}`;
                });

                grid.appendChild(card);
                observeImage(card.querySelector("img"));
            })
            .catch(() => { });
    });
}
