// What does this module do?
// What problem does this module solve?

/*  establish dependencies and require them here
var dependencyA = require('some-node-module')
  , dependencyB = require('some-node-module')
  , localConfig = process.env.SOME_ENVIRONMENT_VARIABLE // like a database url, or api key
*/

// establish and export namespace
ns = {}
module.exports = ns

ns.add =      function(a, b) { return a + b }
ns.subtract = function(a, b) { return a - b }

// How can I test this module?
// you can test this module by running:
//   $ node module-example.js
var printExamples = (process.argv[1] == __filename)
if( printExamples ) {

  if( 3 !== ns.add(2,1) ) { throw "you don't know how to add" }
  if( 1 !== ns.subtract(2,1) ) { throw "you don't know how to subtract" }

  console.log('OK')
}