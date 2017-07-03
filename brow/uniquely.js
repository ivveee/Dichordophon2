	var un = require('uniq');


module.exports = function(f){

var h = f.split(',');


var unh = un(h);

return unh;
}