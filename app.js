const express = require('express');
const morgan = require('morgan');
const apps = require('./playstore.js');

const app = express();
app.use(morgan('common'));

app.get('/apps', (req, res) => {
    const { sort, genres } = req.query;
    let filtered_apps = apps

    if(genres !== undefined) {
        if(
            genres.toLowerCase() !== 'action' 
            && genres.toLowerCase() !== 'puzzle'
            && genres.toLowerCase() !== 'strategy'
            && genres.toLowerCase() !== 'casual'
            && genres.toLowerCase() !== 'arcade'
            && genres.toLowerCase() !== 'card') {
                return res.status(400).send('can only filter by Action, Puzzle, Strategy, Casual, Arcade, or Card');
            }
            filtered_apps = apps.filter(app => {
                return app.Genres.includes(genres.charAt(0).toUpperCase() + genres.slice(1));
            })
    }

    if (sort !== undefined) {
        if(sort.toLowerCase() !== 'rating' && sort.toLowerCase() !== 'app') {
            return res.status(400).send('Can only sort by rating or app');
        }
    else if (sort.toLowerCase() === 'rating') {
        filtered_apps.sort(function(a, b) {
            return b.Rating - a.Rating;
            })
        }
    else if (sort.toLowerCase() === 'app') {
        filtered_apps.sort(function(a, b) {
            if(a.App < b.App) { return -1; }
            if(a.App > b.App) { return 1; }
            return 0;
            })
        }
    }

    res
    .json(filtered_apps);
    });

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});