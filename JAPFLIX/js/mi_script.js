let movies = []; //se define una variable global, que inicialmente es un array vacío

document.addEventListener("DOMContentLoaded", function() { //para que el código se ejecute cuando el HTML del documento esté completamente cargado


    fetch(`https://japceibal.github.io/japflix_api/movies-data.json`)
    .then(response => response.json()) //response.json() convierte la respuesta de formato JSON a objeto JavaScript.
    .then(data => {
      movies = data;  // Guardar los datos en la variable declarada
      console.log(movies); // Para verificar que todo venga bien
    
    })
    .catch(error => console.error('Error al cargar la película:', error));
});

 // Filtro por búsqueda
 document.getElementById("btnBuscar").addEventListener("click", function() {
    const search = document.getElementById("inputBuscar").value.toLowerCase(); // se obtiene el valor actual del campo de texto de búsqueda (input) y con .toLowerCase(): convierte el texto ingresado a minúsculas para hacer una búsqueda insensible a mayúsculas y minúsculas.

    if (!search) return; // Si no hay búsqueda, no hacer nada

    // Filtrar películas según la búsqueda en title, genres, tagline o overview
    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(search) ||
        movie.genres.map(g => g.name.toLowerCase()).join(' ').includes(search) || 
        movie.tagline.toLowerCase().includes(search) || 
        movie.overview.toLowerCase().includes(search)
    );

    // Mostrar los resultados
    showMovies(filteredMovies);
 });

// Función para mostrar los datos
function showMovies(movies) {
    const container = document.getElementById("lista");
    container.innerHTML = ''; // Limpiar el contenido previo

    if (movies.length === 0) {
        container.innerHTML = '<p>No se encontraron películas.</p>';
    } else {
        movies.forEach(movie => {
            const stars = generateStars(movie.vote_average);

            const movieHTML = `
                <li class="list-group-item bg-dark text-white" data-id="${movie.id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMovie">
                    <h5>${movie.title}</h5>
                    <p>${movie.tagline}</p>
                    <p>${stars}</p>
                </li>
            `;

            container.innerHTML += movieHTML;
        });

        // Agregar evento de clic para abrir el offcanvas con detalles de la película
        document.querySelectorAll('.list-group-item').forEach(item => {
            item.addEventListener('click', function () {
                const movieId = this.getAttribute('data-id');
                offcanvas(movieId);
            });
        });
    }
}


// Función para generar estrellas a partir del puntaje
function generateStars(vote_average) {
    let stars = '';
    const totalStars = 5;
    const filledStars = Math.round(vote_average / 2);  // Convertir el puntaje en una escala de 5 estrellas

    for (let i = 0; i < filledStars; i++) {
        stars += '<span class="fa fa-star checked"></span>';  // Estrella llena
    }
    for (let i = filledStars; i < totalStars; i++) {
        stars += '<span class="fa fa-star"></span>';  // Estrella vacía
    }

    return stars;
}

// Función para mostrar detalles en el offcanvas
function offcanvas(movieId){
    movie = movies.find((movie) => movie.id == movieId);

    if (movie) {
    document.getElementById("offcanvasMovieLabel").innerHTML = movie.title;
    document.getElementById("offcanvasMovieOverview").innerHTML = movie.overview;
    let genres= movie.genres.map(genre => genre.name).join(" - ");
    document.getElementById("offcanvasMovieGenre").innerHTML = genres;

    //Dropdown
    document.getElementsByClassName("dropdown-menu")[0].innerHTML = `
    <li><a class="dropdown-item"><p>Year:</p><p>${movie.release_date.split("-")[0]}</p></a></li>
    <li><a class="dropdown-item"><p>Runtime:</p><p>${movie.runtime} mins</p></a></li>
    <li><a class="dropdown-item"><p>Budget:</p><p>$${movie.budget.toLocaleString()}</p></a></li>
    <li><a class="dropdown-item"><p>Revenue:</p><p>$${movie.revenue.toLocaleString()}</p></a></li>
    `;
    }
    console.log(movie);
}