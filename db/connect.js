var mysql = require('mysql');
var credentials = {
  host     : 'localhost',
  user     : 'root',
  password : 'appvance123$',
  database : 'student_exam'
}


exports.executeQuery = function(query, callback) {
    console.log(query);
    var connection =  mysql.createConnection(credentials);
    connection.connect();
    connection.query(query, function(err, rows, fields) {
        err ? callback(err) : callback(err, rows, fields)
    });
    connection.end();
}