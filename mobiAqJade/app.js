
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , sfConnection = require('./actions/sfconnection');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
	})); 
app.use(express.json());  
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/listUsers', function(req, res){
	console.log('hi');
	sfConnection.login('a.qmansuri+1@gmail.com','appirio123RktIjjhLckbQd4gvzv5jCb1W', function(result){
		console.log('successful'+result);
		sfConnection.getAllStudent(function(queryResp){
			console.log('qr - '+queryResp);
			res.end('done'+JSON.stringify(queryResp.records));
		});
		
	});
//	console.log('bye');
});

app.get('/studentInfo', function(req, res){
	console.log('p');
	sfConnection.login('a.qmansuri+1@gmail.com', 'appirio123RktIjjhLckbQd4gvzv5jCb1W', function(result){
		console.log('lp '+req.query.id);
		var studentId = req.query.id;
		/**
		sfConnection.accountQuery(stuentQuery, function(queryResp){
			console.log('qr - '+queryResp);
			res.end('done'+JSON.stringify(queryResp.records));
		});
		**/
		sfConnection.getStudentInfo(studentId, function(queryResp){
			console.log('qr - '+JSON.stringify(queryResp.records[0]));
			res.end('done'+JSON.stringify(queryResp.records[0]));
		});
		
	});
});

//body param = name =<name> , marks=<marks>
app.post('/createStudent', function(req, res) {
	sfConnection.login('a.qmansuri+1@gmail.com', 'appirio123RktIjjhLckbQd4gvzv5jCb1W', function(result){
		console.log('lp '+req.query.id);
		var studentName = req.body.name;
		var marks = req.body.marks;
		console.log('studentName'+studentName);
		sfConnection.createStudent(studentName, marks, function(response){
			console.log('response '+response);
			res.end('done'+JSON.stringify(response));
		});
	});
});

//update body param -- studentId=<studentId>, studentName=<studentName>, marks=<marks>
app.put('/updateStudent', function (req, res){
	sfConnection.login('a.qmansuri+1@gmail.com', 'appirio123RktIjjhLckbQd4gvzv5jCb1W', function(result){
		var studentId = req.body.studentId;
		var studentName = req.body.studentName;
		var marks = req.body.marks;
		sfConnection.updateStudent(studentId, studentName, marks, function(response){
			console.log('response '+response);
			res.end('done'+JSON.stringify(response));
		});
	});
});

//query param -- id=<studentId>
app.del('/deleteStudent', function (req, res){
	sfConnection.login('a.qmansuri+1@gmail.com', 'appirio123RktIjjhLckbQd4gvzv5jCb1W', function(result){
		console.log('lp '+req.query.id);
		var studentId = req.query.id; 
		sfConnection.deleteStudent(studentId, function(response){
			console.log('response '+response);
			res.end('done'+JSON.stringify(response));
		});
	});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
