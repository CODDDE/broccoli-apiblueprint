'use strict'
const clc = require('cli-color');

const cWarn = clc.xterm(214).bgXterm(235);

// Get the context from an error if possible
function getErrContext(input, lineNo) {
    const inputLines = input.split('\n');
    const context = inputLines.slice(lineNo - 5, lineNo + 5);
    return context.map( (line, index) => {
        if ( index == 4 ) {
            return cWarn(`>>>>   ${line}`);
        } else {
            return `>>>>   ${line}`;
        }
    });
};

// Get a line number from an error if possible
function getLineNo (input, err){
    if ( err.location && err.location.length ) {
      return input.substr(0, err.location[0].index).split('\n').length;
    }
}

function logWarning(input) {
  return function(warning) {
    const lineNo = getLineNo(input, warning) || 0;
    const errContext = getErrContext(input, lineNo)
    console.error(cWarn(`>> Line ${lineNo}:`) + ` ${warning.message} (warning code ${warning.code})`);
    console.error(cWarn('>> Context'));
    console.error(`       ...\n ${errContext.join('\n')} \n       ...`);
  }
}

module.exports = logWarning;