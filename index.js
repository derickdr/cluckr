const express = require('express'),
    logger = require('morgan'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    app = express(),
    knex = require('knex')({
        client: 'pg',
        connection: {
            host : 'localhost',
            database : 'cluckr'
        },
        useNullAsDefault: true,
    }),
    dbConfig = require('knexfile'),
    client = knex(dbConfig.development),
    PORT = 6967,
    ADDRESS = 'localhost',
    COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

// ----------

/* Middleware Initialization */

// Username fetching middleware
function getUser(req, res, next) {
    res.locals.username = req.cookies.username;
    next();
};

// Initialize cookie parser
app.use(cookieParser());

// Initialze urlencoded parser
app.use(express.urlencoded({ extended: true }));

// Intialize static files
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));

// Initialize logger
app.use(logger('dev'));

// EJS as view engine
app.set('view_engine', 'ejs');

// ----------

/* Initialize page */

// Declare server initialization
app.listen(ADDRESS, PORT, () => {
    console.log (`Express Server initialized on ${ADDRESS}:${PORT}`);
});

// ----------

/* Pages */

app.get("/", (req, res) => {
    res.redirect('/clucks');
});

app.get("/clucks", (req, res) => {
    let clucks = []
    knex('clucks')
        .select('*')
        .then(data => {
            console.log(data);
            clucks.push(data);
            knex.destroy();
        });
    res.render('clucks');
});

app.get("/sign_in", (req, res) => {
    res.render('signIn');
});

app.get("/new_cluck", (req, res) => {
    res.render('newCluck');
});

// ----------

/* Signing in & out, prevent anonymous interaction */

// Sign in
app.post('/sign_in', (req, res) => {
    res.cookie('username', req.body.username, { maxAge: new Date(COOKIE_MAX_AGE) });
    res.redirect('/');
});

// Sign out
app.post('/sign_out', (req, res) => {
    res.clearCookie('username');
    res.redirect('/');
});

// Login check when sending clucks
app.use(function(req, res, next) {
    const url = req.url;
    if(url === '/new_cluck') {
        res.locals.username ? next() : res.redirect('/sign_in');
    }
    next();
});

/* Knex */

// Exports client
module.exports = client; // not sure if this is actually needed

// New cluck
app.post('/new_cluck', (req, res) => {
    knex.('clucks')
    .insert({
        username: res.locals.username,
        content: res.locals.content,
        image_url: res.locals.image_url,
    });
});