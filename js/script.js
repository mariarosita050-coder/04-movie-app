// =========================================
// 1. TMDB ACCESS TOKEN
// ========================================

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

// =========================================
// 2. MENGAMBIL ELEMENT HTML
// =========================================

const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear-button");
const sectionTitle = document.getElementById("section-title");
const movieDetail = document.getElementById("movie-detail");


// =========================================
// 3. MOVIE DETAIL DISEMBUNYIKAN SAAT AWAL
// =========================================

movieDetail.style.display = "none";


// =========================================
// 4. FUNGSI UNTUK MENGAMBIL MOVIE POPULAR
// =========================================

async function getPopularMovies() {

    const url = "https://api.themoviedb.org/3/movie/popular";

    try {

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });

        const data = await response.json();

        console.log("Popular Movies:", data);

        displayMovies(data.results);

    } catch (error) {

        console.error(error);

        movieList.innerHTML = `
            <p>Something went wrong. Please try again.</p>
        `;
    }
}


// =========================================
// 5. FUNGSI UNTUK MENAMPILKAN MOVIE
// =========================================

function displayMovies(movies) {

    movieList.innerHTML = "";

    movies.forEach(function(movie) {

        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "assets/images/no-poster.svg";

        const movieCard = `
            <div class="movie-card" data-id="${movie.id}">

                <img 
                    src="${poster}" 
                    alt="${movie.title}"
                >

                <h3>${movie.title}</h3>

                <p>⭐ ${movie.vote_average.toFixed(1)}</p>

                <p class="movie-year">
                    Year: ${movie.release_date}
                </p>

                <p>
                    ${movie.overview}
                </p>

            </div>
        `;

        movieList.innerHTML += movieCard;

    });
}


// =========================================
// 6. JALANKAN MOVIE POPULAR SAAT WEBSITE DIBUKA
// =========================================

getPopularMovies();


// =========================================
// 7. SEARCH MOVIE
// =========================================

searchButton.addEventListener("click", async function() {

    const keyword = searchInput.value;

    // -----------------------------------------
    // CEK INPUT KOSONG
    // -----------------------------------------

    if (keyword === "") {

        sectionTitle.textContent = "Please enter a movie name.";

        return;
    }


    // -----------------------------------------
    // TAMPILKAN LOADING
    // -----------------------------------------

    movieList.innerHTML = "<p>Loading movies...</p>";

    sectionTitle.textContent = `Search Results for "${keyword}"`;


    // -----------------------------------------
    // URL SEARCH TMDB
    // -----------------------------------------

    const searchUrl =
        `https://api.themoviedb.org/3/search/movie?query=${keyword}`;


    try {

        const response = await fetch(searchUrl, {

            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }

        });

        const data = await response.json();

        console.log("Search Results:", data);


        // -----------------------------------------
        // JIKA FILM TIDAK DITEMUKAN
        // -----------------------------------------

        if (data.results.length === 0) {

            movieList.innerHTML = "<p>No movies found.</p>";

            return;
        }


        // -----------------------------------------
        // TAMPILKAN HASIL SEARCH
        // -----------------------------------------

        displayMovies(data.results);

    } catch (error) {

        console.error(error);

        movieList.innerHTML =
            "<p>Something went wrong. Please try again.</p>";
    }

});


// =========================================
// 8. SEARCH MENGGUNAKAN ENTER
// =========================================

searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        searchButton.click();

    }

});


// =========================================
// 9. CLEAR SEARCH
// =========================================

clearButton.addEventListener("click", function() {

    // Kosongkan search input
    searchInput.value = "";

    // Kembalikan judul
    sectionTitle.textContent = "Popular Movies";

    // Ambil kembali film popular
    getPopularMovies();

});


// =========================================
// 10. CLICK MOVIE CARD
// =========================================

movieList.addEventListener("click", async function(event) {

    const card = event.target.closest(".movie-card");

    if (!card) {
        return;
    }


    // -----------------------------------------
    // AMBIL MOVIE ID
    // -----------------------------------------

    const movieId = card.dataset.id;

    console.log("Movie ID:", movieId);


    // -----------------------------------------
    // URL MOVIE DETAIL
    // -----------------------------------------

    const detailUrl =
        `https://api.themoviedb.org/3/movie/${movieId}`;


    try {

        const response = await fetch(detailUrl, {

            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }

        });

        const movie = await response.json();

        console.log("Movie Detail:", movie);


        // -----------------------------------------
        // TAMPILKAN MOVIE DETAIL
        // -----------------------------------------

        movieDetail.style.display = "block";


        // -----------------------------------------
        // POSTER DETAIL
        // -----------------------------------------

        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "assets/images/no-poster.svg";


        movieDetail.innerHTML = `

            <button id="back-button">
                ← Back to Movies
            </button>

            <div class="movie-detail-content">

                <img
                    src="${poster}"
                    alt="${movie.title}"
                >

                <div class="movie-detail-info">

                    <h2>${movie.title}</h2>

                    <p class="movie-tagline">
                        ${movie.tagline || ""}
                    </p>

                    <p>
                        ⭐ ${movie.vote_average.toFixed(1)}
                    </p>

                    <p>
                        📅 Release: ${movie.release_date}
                    </p>

                    <p>
                        ⏱ Runtime: ${movie.runtime} minutes
                    </p>

                    <p>
                        ${movie.overview}
                    </p>

                    <p>
                        🎭 Genre:
                        ${movie.genres.map(function(genre) {
                            return genre.name;
                        }).join(", ")}
                    </p>

                </div>

            </div>
        `;


        // -----------------------------------------
        // BACK BUTTON
        // -----------------------------------------

        const backButton =
            document.getElementById("back-button");


        backButton.addEventListener("click", function() {

            movieDetail.innerHTML = "";

            movieDetail.style.display = "none";

        });


    } catch (error) {

        console.error(error);

    }

});