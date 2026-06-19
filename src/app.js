const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security Middlewares with flexible Content Security Policy
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https:", "http:"],
            "script-src": ["'self'", "'unsafe-inline'", "https:", "http:"],
            "script-src-attr": ["'self'", "'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'", "https:", "http:"],
            "font-src": ["'self'", "https:", "http:", "data:"],
        },
    },
}));

// CORS Configuration
const corsOptions = {
    origin: '*', // Under production, limit this to specific domains
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Parse requests with size limit to prevent payload abuse
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Rate Limiting to prevent DoS attacks on authentication endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

app.use('/api/auth/login', apiLimiter);
app.use('/api/auth/register', apiLimiter);

// Serve static assets with caching
app.use(express.static(path.join(__dirname, '../public'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        }
    }
}));

// API Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// View Routing (MPA mappings)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});
app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/events.html'));
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});
app.get('/event/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/event-details.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin.html'));
});

// Category API helper
const { Category } = require('./models');
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (err) {
        console.error('Get Categories Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
});

// Robots and Sitemap compatibility
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nSitemap: ${BASE_URL}/sitemap.xml`);
});

app.get('/sitemap.xml', async (req, res) => {
    res.type('application/xml');
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${BASE_URL}/events</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    
    try {
        const { Event } = require('./models');
        const events = await Event.findAll({ attributes: ['id', 'updatedAt'] });
        events.forEach(e => {
            const dateStr = e.updatedAt.toISOString().split('T')[0];
            xml += `  <url>\n    <loc>${BASE_URL}/event/${e.id}</loc>\n    <lastmod>${dateStr}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        });
    } catch (e) {
        console.error('Sitemap fetch events error:', e);
    }
    
    xml += `</urlset>`;
    res.send(xml);
});

// 404 Route
app.use((req, res) => {
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(__dirname, '../views/index.html'));
    } else {
        res.status(404).json({ message: 'Route not found' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;