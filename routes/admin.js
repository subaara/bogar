module.exports = function(app) {
    app.get('/admin', function(req, res) {
        console.log('-------------------------------------')
        res.render('admin_dashboard', { title: 'Express' });   
    })
}