const express = require('express');
const Url = require('../models/url');
const Paste = require('../models/paste');

const router = express.Router();

// URL SHORTNER CODE
router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: 'Please provide a valid URL.' });
    }

    let shortId;

    try {
        const { nanoid } = await import('nanoid');
        do {
            shortId = nanoid(6);
        } while (await Url.exists({ shortId }));

        const url = new Url({ longUrl, shortId });
        await url.save();
        
        res.json({ shortUrl: `${req.protocol}://${req.get('host')}/short/${shortId}` });
    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({ error: 'Short ID already exists.' });
        } else {
            return res.status(500).send('Server Error');
        }
    }
});

router.get('/short/:shortId', async (req, res) => {
    const { shortId } = req.params;

    try {
        const url = await Url.findOne({ shortId });
        if (url) {
            let redirectUrl = url.longUrl;

            if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
                redirectUrl = `http://${redirectUrl}`;
            }
            return res.redirect(redirectUrl);
        } else {
            return res.status(404).json({ error: 'URL Invalid or Not Found' });
        }
    } catch (error) {
        console.error('Error fetching URL:', error);
        res.status(500).send('Server Error');
    }
});

// PASTEBIN SHORTNER CODE
router.post('/paste', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Please provide Text, Code or Script to Create its Paste.' });
    }

    let shortId;

    try {
        const { nanoid } = await import('nanoid');
        do {
            shortId = nanoid(6);
        } while (await Paste.exists({ shortId }));

        const new_text = new Paste({ text, shortId });
        await new_text.save();
        
        res.json({ paste: `${req.protocol}://${req.get('host')}/paste/${shortId}` });
    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({ error: 'Short ID already exists.' });
        } else {
            return res.status(500).send('Server Error');
        }
    }
});

router.get('/paste/:shortId', async (req, res) => {
    const { shortId } = req.params;

    try {
        const paste = await Paste.findOne({ shortId });
        if (paste) {
            res.type('text/plain');
            return res.send(paste.text);
        } else {
            return res.status(404).json({ error: 'Paste not found.' });
        }
    } catch (error) {
        console.error('Error fetching URL:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router