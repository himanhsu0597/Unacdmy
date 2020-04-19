var slice = Array.prototype.slice;


// Helper methods & classes

var P = 1 / Math.E;

function randomLevel() {
  var level = 1;
  while (Math.random() < P) {
    level += 1;
  }
  return level < 32 ? level : 32;
};

function Level(next, span) {
  this.next = next;
  this.span = span;
};

// value is score, sorted
// key is obj, unique
function Node(level, key, value) {
  this.key = key;
  this.value = value;
  this.next = new Array(level);
  this.prev = null;
};

function Entry(key, value) {
  this.key = key;
  this.value = value;
};


// Constructor

var Z = function (options) {
  if (!(this instanceof Z)) {
    return new Z();
  }
  options || (options = {});
  this._unique = !!options.unique;
  this.empty();
};


// Class Methods



// Public methods

Z.prototype.add = function (key, value) {
  var current;

  if (key === '__proto__') {
    throw new Error('invalid key __proto__');
  }

  if (value == null) {
    return this.rem(key);
  }

  current = this._map[key];

  if (current !== undefined) {
    if (value === current) {
      return current;
    }
    this._remove(key, current);
  }

  var node = this._insert(key, value);
  if (!node) {
    current === undefined || this._insert(key, current);
    // TODO: can we defer _remove until after insert?
    throw new Error('unique constraint violated');
  }

  this._map[key] = value;
  return current === undefined ? null : current;
};




Z.prototype.empty = function () {
  this.length = 0;
  this._level = 1;
  this._map = Object.create(null);
  this._head = new Node(32, null, 0);
  this._tail = null;

  for (var i = 0; i < 32; i += 1) {
    // hrm
    this._head.next[i] = new Level(null, 0);
  }
};


Z.prototype.get = function (key) {
  // Alias for
  return this.score(key);
};


Z.prototype.has = function (key) {
  return this._map[key] !== undefined;
};


Z.prototype.incrBy = function (increment, key) {
 

  var score = this.score(key);

  if (score) {
    this.add(key, score + increment);
    return score + increment;
  }

  this.add(key, increment);
  return increment;
};





Z.prototype.keys = function () {
  if (!this.length) {
    return [];
  }

  var i;
  var array = new Array(this.length);
  var node = this._head.next[0].next;

  for (i = 0; node; node = node.next[0].next) {
    array[i] = node.key;
    i += 1;
  }

  return array;
};


Z.prototype.range = function (start, stop, options) {
  // Parameters:
  //   start
  //     inclusive
  //   stop
  //     inclusive
  //   options (optional)
  //     withScores (optional, default to false)
  //
  // Return:
  //   an array

  if (this.length === 0) {
    return [];
  }

  if (start == null) {
    start = 0;
  } else if (start < 0) {
    start = Math.max(this.length + start, 0);
  }

  if (stop == null) {
    stop = this.length - 1;
  } else if (stop < 0) {
    stop = this.length + stop;
  }

  if (start > stop || start >= this.length) {
    return [];
  }

  if (stop >= this.length) {
    stop = this.length - 1;
  }

  if (typeof options !== 'object') {
    options = {
      withScores: false,
    };
  }

  var i = 0;
  var length = stop - start + 1;
  try {
    var result = new Array(length);
  } catch(e) {
    console.log('start', start);
    console.log('stop', stop);
    console.log('Invalid length', length);
    throw e;
  }

  var node = start > 0 ? this._get(start) : this._head.next[0].next;

  if (options.withScores) {
    for (; length--; node = node.next[0].next) {
      result[i] = [node.key, node.value];
      i += 1;
    }
  } else {
    for (; length--; node = node.next[0].next) {
      result[i] = node.key;
      i += 1;
    }
  }

  return result;
};





Z.prototype.rank = function (key) {
  // Rank of key, ordered by value.
  //
  // Return
  //   integer
  //     if member exists
  ///  null
  //     if member does not exist

  var value = this._map[key];

  if (value === undefined) {
    return null;
  }

  var i;
  var node = this._head;
  var next = null;
  var rank = -1;

  for (i = this._level - 1; i >= 0; i -= 1) {
    while ((next = node.next[i].next) && (next.value < value || (next.value === value && next.key <= key))) {
      rank += node.next[i].span;
      node = next;
    }
    if (node.key && node.key === key) {
      return rank;
    }
  }

  return null;
};











Z.prototype.score = function (member) {
  // Return
  //   number, the score of member in the sorted set.
  //   null, if member does not exist in the sorted set.
  var score = this._map[member];
  return score === undefined ? null : score;
};


Z.prototype.set = function (key, value) {
  // Alias for
  return this.add(key, value);
};


Z.prototype.slice = function (start, end, options) {
  // Almost alias for range. Only difference is that
  // the end is exclusive i.e. not included in the range.
  if (typeof end === 'number' && end !== 0) {
    end -= 1;
  }
  return this.range(start, end, options);
};


Z.prototype.toArray = function (options) {
  // The whole set, ordered from smallest to largest.
  //
  // Parameters
  //   options (optional)
  //     withScores (optional, default false)
  //       bool

  if (!this.length) {
    return [];
  }

  if (typeof options !== 'object') {
    options = {
      withScores: false,
    };
  }

  var i;
  var array = new Array(this.length);
  var node = this._head.next[0].next;

  if (options.withScores) {
    for (i = 0; node; node = node.next[0].next) {
      array[i] = [node.key, node.value];
      i += 1;
    }
  } else {
    for (i = 0; node; node = node.next[0].next) {
      array[i] = node.key;
      i += 1;
    }
  }

  return array;
};


Z.prototype.values = function () {
  // Return values as an array, the smallest value first.

  if (!this.length) {
    return [];
  }

  var i;
  var array = new Array(this.length);
  var node = this._head.next[0].next;

  for (i = 0; node; node = node.next[0].next) {
    array[i] = node.value;
    i += 1;
  }

  return array;
};





Z.prototype._get = function (index) {
  // Find and return the node at index.
  // Return null if not found.
  //
  // TODO: optimize when index is less than log(N) from the end
  var i;
  var node = this._head;
  var distance = -1;

  for (i = this._level - 1; i >= 0; i -= 1) {
    while (node.next[i].next && (distance + node.next[i].span) <= index) {
      distance += node.next[i].span;
      node = node.next[i].next;
    }
    if (distance === index) {
      return node;
    }
  }
  return null;
};


Z.prototype._insert = function (key, value) {
  // precondition: does not already have key
  // in unique mode, returns null if the value already exists
  var update = new Array(32);
  var rank = new Array(32);
  var node = this._head;
  var next = null;
  var i;

  for (i = this._level - 1; i >= 0; i -= 1) {
    rank[i] = (i === (this._level - 1) ? 0 : rank[i + 1]);
    // TODO: optimize some more?
    while ((next = node.next[i].next) && next.value <= value) {
      if (next.value === value) {
        if (this._unique) {
          return null;
        }
        if (next.key >= key) {
          break;
        }
      }
      rank[i] += node.next[i].span;
      node = next;
    }
    if (this._unique && node.value === value) {
      return null;
    }
    update[i] = node;
  }

  if (this._unique && node.value === value) {
    return null;
  }

  var level = randomLevel();
  if (level > this._level) {
    // TODO: optimize
    for (i = this._level; i < level; i += 1) {
      rank[i] = 0;
      update[i] = this._head;
      update[i].next[i].span = this.length;
    }
    this._level = level;
  }

  node = new Node(level, key, value);
  for (i = 0; i < level; i += 1) {
    node.next[i] = new Level(update[i].next[i].next, update[i].next[i].span - (rank[0] - rank[i]));
    update[i].next[i].next = node;
    update[i].next[i].span = (rank[0] - rank[i]) + 1;
  }

  for (i = level; i < this._level; i += 1) {
    update[i].next[i].span++;
  }

  node.prev = (update[0] === this._head) ? null : update[0];
  if (node.next[0].next) {
    node.next[0].next.prev = node;
  } else {
    this._tail = node;
  }

  this.length += 1;
  return node;
};








module.exports = Z;