/**
 * takes a string of code
 * with regular expressions
 * 
 * @param {String} input code line
 */
function tokenize (input) {
  return input.replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .trim()
    .split(/\s+/);
}

/**
 * takes to tokens
 * 
 * @param {String} input code line
 * @param {[Object]} list tokens
 */
function parenthesize (input, list) {
  if (list === undefined) { // initialization
    return parenthesize(input, []); // create a new children array
  } else {
    const token = input.shift(); // get a new token

    if (token === undefined) { // out of the recursive function
      return list.pop(); // return tokens object
    } else if (token === '(') { // open parenthesize
      list.push(parenthesize(input, [])); // create a new children array
      return parenthesize(input, list); // 
    } else if (token === ')') { // close parenthesize
      return list; // close children array
    } else { // other tokens
      return parenthesize(input, list.concat(categorize(token))); // categorization
    }
  }
}

/**
 * categoraization tokens
 * 
 * @param {String} input token
 */
function categorize (input) {
  if (!Number.isNaN(Number.parseFloat(input))) { // number
    return { type: 'literal', value: parseFloat(input) };
  } else if (input[0] === '"' && input.slice(-1) === '"') { // string
    return { type: 'literal', value: input.slice(1, -1) };
  } else { // identifier
    return { type: 'identifier', value: input };
  }
}

/* tools */

/**
 * flow function
 * 
 * @param {[Function]} cbs callbacks
 */
function flow (...cbs) {
  return (...data) => {
    for (let i = 0; i < cbs.length; i++) {
      data = callFunction(cbs[i], data);
    }
  };
}

function callFunction (cb, args) {
  if (cb instanceof Function) {
    console.log('>', cb, cb(args));
    return cb.apply(null, args);
  } else {
    console.error('it is not a function');
  }
}
