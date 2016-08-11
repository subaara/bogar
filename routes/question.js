module.exports = function(app) {
    
    app.post('add_qstn', function(req, res) {
        res.send('create a new qstn')
    });

    app.post('edit_qstn', function(req, res) {
        res.send('edit qstn')
    });

    app.post('delete_qstn', function(req, res) {
        res.send('delete qstn')
    });

        // app.post('qstn', function(req, res) {
        // res.render('qs');
        // });

        // app.post('addQuestion', function(req, res){
        // console.log('------- add question');
        // var s = req.body;
        // console.log(s.question, s.option_1, s.option_2, s.option_3, s.option_4, s.answer)
        // //insert into questions(question, option_1, option_2, option_3, option_4, answer) values('who is our pm?', 'subahs', 'chandru', 'bose', 'rahul', '4');
        // db.executeQuery('insert into questions(question, option_1, option_2, option_3, option_4, answer) values("'+ s.question +'", "'+ s.option_1 +'", "'+ s.option_2 +'", "'+ s.option_3 +'", "'+ s.option_4 +'", "'+ s.answer +'")', function(err, rows) {
        //   console.log(err)
        //   console.log(rows)
        //   res.send(rows);
        // });
        // });

        // app.post('editQuestion', function(req, res){
        // console.log('------- edit question');
        // res.send('ok');
        // });

        // app.post('deleteQuestion', function(req, res){
        // console.log('------- delete question');
        // res.send('ok');
        // });
}