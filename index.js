const express = require('express');
const app = express();

const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
]
//route of the port

app.get('/', (req, res) => {
    res.send('Hello again')
})

app.get('/test', (req, res) => {
    res.status(200).json({ status: 200, message: "ok" });
});


app.get('/time', (req, res) => {
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })
    res.status(200).json({ status: 200, message: currentTime });
});


app.get('/hello/:id?', (req, res) => {

    const { id } = req.params;

    const message = id ? `Hello, ${id}` : 'Hello, World';

    res.status(200).json({ status: 200, message });
});


app.get('/search', (req, res) => {

    const { searchQuery } = req.query;

    if (searchQuery) {
        res.status(200).json({ status: 200, message: "ok", data: searchQuery });
    } else {
        res.status(500).json({ status: 500, error: true, message: "you have to provide a search" });
    }
});

app.get('/movies/get', (req, res) => {
    res.status(200).json({ status: 200, data: movies });
});

app.get('/movies/get/by-date', (req, res) => {
    movies.sort((a, b) => {
        if (a.year < b.year) return -1;
        if (a.year > b.year) return 1;
        return 0;
    });

    res.status(200).json({ status: 200, data: movies });
});

app.get('/movies/get/by-rating', (req, res) => {
    movies.sort((a, b) => {
        if (a.rating < b.rating) return -1;
        if (a.rating > b.rating) return 1;
        return 0;
    });

    res.status(200).json({ status: 200, data: movies });
});

app.get('/movies/get/by-title', (req, res) => {
    movies.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    });

    res.status(200).json({ status: 200, data: movies });
});

app.get('/movies/get/id/:index', (req, res) => {
    const index = parseInt(req.params.index);

    if (isNaN(index) || index < 0 || index >= movies.length) {
        res.status(404).json({ status: 404, error: true, message: "Movie not found" });
    } else {
        const movie = movies[index];
        res.status(200).json({ status: 200, data: movie });
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/movies/add', (req, res) => {
    const { title, year, rating } = req.query;
    if (!title || !year) {
        return res.status(403).json({
            status: 403,
            error: true,
            message: 'You cannot create a movie without providing a title and a year',
        });
    }
    if (!/^\d{4}$/.test(year)) {
        return res.status(403).json({
            status: 403,
            error: true,
            message: 'Year must be a 4-digit number',
        });
    }
    const parsedRating = rating ? parseFloat(rating) : 4;
    const newMovie = { title, year: parseInt(year), rating: parsedRating };
    movies.push(newMovie);
    res.status(200).json({ status: 200, data: movies });
});



app.get('//movies/edit', (req, res) => {
    res.send('Hello World')
})
app.delete('/movies/delete/id/:index', (req, res) => {
    const movieIndex = parseInt(req.params.index);
    const result = deleteMovieByIndex(movieIndex);

    res.status(result.status).json(result);
});
function deleteMovieByIndex(index) {
    if (isNaN(index) || index < 0 || index >= movies.length) {
        return {
            status: 404,
            error: true,
            message: "Movie not found",
        };
    } else {
        const deletedMovie = movies[index];
        movies.splice(index, 1);
        return {
            status: 200,
            data: deletedMovie,
        };
    }
}

app.listen(3000, () => {
    console.log('Online');
})


