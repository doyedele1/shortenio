const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ShortUrl = require('./models/shortUrl');

mongoose.connect('mongodb://127.0.0.1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
    try {
        await ShortUrl.create({ full: req.body.fullUrl });
        res.redirect('/');
    } catch(err) {
        res.status(err.response.status);
        return res.send(err.message);
    }
});

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

    if(shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);