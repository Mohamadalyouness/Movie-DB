const express = require('express');
const app = express();


//route of the port

app.get('/', (req, res) => {
    res.send('Hello World')
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





app.listen(3000, () => {
    console.log('Hello World');
})


