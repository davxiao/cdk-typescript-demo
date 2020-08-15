import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(3000, err => {
    if (err) {
        return console.error(err);
    }
});
