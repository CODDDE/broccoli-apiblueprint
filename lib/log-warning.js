'use strict'
const clc = require('cli-color');
const PrettyError = require('pretty-error');

const cWarn = clc.xterm(214).bgXterm(235);
const cErr = clc.white.bgRed;

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

function logError(err) {
  const input = err.input;
  const error = err.result? err.result.error : err;
  const lineNo = getLineNo(input, error);
  if (lineNo != null) {
    console.error(cErr(`>> Line ${lineNo}:`) + ` ${error.message} (error code ${error.code})`);
  } else if ( err.result && err.result.error ) {
    console.log(err.result.error);
  } else {
    const pe = new PrettyError();
    pe.setMaxItems(5);
    console.error(pe.render(err));
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

module.exports = { logWarning, logError };