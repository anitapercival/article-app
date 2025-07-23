const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// GET Articles with pagination and filters
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { analyst, channel, contentType, region } = req.query;

  let filterConditions = 'WHERE 1=1';
  let params = [];

  if (analyst) {
    filterConditions += ' AND an.slug = ?';
    params.push(analyst);
  }
  if (channel) {
    filterConditions += ' AND ch.slug = ?';
    params.push(channel);
  }
  if (contentType) {
    filterConditions += ' AND ct.id = ?';
    params.push(contentType);
  }
  if (region) {
    filterConditions += ' AND r.id = ?';
    params.push(region);
  }

  // Count total articles matching filters
  const countQuery = `
    SELECT COUNT(DISTINCT a.slug) as total
    FROM articles a
    LEFT JOIN article_analysts aa ON a.slug = aa.article_slug
    LEFT JOIN analysts an ON aa.analyst_slug = an.slug
    LEFT JOIN channels ch ON a.channel_id = ch.slug
    LEFT JOIN content_types ct ON a.content_type_id = ct.id
    LEFT JOIN article_regions ar ON a.slug = ar.article_slug
    LEFT JOIN regions r ON ar.region_id = r.id
    ${filterConditions}
  `;

  db.get(countQuery, params, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });

    const total = countResult.total;

    // Fetch paginated articles with filters
    const dataQuery = `
      SELECT a.slug, a.title, a.summary, a.published_at,
             ch.name as channel_name, ch.slug as channel_slug,
             ct.name as content_type_name, ct.color as content_type_color,
             an.first_name || ' ' || an.last_name as analyst_name,
             an.slug as analyst_slug,
             an.picture as analyst_avatar,
             GROUP_CONCAT(DISTINCT r.name) as regions
      FROM articles a
      LEFT JOIN article_analysts aa ON a.slug = aa.article_slug
      LEFT JOIN analysts an ON aa.analyst_slug = an.slug
      LEFT JOIN channels ch ON a.channel_id = ch.slug
      LEFT JOIN content_types ct ON a.content_type_id = ct.id
      LEFT JOIN article_regions ar ON a.slug = ar.article_slug
      LEFT JOIN regions r ON ar.region_id = r.id
      ${filterConditions}
      GROUP BY a.slug
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...params, limit, offset];

    db.all(dataQuery, dataParams, (err, articles) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    });
  });
});

// GET Analysts for filters
router.get('/analysts', (req, res) => {
  const query = `SELECT slug, first_name || ' ' || last_name AS name FROM analysts ORDER BY name`;

  db.all(query, [], (err, analysts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(analysts);
  });
});

// GET Channels for filters
router.get('/channels', (req, res) => {
  const query = `SELECT slug, name FROM channels ORDER BY name`;

  db.all(query, [], (err, channels) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(channels);
  });
});

// GET Single article by slug (with content if logged in)
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  let user = null;

  const token = req.cookies?.token;
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
    }
  }

  // Query to fetch article details
  const query = `
    SELECT a.slug, a.title, a.summary, a.content, a.published_at,
       an.first_name || ' ' || an.last_name as analyst_name,
       an.slug as analyst_slug,
       an.picture as analyst_avatar,
       ch.name as channel_name,
       ct.id as content_type_id,
       ct.name as content_type_name,
       ct.color as content_type_color,
       GROUP_CONCAT(DISTINCT r.name) as regions
FROM articles a
LEFT JOIN article_analysts aa ON a.slug = aa.article_slug
LEFT JOIN analysts an ON aa.analyst_slug = an.slug
LEFT JOIN channels ch ON a.channel_id = ch.slug
LEFT JOIN content_types ct ON a.content_type_id = ct.id
LEFT JOIN article_regions ar ON a.slug = ar.article_slug
LEFT JOIN regions r ON ar.region_id = r.id
WHERE a.slug = ?
GROUP BY a.slug
  `;

  db.get(query, [slug], (err, article) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!article) return res.status(404).json({ message: 'Not found' });

    // Remove full content if not logged in
    if (!user) {
      delete article.content;
      article.message = 'Login to read the full article.';
    }

    res.json(article);
  });
});

module.exports = router;
