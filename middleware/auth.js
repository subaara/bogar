exports.autenticate = function(req, res, next) {
    var request = req.url.substring(req.url.indexOf('/')+1);
    console.log(req.session.user);
    if(request != '' && request.indexOf('login') == -1 && !req.session.user) {
        res.redirect('/'); //need authentication; 
    } else {
        next();
    }
}