/**
 * parser
 */

define(() => {
  /**
   * takes a string of code
   * using regular expressions
   * 
   * @param {String} input code line
   */
  function tokenize (input) {
    return input.split('"')
      .map((x, i) => {
        if (i % 2 === 0) { // not string
          return x.replace(/\(/g, ' ( ')
            .replace(/\)/g, ' ) ');
        } else { // string
          return x.replace(/ /g, '`whitespace`'); // for whitespace in string
        }
      })
      .join('"')
      .trim()
      .split(/\s+/)
      .map(x => x.replace(/`whitespace`/g, " "));
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
        return parenthesize(input, list);
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

  return {
    parser: input => parenthesize(tokenize(input)),
    parenthesize,
    tokenize
  };
});
