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
  Darwin: _.flowRight(interpret, parser)
}));
