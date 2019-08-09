const Plugin = require('broccoli-plugin');
const { reject } = require('rsvp');
const path = require('path');
const { existsSync } = require('fs');
const mkdirp = require('mkdirp');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);


ApiCompiler.prototype = Object.create(Plugin.prototype);
ApiCompiler.prototype.constructor = ApiCompiler;

function ApiCompiler(inputNodes, options) {
  const defaultOptions = {
    indexFile: 'index.apib',
    outputFile: 'index.html',
    outputPath: 'api-docs',
    // Aglio options
    themeVariables: 'default',    //	Built-in color scheme or path to LESS or CSS
    themeCondenseNav: true,       //	Condense single-action navigation links
    themeFullWidth: false,        //	Use the full page width
    themeTemplate: undefined,            //  Layout name or path to custom layout file
    themeStyle: 'default',        //	Built-in style name or path to LESS or CSS
  }

  options = Object.assign(defaultOptions, options);
  
  Plugin.call(this, inputNodes, {
    annotation: options.annotation
  });
  this.options = options;
}

/**
 * Convert option objet into an array of option strings
 * usabale by the Aglio command line tool
 * 
 * @param {Object} optionsObject 
 * @returns {Array} optionsArray
 */
function parseOptions(optionsObject){
  const optionsArray = [];
  if(!!optionsObject.themeTemplate) optionsArray.push(`--theme-template ${optionsObject.themeTemplate}`);
  if(!!optionsObject.themeVariables) optionsArray.push(`--theme-variables ${optionsObject.themeVariables}`);
  if(!!optionsObject.themeStyle) optionsArray.push(`--theme-style ${optionsObject.themeStyle}`);
  if(!optionsObject.themeCondenseNav) optionsArray.push('--no-theme-condense');
  if(!!optionsObject.themeFullWidth) optionsArray.push('--theme-full-width');
  if(!!optionsObject.includePath) optionsArray.push(`--include-path ${optionsObject.includePath}`);
  optionsArray.push('--verbose');

  return optionsArray;
}

ApiCompiler.prototype.build = function() {
  if(Array.isArray(this.inputPaths) && this.inputPaths.length > 1) {
    return reject({
      message: 'Broccoli-apiblueprint MUST be pointed to a single folder'
    });
  }

  const outputPath = path.join(this.outputPath, this.options.outputPath);
  const outputPathExists = existsSync(outputPath);
  if(!outputPathExists){
    mkdirp(outputPath);
  }
  
  const _this = this;
  debugger
  const compileOptions = parseOptions(_this.options);
  return execFile(
    './node_modules/aglio/bin/aglio.js',
    [
      `-i${path.join(_this.inputPaths[0], _this.options.indexFile)}`,
      `-o${path.join(outputPath, _this.options.outputFile)}`,
      ...compileOptions
    ]
  ).then( ({stdout, stderr}) => {
    if (stderr) {
      console.error(_this.options.indexFile + ':');
      console.log(stderr);
    }
  });
};

module.exports = ApiCompiler;
