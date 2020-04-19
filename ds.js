var stores = [];
var current = 0;
stores[current] = {};

exports.dbsize = function() {
  var size = 0;
  var store = stores[current];
  for(var key in store) {
    if(store.hasOwnProperty(key)) {
      size = size + 1;
    }
  }
  return size;
};

exports.dump = function() {
  return JSON.stringify(stores);
};

exports.flushdb = function() {
  stores[current] = {};
};

exports.get = function(key) {
  //console.log(key);
  console.log(stores);
  return stores[current][key] || null;
};


exports.save = function() {
 var store = stores;
  var fs = require("fs");
  var filename = "data.jrdb";
  var data = JSON.stringify(store);
  fs.writeFileSync(filename, data);
};



exports.set = function(key, value, dbindex) {
  dbindex = dbindex || current;
  stores[dbindex][key] = value;
};


exports.is_array = is_array;



function is_array(a) {
  return (a &&
    typeof a === 'object' &&
    a.constructor === Array);
}

function is_set(s) {
  if(is_array(s)) {
    return false;
  }

  return (s !== null && typeof s === 'object')
}
