const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/server/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/shortUrls', async (req, res) => {
    try {
        await ShortUrl.create({ full: req.body.fullUrl })
        res.redirect('/')
    } catch(err) {
        res.status(err.response.status)
        return res.send(err.message)
    }
})

app.listen(process.env.PORT || 5000)