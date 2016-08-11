var db = require('../db/connect.js');

module.exports = function(app) {

  app.post('/createUser', function(req, res) {
      // username password role mail_id
  });

  app.post('/login', function(req, res){
    var status = false;
    db.executeQuery('call validate_login("'+ req.body.username +'", "'+ req.body.password +'")', function(err, rows, fields) {
      if(!err && rows[0][0]) {
        req.session.user = {
          id: rows[0][0].user_id,
          username: rows[0][0].username,
          id: rows[0][0].user_id,
        }
        status = true;
      }
      res.send({ status: status });
    });
  });

  app.get('/logout', function(req, res) {
    req.session.destroy();
    req.render('/');
  });
}