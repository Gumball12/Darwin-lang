/**
 * interpreter
 */

define(() => {
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
        const scope = input[0].reduce((r, x, i) => { // create a new scope (lambda)
          r[x.value] = args[i];
          return r;
        }, { });
  
        return interpret(input[1], new Context(scope, context));
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
    print (input) {
      console.log(input);
      return input;
    }
  };
  
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
  
    /**
     * get identifier
     * 
     * @param {String} identifier 
     */
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
    if (input.length > 0 && input[input.length - 1].value in special) { // if input[last] is the 'special-keyword'
      return special[input[input.length - 1].value](input, context);
    } else {
      const list = input.map(x => interpret(x, context));
  
      if (list[list.length - 1] instanceof Function) { // list is an invocation?
        return list[list.length - 1].apply(undefined, list.slice(0, -1)); // call the lambda with lambda arguments
      } else {
        return list;
      }
    }
  }

  return {
    interpret
  };
});
