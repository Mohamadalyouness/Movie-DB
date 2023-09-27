
import express from "express";

import mongoose from "mongoose";

const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const users = [
    { id: 0, username: 'John', password: '1234' },
    { id: 1, username: 'Jane', password: '5678' },
];
function authenticateUser(req, res, next) {
    const { username, password } = req.headers;

    const authenticatedUser = users.find(
        (user) => user.username === username && user.password === password
    );

    if (authenticatedUser) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication failed' });
    }
}


app.get('/api/addusers', (req, res) => {
    const { username, password } = req.query;

    if (!username || !password) {
        return res.status(400).json({ status: 400, error: true, message: 'Username and password are required' });
    }

    const newUser = { username, password };
    users.push(newUser);

    res.status(201).json({ status: 201, data: users });
});

app.get('/api/users', (req, res) => {
    res.status(200).json({ status: 200, data: users });
});

app.get('/api/users/:index', (req, res) => {
    const index = parseInt(req.params.index);

    if (isNaN(index) || index < 0 || index >= users.length) {
        res.status(404).json({ status: 404, error: true, message: "user not found" });
    } else {
        const user = users[index];
        res.status(200).json({ status: 200, data: user });
    }
});

app.get('/api/users/:username', (req, res) => {
    const { username } = req.params;
    const { password } = req.body;

    const userIndex = users.findIndex((user) => user.username === username);

    if (userIndex === -1) {
        return res.status(404).json({ status: 404, error: true, message: 'User not found' });
    }

    if (password) {
        users[userIndex].password = password;
    }

    res.status(200).json({ status: 200, data: users[userIndex] });
});

const movieSchema = new mongoose.Schema({
    _id: Number,
    title: String,
    year: Number,
    rating: Number
});
const Movie = mongoose.model('Movie', movieSchema);

const movies = [
    { id: 0, title: 'Jaws', year: 1975, rating: 8 },
    { id: 1, title: 'Avatar', year: 2009, rating: 7.8 },
    { id: 2, title: 'Brazil', year: 1985, rating: 8 },
    { id: 3, title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
]



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
    });

    res.status(200).json({ status: 200, data: { time: currentTime } });
});


app.get('/hello/:id?', (req, res) => {

    const { id } = req.params;

    const message = id ? `Hello, ${id}` : 'Hello, World';

    res.status(200).json({ status: 200, message });
});


app.get('/search', (req, res) => {
    const searchQuery = req.query.s;

    if (searchQuery) {
        res.status(200).json({ status: 200, message: 'ok', data: searchQuery });
    } else {
        res.status(500).json({ status: 500, error: true, message: 'you have to provide a search' });
    }
});

app.get('/api/movies', (req, res) => {
    res.status(200).json({ status: 200, data: movies });
});

app.get('/api/movies/get/by-date', (req, res) => {
    movies.sort((a, b) => {
        if (a.year < b.year) return -1;
        if (a.year > b.year) return 1;
        return 0;
    });

    res.status(200).json({ status: 200, data: movies });
});

app.get('/api/movies/get/by-rating', (req, res) => {
    movies.sort((a, b) => {
        if (a.rating < b.rating) return -1;
        if (a.rating > b.rating) return 1;
        return 0;
    });

    res.status(200).json({ status: 200, data: movies });
});

app.get('/api/movies/get/by-title', (req, res) => {
    movies.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    });

    res.status(200).json({ status: 200, data: movies });
});

app.get('/api/movies/:index', (req, res) => {
    const index = parseInt(req.params.index);

    if (isNaN(index) || index < 0 || index >= movies.length) {
        res.status(404).json({ status: 404, error: true, message: "Movie not found" });
    } else {
        const movie = movies[index];
        res.status(200).json({ status: 200, data: movie });
    }
});

app.get('/api/addmovies', (req, res) => {
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
    const movies = new Movie({
        title: title,
        year: year,
        rating: rating
    })

    res.status(200).json({ status: 200, data: movies });
});

app.get('/api/editmovies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const { title, year, rating } = req.body;
   
    const movieToUpdate = movies.find((movie) => movie.id === movieId);

    if (!movieToUpdate) {
        return res.status(404).json({
            status: 404,
            error: true,
            message: `Movie with ID ${movieId} not found`,
        });
    }

    if (title) {
        movieToUpdate.title = title;
    }
    if (year) {
        movieToUpdate.year = year;
    }

    if (rating) {
        movieToUpdate.rating = parseFloat(rating);
    }
    res.status(200).json({ status: 200, data: movies });
});


app.get('/api/deletemovies/:id', (req, res) => {
    const movieIndex = parseInt(req.params.id);
    const result = deleteMovieById(movieIndex);


    res.status(result.status).json(result);
});

function deleteMovieById(index) {

    if (isNaN(index) || index < 0 || index >= movies.length) {
        return {
            status: 404,
            error: true,
            message: "Movie not found",
        };
    } else {
        const deletedMovie = movies.splice(index, 1)[0];
        return {
            status: 200,
            data: deletedMovie,
        };
    }
}
// mongoose.connect("mongodb+srv://mohamadalyouness7:M78920699@cluster0.5obfxej.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp");

app.listen(3000, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Starting server on port 3000");
    }
});


