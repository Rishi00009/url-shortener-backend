import { nanoid } from 'nanoid';
import URL from '../models/URL.js';

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }

    // Check if the original URL already has a short URL
    const existingUrl = await URL.findOne({ originalUrl });
    if (existingUrl) {
      return res.status(200).json({ shortUrl: existingUrl.shortUrl });
    }

    const shortUrl = nanoid(7);
    const newUrl = new URL({
      originalUrl,
      shortUrl: `${process.env.BASE_URL}/${shortUrl}`,
      createdBy: req.user.userId, // From middleware
    });

    await newUrl.save();
    res.status(201).json({ shortUrl: newUrl.shortUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const url = await URL.findOne({ shortUrl: `${process.env.BASE_URL}/${shortUrl}` });

    if (url) {
      return res.redirect(url.originalUrl);
    }

    return res.status(404).send('URL not found');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
}

