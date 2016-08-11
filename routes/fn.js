var request = require("request");
module.exports = function(app) {
    
    app.get('/fn', function(req, res) {
      res.render('fn');
    });

    app.post('/fn', function(req, res){
        var i = 0;
        console.log(req.body.url);
        var intervaFuc = setInterval(function() {
            console.log(i++)
        },1)
        request({
          // uri: "https://en.wikipedia.org/wiki/Sachin_Tendulkar",
          uri: req.body.url
        }, function(error, response, body) {
          // console.log(body);
          console.log('-----------------')
          console.log(i++)
          clearInterval(intervaFuc);
          res.render('welcome', {name: 'jaya vel subramani', response: response, body: body})
        });
    });
}