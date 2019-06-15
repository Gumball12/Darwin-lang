/**
 * spacial keywords
 */
const special = {
  /**
   * lambda expression
   * 
   * @param {[Object]} input parsing array
   * @param {Context} context context object
   */
  lambda (input, context) {
    return (...args) => { // invoke lambda arguments
      const scope = input[1].reduce((r, x, i) => { // create a new scope (lambda)
        r[x.value] = args[i];
        return r;
      }, { });

      return interpret(input[2], new Context(scope, context));
    };
  }
};

/**
 * libraries (pre-defined functions)
 */
const library = {
  /**
   * object to the console
   * 
   * @param {*} input write object
   */
  console (input) {
    console.log(input);
    return input;
  }
};

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

/**
 * Context class
 */
class Context {
  /**
   * constructor
   * 
   * @param {*} scope 
   * @param {Context} parent parent context
   */
  constructor (scope, parent) {
    this.scope = scope;
    this.parent = parent;
  }

  get (identifier) {
    if (identifier in this.scope) { // this scope
      return this.scope[identifier]; // get the identifier in this scope
    } else if (this.parent !== undefined) { // has the static-link (static-ancestors)
      return this.parent.get(identifier); // get the identifier in the parent context
    }
  }
}

/**
 * interpretation
 * 
 * @param {Object} input each parsing object
 * @param {Context} context context object
 */
function interpret (input, context) {
  if (context === undefined) {
    return interpret(input, new Context(library));
  } else if (input instanceof Array) { // if has parenthesis
    return interpretList(input, context);
  } else if (input.type === 'identifier') { // if type is identifier
    return context.get(input.value); // get the identifier from the context object
  } else {
    return input.value; // literal
  }
}

/**
 * interpretation (for parsing arrays)
 * 
 * @param {[Object]} input parsing array
 * @param {Context} context context object
 */
function interpretList (input, context) {
  if (input.length > 0 && input[0].value in special) { // if input[0] is the 'special-keyword'
    return special[input[0].value](input, context);
  } else {
    const list = input.map(x => interpret(x, context));

    if (list[0] instanceof Function) { // list is an invocation?
      return list[0].apply(undefined, list.slice(1)); // call the lambda with lambda arguments
    } else {
      return list;
    }
  }
}
