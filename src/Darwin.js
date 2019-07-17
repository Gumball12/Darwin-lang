/**
 * 🐟 Darwin lang interpreter
 * 
 * @author shj
 * @repogitory https://github.com/Gumball12/Darwin-lang
 */

define([
  './parser.js',
  './interpreter.js'
], ({ parser }, { interpret }) => ({
  Darwin: input => interpret(parser(input))
}));
