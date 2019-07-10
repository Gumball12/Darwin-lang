/**
 * interpreter
 */

define(() => {
  /**
   * commands
   */
  const command = {
    /**
     * lambda expression
     * 
     * @param {[Object]} input parsing array
     * @param {Scope} scope scope object
     */
    lambda (input, scope) {
      return (...args) => { // invoke lambda arguments
        const _scope = input[0].reduce((r, x, i) => { // create a new scope (lambda)
          r[x.value] = args[i]; // set variables into the lambda scope
          return r;
        }, { });
  
        return interpret(input[1], new Scope(_scope, scope)); // invoke function
      }; // return lambda function
    },

    /**
     * set a variable
     * 
     * @param {[Object]} input parsing array
     * @param {Scope} scope scope
     */
    set (input, scope) {
      if (input[1] instanceof Array && input[1][input.length - 1].value === 'lambda') { // set lambda
        scope.scope[input[0].value] = command.lambda(input[1], scope); // into the scope scope
        return '/* lambda */';
      } else { // set literal
        const setValue = input[1].value;
        scope.scope[input[0].value] = setValue; // into the scope
        return setValue;
      }
    },

    /**
     * conditional (true-only)
     * 
     * @param {[Object]} input parsing array
     * @param {Scope} scope scope
     */
    cond (input, scope) {
      return interpret(input[0], scope) ? interpret(input[1], scope) : undefined;
    }
  };
  
  /**
   * pre-defined functions
   */
  const functions = {
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
   * Scope class
   */
  class Scope {
    /**
     * constructor
     * 
     * @param {*} scope 
     * @param {Scope} parent parent scope
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
        return this.parent.get(identifier); // get the identifier in the parent scope
      }
    }
  }
  
  /**
   * interpretation
   * 
   * @param {Object} input each parsing object
   * @param {Scope} scope scope object
   */
  function interpret (input, scope) {
    if (scope === undefined) {
      return interpret(input, new Scope(functions));
    } else if (input instanceof Array) { // if has parenthesis
      return interpretList(input, scope);
    } else if (input.type === 'identifier') { // if type is identifier
      return scope.get(input.value); // get the identifier from the scope object
    } else {
      return input.value; // literal
    }
  }
  
  /**
   * interpretation (for parsing arrays)
   * 
   * @param {[Object]} input parsing array
   * @param {Scope} scope scope object
   */
  function interpretList (input, scope) {
    if (input.length > 0 && input[input.length - 1].value in command) { // if input[last] is the 'command'
      return command[input[input.length - 1].value](input, scope);
    } else {
      const list = input.map(x => interpret(x, scope));
  
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
