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
app.put('/users/:id', routes.users.updateUser);
app.get('/find/:username', routes.users.findUserByUsername);

app.post('/lots', routes.lots.createLot);
app.get('/lots/:id', routes.lots.getLot);
app.put('/lots/:id', routes.lots.updateLot);
app.delete('/lots/:id', routes.lots.destroyLot);

app.post('/items', routes.items.createItem);
app.get('/items/:id', routes.items.getItem);
app.put('/items/:id', routes.items.updateItem);
app.delete('/items/:id', routes.items.destroyItem);

app.post('/follows', routes.follows.createFollow);
app.delete('/follows', routes.follows.destroyFollow);

app.post('/comments', routes.comments.createComment);


// Init

app.listen(port = process.env.PORT || 5000);