/**
 * http://usejsdoc.org/
 */
var sf = require('node-salesforce');

var conn = new sf.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env. 
  // loginUrl : 'https://test.salesforce.com' 
});

exports.login = function(username, password, callback) {
	conn.login(username, password, function(err, userInfo) {
	  if (err) { return console.error(err); }
	  // Now you can get the access token and instance URL information. 
	  // Save them to establish connection next time. 
	  console.log(conn.accessToken);
	  console.log(conn.instanceUrl);
	  // logged in user property 
	  console.log("User ID: " + userInfo.id);
	  console.log("Org ID: " + userInfo.organizationId);
	  callback();
	  // ... 
	});
};

exports.accountQuery = function(queryString, callback) {
	var records = [];
	console.log('queryString '+queryString);
	conn.query(queryString, function(err, result) {
	  if (err) { return console.error(err); }
	  console.log("total : " + result.totalSize);
	  console.log("fetched : " + result.records.length);
	  callback(result);
//	  return result;
	});
};

exports.getAllStudent = function(callback) {
	var records = [];
	var stuentListQuery = 'select name, Marks__c from Student__c';
	conn.query(stuentListQuery, function(err, result) {
	  if (err) { return console.error(err); }
	  console.log("total : " + result.totalSize);
	  console.log("fetched : " + result.records.length);
	  callback(result);
	});
};

var getStudentInfo = function(studentId, callback) {
	var records = [];
	var stuentQuery = 'select Id, name, Marks__c from Student__c where StudentId__c = \''+studentId+'\'';
	console.log('queryString '+stuentQuery);
	conn.query(stuentQuery, function(err, result) {
	  if (err) { return console.error(err); }
	  console.log("total : " + result.totalSize);
	  console.log("fetched : " + result.records.length);
	  callback(result);
//	  return result;
	});
};

exports.getStudentInfo = getStudentInfo;

var getStudentInfoBySfId = function(sfId, callback) {
	var records = [];
	var stuentQuery = 'select Id, StudentId__c, name, Marks__c from Student__c where Id = \''+sfId+'\'';
	console.log('queryString '+stuentQuery);
	conn.query(stuentQuery, function(err, result) {
	  if (err) { return console.error(err); }
	  console.log("total : " + result.totalSize);
	  console.log("fetched : " + result.records.length);
	  callback(result);
//	  return result;
	});
};

exports.createStudent = function(sname, marks, callback){
	console.log('sname '+sname);
	conn.sobject("Student__c").create({ Name : sname, Marks__c : marks }, function(err, ret) {
	  if (err || !ret.success) { return console.error(err, ret); }
	  console.log("Created record id : " + ret.id);
	  getStudentInfoBySfId(ret.id, function(response){
		  callback(response);
	  });
	});
};

exports.updateStudent = function(studentId, studentName, marks, callback) {
	getStudentInfo(studentId, function(response) {
		console.log('r '+response.records);
		if(response.records.length === 0){
			console.log('right');
			callback(response);
		} else {
			var sfId = response.records[0].Id;
			conn.sobject("Student__c").update({ Id : sfId, Name : studentName, Marks__c : marks }, function(err, ret) {
				  if (err || !ret.success) { return console.error(err, ret); }
				  console.log("updated record id : " + ret.id);
				  callback(ret);
				});
		}
	});
};

exports.deleteStudent = function(studentId, callback) {
	getStudentInfo(studentId, function(response){
		if(response.records[0].id === undefined){
			callback('{error : Invalid id');
		} else {
			var studentSfId = response.records[0].Id;
			conn.sobject("Student__c").del(studentSfId, function(err, ret) {
				  if (err || !ret.success) { return console.error(err, ret); }
				  console.log("Created record id : " + ret.id);
				  callback(ret);
			});
		}
		
	});
};



exports.accountUpdate = function() {
	// 
	// 
	conn.sobject("Account").update({ 
	  Id : '0017000000hOMChAAO',
	  Name : 'Updated Account #1'
	}, function(err, ret) {
	  if (err || !ret.success) { return console.error(err, ret); }
	  console.log('Updated Successfully : ' + ret.id);
	  // ... 
	});
	// 
	// 
	conn.sobject("Account").update([
	  { Id : '0017000000hOMChAAO', Name : 'Updated Account #1' },
	  { Id : '0017000000iKOZTAA4', Name : 'Updated Account #2' }
	],
	function(err, rets) {
	  if (err) { return console.error(err); }
	  for (var i=0; i < rets.length; i++) {
	    if (rets[i].success) {
	      console.log("Updated Successfully : " + rets[i].id);
	    }
	  }
	});
};

exports.accountDelete = function() {
	// 
	// 
	conn.sobject("Account").destroy('0017000000hOMChAAO', function(err, ret) {
	  if (err || !ret.success) { return console.error(err, ret); }
	  console.log('Deleted Successfully : ' + ret.id);
	});
	// 
	// 
//	conn.sobject("Account").del([ // synonym of "destroy" 
//	  '0017000000hOMChAAO',
//	  '0017000000iKOZTAA4'
//	]), 
//	function(err, rets) {
//	  if (err) { return console.error(err); }
//	  for (var i=0; i < rets.length; i++) {
//	    if (rets[i].success) {
//	      console.log("Deleted Successfully : " + rets[i].id);
//	    }
//	  }
//	});
};


