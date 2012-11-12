var express = require('express'),
	routes = require('./routes');

var app = express();

// Config

app.configure(function(){
    app.use(express.bodyParser());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

app.post('/signup', routes.users.signup);
app.post('/signin', routes.users.signin);
app.post('/signout', routes.users.signout);


app.get('/users/:id', routes.users.getUser);
app.get('/find/:username', routes.users.findUserByUsername);
app.put('/users/:id', routes.users.updateUser);

// Init

app.listen(port = process.env.PORT || 5000);