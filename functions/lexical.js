/* global variables */

// char types
const types = {
  LETTER: 0,
  DIGIT: 1,
  UNKNOWN: 99
};

// tokens
const tokens = {
  INT_LIT: 10,
  IDENT: 11,
  EOF: -1,

  ASSIGN_OP: 20,
  ADD_OP: 21,
  SUB_OP: 22,
  MULT_OP: 23,
  DIV_OP: 24,
  LEFT_PAREN: 25,
  RIGHT_PAREN: 26
};

// look-up table
const lookupTable = {
  '(': tokens.LEFT_PAREN,
  ')': tokens.RIGHT_PAREN,
  '+': tokens.ADD_OP,
  '-': tokens.SUB_OP,
  '*': tokens.MULT_OP,
  '/': tokens.DIV_OP,
  undefined: tokens.EOF
};

// mutable states
const states = {
  nextChar: '',
  nextCharIndex: 0,
  code: ''
};

/* functions */

/**
 * lexical analyzer
 * 
 * @param {String} code code line
 */
function index (code) {
  states.code = code;
  lex(getChar()); // lexical analyzer
}

/**
 * get next character
 * 
 * @return charClass
 */
function getChar () {
  // get next character from code
  states.nextChar = states.code[states.nextCharIndex++];
  const { nextChar } = states;

  if (nextChar !== '\\') { // meaning of '\' is 'EOF'
    if (isAlpha(nextChar) === true) {
      return types.LETTER;
    } else if (isDigit(nextChar) === true) {
      return types.DIGIT;
    } else {
      return types.UNKNOWN;
    }
  } else {
    return tokens.EOF;
  }
}

/**
 * lexical analyzer body (recursive function)
 * 
 * @param {Number} charClass char class (Letter, Digit, EOF)
 */
function lex (charClass) {
  // init variables
  let nextToken;
  let lexeme = [];

  // ignore space
  while (isSpace(states.nextChar) === true) {
    charClass = getChar();
  }

  // add character to lexeme array
  lexeme.push(states.nextChar);

  // char type is...
  switch (charClass) {
    case types.LETTER: {
      charClass = getChar(); // get next character and it's type

      // add letters and digits to lexeme array
      while (charClass === types.LETTER || charClass === types.DIGIT) {
        lexeme.push(states.nextChar);
        charClass = getChar(); // get next character
      }

      nextToken = tokens.IDENT; // token is variable
      break;
    }
    case types.DIGIT: {
      charClass = getChar(); // get next character and its type

      // add digits to lexeme array
      while (charClass === types.DIGIT) {
        lexeme.push(states.nextChar);
        charClass = getChar(); // get next character
      }

      nextToken = tokens.INT_LIT; // token is integer literal
      break;
    }
    case types.UNKNOWN: {
      nextToken = getLookup(states.nextChar); // token is special character
      charClass = getChar(); // get next character and it's type
      break;
    }
    case tokens.EOF: {
      nextToken = tokens.EOF; // token is EOF
      break;
    }
  }

  // print token and lexeme array
  console.log(`token: ${nextToken}, lexeme: ${lexeme.join('')}`);

  // next token is EOF?
  if (nextToken === tokens.EOF) {
    return;
  }

  // recursive
  lex(charClass);
}

/* tools */

/**
 * find character in look-up table
 * (operators, special characters, etc...)
 * 
 * @param {String} c character
 */
function getLookup (c) {
  return lookupTable[c];
}

/**
 * test character is alphabet?
 * 
 * @param {String} c character
 */
function isAlpha (c) {
  return /[a-z|A-Z]/.test(c);
}

/**
 * test character is digit?
 * 
 * @param {String} c character
 */
function isDigit (c) {
  return /[0-9]/.test(c);
}

/**
 * test character is space?
 * 
 * @param {String} c character
 */
function isSpace (c) {
  return /[\s]/.test(c);
}

/* --- */
/* run */
/* --- */

index('(sum + 47) / total\\');
