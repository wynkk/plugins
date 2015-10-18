module.exports.canEat = function(item, cb) {
    console.log(this.user.__history__.topic);
    // James can only eat:
    var eatables = [ 'cpu', 'mouse', 'keyboard', 'ipad', 
                    'chicks', 'donuts', 'soap'];
                    
    if (eatables.indexOf(item.toString().toLowerCase()) <= -1) {
        return cb(null, 'No!');
    }
    
    return cb(null, 'Yes, I do.');
};

module.exports.lastTopic = function lastTopic(cb) {
    // Find last topic name.
    var topics = this.user.__history__.topic;
    var topic = topics.length == 0 ? 'nothing' : topics[topics.length - 1];
    return cb(null, 'We were talking about ' + topic);
};