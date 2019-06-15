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
          r[x.value] = args[i]; // set variables into the lambda scope
          return r;
        }, { });
  
        return interpret(input[1], new Context(scope, context)); // invoke function
      }; // return lambda function
    },

    /**
     * set a variable
     * 
     * @param {[Object]} input parsing array
     * @param {Context} context context
     */
    set (input, context) {
      if (input[1] instanceof Array && input[1][input.length - 1].value === 'lambda') { // set lambda
        context.scope[input[0].value] = special.lambda(input[1], context); // into the context scope
        return '/* lambda */';
      } else { // set literal
        const setValue = input[1].value;
        context.scope[input[0].value] = setValue; // into the context scope
        return setValue;
      }
    },

    /**
     * conditional (true-only)
     * 
     * @param {[Object]} input parsing array
     * @param {Context} context context
     */
    cond (input, context) {
      return interpret(input[0], context) ? interpret(input[1], context) : undefined;
    }
  };
  
  /**
   * libraries (pre-defined functions)
   */
  const library = {
    /**
     * object to the console
     * 
     * @param {*} input 
     */
    print (input) {
      console.log(input);
      return input;
    },
    
    /**
     * and operation
     * 
     * @param  {...any} inputs 
     */
    and (...inputs) {
      return Number(inputs.reduce((r, v) => r && Boolean(v), inputs[0]));
    },

    /**
     * or operation
     * 
     * @param  {...any} inputs 
     */
    or (...inputs) {
      return Number(inputs.reduce((r, v) => r || Boolean(v), inputs[0]));
    },

    /**
     * equal operation
     * 
     * @param  {...any} inputs 
     */
    eq (...inputs) {
      return Number(inputs.reduce((r, v) => {
        r.isEqual = r.value === v;
        return r;
      }, { isEqual: true, value: inputs[0] }).isEqual);
    },

    /**
     * not operation
     * 
     * @param {*} input 
     */
    not (input) {
      return Number(!input)
    },

    /**
     * lt(<) operation
     * 
     * @param {*} a 
     * @param {*} b 
     */
    lt (a, b) {
      return Number(a < b);
    },

    /**
     * gt(>) operation
     * 
     * @param {*} a 
     * @param {*} b 
     */
    gt (a, b) {
      return Number(a > b);
    },

    /**
     * le(<=) operation
     * 
     * @param {*} a 
     * @param {*} b 
     */
    le (a, b) {
      return Number(a <= b);
    },

    /**
     * ge(>=) operation
     * 
     * @param {*} a 
     * @param {*} b 
     */
    ge (a, b) {
      return Number(a >= b);
    },

    /**
     * add operation
     * 
     * @param  {...any} inputs 
     */
    add (...inputs) {
      return inputs.reduce((r, v) => r + v, 0);
    },

    /**
     * sub operation
     * 
     * @param {*} a first operand
     * @param {*} b second operand
     */
    sub (a, b) {
      return a - b;
    },

    /**
     * mul operation
     * 
     * @param  {...any} inputs 
     */
    mul (...inputs) {
      return inputs.reduce((r, v) => r * v, 1);
    },

    /**
     * div operation (a / b)
     * 
     * @param {*} a first operand
     * @param {*} b second operand
     */
    div (a, b) {
      console.log(a, b, a / b);
      return a / b;
    },

    /**
     * mod operation (a % b)
     * 
     * @param {*} a first operand
     * @param {*} b second operand
     */
    mod (a, b) {
      return a % b;
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
    console.log('interpret', input, context);
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
    console.log('interpretList', input, context);
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
