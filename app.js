const apiKey = "bd20282504694a68a463d8ed0e8b26f0";

const searchInput = document.getElementById("search");
const moviesContainer = document.getElementById("movies");
const loader = document.getElementById("loader");
const themeToggle = document.getElementById("theme-toggle");
const scrollTopBtn = document.getElementById("scrollTop");

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

let timeout;
searchInput.addEventListener("input", () => {
  clearTimeout(timeout);
  timeout = setTimeout(fetchMovies, 400);
});

async function fetchMovies() {
  const query = searchInput.value.trim();

  if (query.length === 0) {
    moviesContainer.innerHTML = "<h3>Search your fav movies...</h3>";
    loader.style.display = "none";
    return;
  }

  loader.style.display = "flex";
  moviesContainer.innerHTML = "";

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=es-ES`
    );
    const data = await response.json();
    const movies = data.results;

    let poster = "https://image.tmdb.org/t/p/w500"
    let NoPoster = "https://lh3.googleusercontent.com/proxy/wjRXrOcYxJ4gNWcJNYegLKHOdQfiNqPX5U1Xj8ud1WWh1WkZTuVIfd7HKeencjABBa4";

    if (movies.length === 0) {
      setTimeout(() => {
        loader.style.display = "none";
        moviesContainer.innerHTML = "<h3>We dirent find movies ¡Sorry!.</h3>";
        return;
      }, 2000); 
    } else {
      setTimeout(() => {
        movies.forEach((movie) => {
          const MoreInformation = document.createElement("div");
          const div = document.createElement("div");
          div.className = "movie";
          div.innerHTML = `
            <h2>${movie.title} (${movie.release_date ? movie.release_date.slice(0, 4) : "N/A"})</h2> 
            <img src="${movie.poster_path ? poster + movie.poster_path : NoPoster}" alt="">
            <p>${movie.overview ? movie.overview.slice(0, 150) + "..." : "No description..."}</p>
          `;
          moviesContainer.appendChild(div);

          div.addEventListener("click", () => {
            MoreInformation.className = "more-information";
            MoreInformation.innerHTML = `
              <div>
                <img src="${movie.poster_path ? poster + movie.poster_path : NoPoster}" alt="">
              </div>
              <div class="info">
                <h2>${movie.title} (${movie.release_date ? movie.release_date.slice(0, 4) : "N/A"})</h2>
                <p class="desc">${movie.overview ? movie.overview : "No description..."}</p>
                <p><strong>Rating:</strong> ${movie.vote_average ? movie.vote_average : "N/A"}</p>
                <p><strong>Release Date:</strong> ${movie.release_date ? movie.release_date : "N/A"}</p>
                <button class="close-btn" id="xBtn"><i class="bi bi-x"></i></button>
              </div>
            `;
            moviesContainer.appendChild(MoreInformation);
            setTimeout(() => {
              MoreInformation.style.opacity = "1";
            }, 100); 

            const xBtn = document.getElementById("xBtn");
            xBtn.addEventListener("click", () => {
              MoreInformation.style.opacity = "0";
              setTimeout(() => {
                MoreInformation.remove();
              }, 1000);
            });
          });

        });
      }, 2000); 
    }

  } catch (error) {
    setTimeout(() => {
      loader.style.display = "none";
      console.error("Something is bad:", error);
      moviesContainer.innerHTML = "<h3>Something gone worng.</h3>";
    }, 2000); 
  } finally {
    setTimeout(() => {
      loader.style.display = "none";
    }, 2000); 
  }
}

window.addEventListener("scroll", () => {
  scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
