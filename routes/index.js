module.exports = function(app) {

    app.get('/', function(req, res){
        console.log(req.session.user);
        if(req.session.user && req.session.user.id) {
            res.redirect('/welcome');
        } else {
            res.render('index', { title: 'Express' });
        }
    });

    app.get('/welcome', function(req, res){
        console.log('welcome');
        res.render('welcome', { title: 'Express' });
    });
}
