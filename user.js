var debug = require("debug")("UserFacts");
var _ = require("underscore");
var Utils = require("superscript/lib/utils");
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:root@192.168.99.100:32768');

exports.save = function(key, value, cb) {
  console.log('hello world....', arguments)
  db.cypher({
    query: 'CREATE (n:Fact {key: {key}, value: {value}}) return n',
    params: {
      key: key,
      value: value
    }
  }, function (err, results) {
    if (err) return cb(err);
    var result = results[0];
    if (!result) {
      return cb(null, '');
    } else {
        return cb(null, result['n']);
    }
  });
}

exports.get = function(key, cb) {
  
  var userId = this.user.id;
  
  // FIXME: Add predicate logic w/ `userId`.
  db.cypher({
    query: 'MATCH n WHERE n.value = {value} RETURN n',
    params: {
      value: key
    }
  }, function(err, results) {
      if (err) return cb(err);
      var result = results[0];
      if (!result) {
        return cb(null, '');
      } else {
          return cb(null, result['n']);
      }
  });
  

  // var memory = this.user.memory;
  // var userId = this.user.id;

  // debug("getVar", key, userId);

  // memory.db.get({subject:key, predicate: userId}, function resultHandle(err, res){
  //   if (res && res.length != 0) {
  //     cb(err, res[0].object);
  //   } else {
  //     cb(err, null);
  //   }
  // });
}

exports.createUserFact = function(s,v,o,cb) {
  console.log(arguments);
  var subject = db.createNode({value: s});
  var object = db.createNode({value: o});

  subject.save(function() {
    object.save(function(e, node) {
      subject.createRelationshipTo(node, v, function() {
        return cb(null, '');
      })
    });
  });

  // console.log(arguments);
  //
  // if (s != "undefined" && v != "undefined" && o != "undefined") {
  //   this.user.memory.create(s,v,o,false, function(){
  //     cb(null,"");
  //   });
  // } else {
  //   debug("Possible Error with fact", this.message.raw);
  //   cb(null,"")
  // }
}


// What does my dad like to play?
exports.resolveUserFact = function(subject, verb, cb) {
  var subject = subject.replace(/\s/g,"_").toLowerCase();

  console.log("resolveUserFact", subject, verb);
  var memory = this.user.memory;
  memory.db.get({subject:subject, predicate:verb}, function(err, result){
    if (!_.isEmpty(result)) {
      cb(null, result[0].object);
    } else {
      memory.db.get({object:subject, predicate:verb}, function(err, result){
        if (!_.isEmpty(result)) {
          cb(null, result[0].subject);
        } else {
          cb(null,"");
        }
      });
    }
  });
}


// We check to see if we know the name in the message object
exports.known = function(bool, cb) {
  var memory = this.user.memory;
  var name = (this.message.names && !_.isEmpty(this.message.names)) ? this.message.names[0] : "";
  memory.db.get({subject:name.toLowerCase()}, function resultHandle(err, res1){
    memory.db.get({object:name.toLowerCase()}, function resultHandle(err, res2){
      if (_.isEmpty(res1) && _.isEmpty(res2)) {
        cb(null, (bool == "false") ? true : false)
      } else {
        cb(null, (bool == "true") ? true : false)
      }
    });
  });
}


exports.inTopic = function(topic, cb) {
  if (topic == this.user.currentTopic) {
    cb(null, "true");
  } else {
    cb(null, "false");
  }
}
