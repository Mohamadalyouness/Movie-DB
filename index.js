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

    const searchQuery = req.query.s;

    if (searchQuery) {
        res.status(200).json({ status: 200, message: "ok", data: searchQuery });
    } else {
        res.status(500).json({ status: 500, error: true, message: "you have to provide a search" });
    }
});

app.get('/movies/add', (req, res) => {
    res.send('Hello World')
})

app.get('/movies/get', (req, res) => {
    res.status(200).json({ status: 200, data: movies });
});

app.get('/movies/get/by-date', (req, res) => {
    const sortedMovies = movies.sort((a, b) => {
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    });
    res.status(200).json({ status: 200, data: sortedMovies });
  });
  


app.get('//movies/edit', (req, res) => {
    res.send('Hello World')
})

app.get('//movies/delete', (req, res) => {
    res.send('Hello World')
})





app.listen(3000, () => {
    console.log('Online');
})


