var request = require('request');

module.exports.scrapPage = function scrap(cb) {
  var original = this.message.original;
  var uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
  var testUrl = original.match(uri_pattern),
      url = testUrl[0];

// can you get the data from https://api.github.com/users/arkeologen
    request({
      url: url,
      headers: {
        'User-Agent': 'Osler boy'
      }
    }, function (error, response, body) {
      console.log(error, response.statusCode);
      if (!error && response.statusCode == 200) {
        return cb(null, body);
      }

      return cb(null, 'We cannot find the data at the moment (' + response.statusCode + ')');
    })
};
