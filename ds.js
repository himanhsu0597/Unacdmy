var fs = require("fs");

var path="data.jrdb";
try {
  const data = fs.readFileSync(path, 'utf8')
  stores=JSON.parse(data);
  current=stores.length-1;
} catch (err) {
  var stores = [];
var current = 0;
stores[current] = {};
}


var path="datattl.jrdb";
try {
  const data = fs.readFileSync(path, 'utf8')
  storesttl=JSON.parse(data);
  console.log(storesttl);
  
} catch (err) {
  var storesttl = {};


}





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

exports.has = function(key, dbindex) {
  dbindex = dbindex || current;
  return !!stores[dbindex][key];
};

exports.expire = function(key,value,dbindex) {
  console.log(key);
  console.log(stores);
  console.log("inside expire",value);
  storesttl[key] = value;
};



exports.save = function() {
 var store = stores;
 
  var filename = "data.jrdb";
  var data = JSON.stringify(store);
  fs.writeFileSync(filename, data);

  var filename = "datattl.jrdb";
  console.log(storesttl);
  
  fs.writeFileSync(filename, JSON.stringify(storesttl));
};



exports.set = function(key, value, dbindex) {
  dbindex = dbindex || current;
  console.log(dbindex);
  console.log(key);
  console.log(stores);
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
