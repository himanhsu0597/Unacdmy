var PORT = 6379;


var sys = require("sys");

var enable_debug = true;

var store = require("./ds");

var SortedSet = require('./zs');
var z = new SortedSet();
//z.add("ss",5); 
  var eol = "\r\n";

  var EMPTY_VALUE = {};
  var E_VALUE = "Operation against a key holding the wrong kind of value";



  function Command(line) {

    function parseCommand(s) {
      var cmd = "";
      for(var idx = 0; idx < s.length; ++idx) {
        var chr = s[idx];
        if(chr == " " || chr == "\r" || chr == "\n") {
          return cmd;
        }
        cmd += chr;
      }
      return cmd;
    }

    function parseArgs(s) {
      var args = [];
      var arg = "";
      var argidx = 0;
      for(var idx = 0; idx < s.length; ++idx) {
        var chr = s[idx];
        if(chr == " " || chr == "\r" || chr == "\n") {
          if(arg) {
            args.push(arg);
            argidx = argidx + 1;
            arg = "";
          }
        } else {
          arg += chr;
        }
      }
      return args;
    }

    this.cmd = parseCommand(line).toLowerCase();
    console.log(this.cmd);
    this.args = parseArgs(line);
    console.log(this.args);

    var that = this;

    var callbacks = {
      // keep sorted alphabetically
      // list-related functions at the end
      dbsize: {
        callback: function() {
          debug("received DBSIZE command");
          var size = store.dbsize();
          console.log(":" + size);
        }
      },

      del: {
        callback:function() {
          debug("received DEL command");
          if(that.args.length > 2) {
            var keys = that.args.slice(1);
            var deleted = store.del(keys);
            reply.number(deleted);
          } else {
            var key = that.args[1];
            if(store.has(key)) {
              store.del(key);
              reply.bool(true);
            } else {
              reply.bool(false);
            }
          }
        }
      },

      flushdb: {
        callback: function() {
          debug("received FLUSHDB command");
          store.flushdb();
          console.log("done");
        }
      },

      get: {
        callback: function() {
          debug("received GET command");
          console.log(cmd.args);
          var key = cmd.args[1];
          if(store.has(key)) {
            var value = store.get(key);
            console.log(value);
            if(EMPTY_VALUE === value) {
              // empty value
              console.log("");
            } else {
              console.log(value);
            }
          } else { // not found
            console.log("data not found");
          }
        }
      },

      getset: {
        bulk: true,
        callback: function() {
          debug("received GETSET command");
          var key = that.args[1];
          var value = that.data;
          var old_value = store.get(key);
          store.set(key, value);
          if(old_value === null) {
           console.log("data not found");
          } else {
            console.log("$" + old_value.length);
           console.log(old_value);
          }
        }
      },


      exists: {
        callback: function() {
          debug("received EXISTS command");
          var key = that.args[1];
          if(store.has(key)) {
            reply.bool(true);
          } else {
            reply.bool(false);
          }
        }
      },


      keys: {
        callback: function() {
          debug("received KEYS command");
          var pattern = that.args[1] || '*';
          var result = store.keys(pattern).join(" ");
          reply.bulk(result);
        }
      },





      ping: {
        callback: function() {
          debug("received PING command");
          reply.send("+PONG");
        }
      },

      quit: {
        callback: function() {
          debug("received QUIT command");
          
        }
      },


      select: {
        callback: function() {
          debug("received SELECT command");
          var index = that.args[1];
          store.select(index);
          console.log("done");
        }
      },

      set: {
        bulk: true,
        callback: function() {
          debug("received SET command");
          var key = cmd.args[1];
          var value = cmd.args[2] || EMPTY_VALUE;
          store.set(key, value);
          console.log("done");
        }
      },



      randomkey: {
        callback: function() {
          debug("received RANDOMKEY command");
          var value = store.randomkey();
          reply.status(value);
        }
      },


     
      // sorted sets
      zadd: {
        bulk: true,
        callback: function() {
          var key = cmd.args[1];
          var score = cmd.args[2];
          var member = cmd.args[3];
          var result = z.add(member,score);
          if(result === false) {
            console.log("s1",E_VALUE);
          } else {
            console.log("s2",(!!result));
          }
        }
      },

      // storage
      save: {
        callback: function() {
          store.save();
          console.log("done");
        }
      },

      // for debugging
      dump: {
        callback: function() {
          debug("received DUMP command");
          sys.print(store.dump() + eol);
          console.log("done");
        }
      },

    };

    this.is_inline = function() {
      if(typeof callbacks[this.cmd] === "undefined") {
        return true; // unkown cmds are inline
      }

      return !callbacks[this.cmd].bulk;
    };

    this.setData = function(data) {
      this.data = data.trim();
    },



    this.exec = function() {
      console.log(cmd.args[0]);
      debug("in exec '" + this.cmd + "'");
      if(callbacks[cmd.args[0].toLowerCase()]) {
        callbacks[cmd.args[0].toLowerCase()].callback(this.args);
      } else {
        reply.error("unknown command");
      }
    };

    return this;
  }

  

  function debug(s) {
    if(enable_debug && s !== null) {
     console.log(s.toString().substr(0,128) + eol);
    }
  }

  // for reading requests

  function adjustBuffer(buffer) {
    return buffer.substr(buffer.indexOf(eol) + 2)
  }

  function parseData(s) {
    var start = s.indexOf(eol) + 2;
    return s.substring(start, s.indexOf(eol, start));
  }

  function string_count(haystack, needle) {
    var regex = new RegExp(needle, "g");
    var result = haystack.match(regex);
    if(result) {
     return result.length - 1;
    } else {
     return 0;
    }
  }

cmd = Command("SET a 3 \n");
 cmd.setData("SET a 3");
cmd.exec();
//cmd = Command("SET b 6 \n");
// cmd.setData("SET a 3");
 //cmd.exec();
 cmd = Command("dbsize \n");

 cmd.exec();

  cmd = Command("save \n");

 cmd.exec();

 cmd = Command("ZADD myzset 1 one \n");

 cmd.exec();

cmd = Command("ZADD myzset 2 two \n");

cmd.exec();

cmd = Command("ZADD myzset 3 three \n");

cmd.exec();


cmd = Command("ZADD myzset 3 four \n");

cmd.exec();

console.log(z.range(0, 4));

console.log(z.rank("four"));



//server.listen(PORT, "localhost");