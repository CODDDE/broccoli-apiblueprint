const Plugin = require('broccoli-plugin');
const aglio = require('aglio');
const { reject, Promise } = require('rsvp');
const path = require('path');
const { existsSync } = require('fs');
const mkdirp = require('mkdirp');

const logWarning = require('./lib/log-warning');


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

var handleCompileResult = function(resolve, reject){
  return function (err, warnings) {
    if (err){
      reject(err, warnings);
    } else {
      warnings.forEach(logWarning(warnings.input))
      resolve();
    }
  };
};

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
  return  new Promise(function(resolve, reject){
    aglio.renderFile(
      path.join(_this.inputPaths[0], _this.options.indexFile), 
      path.join(outputPath, _this.options.outputFile),
      _this.options,
      handleCompileResult(resolve, reject)
    );
  });
};

module.exports = ApiCompiler;