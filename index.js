const express = require('express'); 
const app = express();


//route of the port

app.get('/' , (req, res) => {
    res.send('Hello World')
    }) 
    
    app.listen(3000, () => {
        console.log('Hello World');
    })