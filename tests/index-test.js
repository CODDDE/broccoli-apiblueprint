const assert = require('assert');
const broccoli = require('broccoli');
const path = require('path');
const { existsSync, readFileSync } = require('fs');
const { resolve } = require('rsvp');
const ApiCompiler = require('../index');

function fixtureFullPath(filename = '') {
  return path.join(__dirname, 'tests', 'fixtures', filename);
}

describe('compile api blueprint documents', function(){
  let builder;

  beforeEach(function(){
    
  });
  afterEach(function(){
    if (builder) {
      return builder.cleanup();
    }    
  });
  
  it('throws an error if multiple paths are passed as arguments', function(){
    const inputPaths = [
      path.join(__dirname, ''),
      path.join(__dirname, 'fixtures')
    ];
    
    let broccoliNode = new ApiCompiler(inputPaths, {});
    builder = new broccoli.Builder(broccoliNode);
    
    return builder.build()
      .catch( error => {
        assert.ok(true, 'it rejects');
        return resolve();
      })
  });
  
  it('correctly compiles default entry', function(){
    const inputPaths = [
      path.join(__dirname, 'fixtures')
    ];
    
    let broccoliNode = new ApiCompiler(inputPaths);
    builder = new broccoli.Builder(broccoliNode);
    
    return builder.build()
      .then( results => {
        debugger
        const outputPath = path.join(builder.outputNode.outputPath, builder.outputNode.options.outputPath);
        const expectation = path.join(__dirname, 'expectations', 'index.html');
        const expectedBuf = readFileSync(expectation);
        const compiledBuf = readFileSync(`${outputPath}/index.html`);
        
        assert.ok(compiledBuf.equals(expectedBuf), 'it compiles to the expected output');
        return resolve();
      })
  });
  
  it('it accepts custom input filename', function(){
    const inputPaths = [
      path.join(__dirname, 'fixtures')
    ];
    const options = {
      indexFile: 'custom.apib'
    }
    
    let broccoliNode = new ApiCompiler(inputPaths, options);
    builder = new broccoli.Builder(broccoliNode);
    
    return builder.build()
      .then( results => {
        debugger
        const outputPath = path.join(builder.outputNode.outputPath, builder.outputNode.options.outputPath);
        const expectation = path.join(__dirname, 'expectations', 'custom.html');
        const expectedBuf = readFileSync(expectation);
        const compiledBuf = readFileSync(`${outputPath}/index.html`);
        
        assert.ok(compiledBuf.equals(expectedBuf), 'it compiles to the expected output');
        return resolve();
      })
  });
  
  it('it accepts custom output and input filename', function(){
    const inputPaths = [
      path.join(__dirname, 'fixtures')
    ];
    const options = {
      indexFile: 'custom.apib',
      outputFile: 'custom.html'
    }
    
    let broccoliNode = new ApiCompiler(inputPaths, options);
    builder = new broccoli.Builder(broccoliNode);
    
    return builder.build()
      .then( results => {
        debugger
        const outputPath = path.join(builder.outputNode.outputPath, builder.outputNode.options.outputPath);
        const expectation = path.join(__dirname, 'expectations', 'custom.html');
        const expectedBuf = readFileSync(expectation);
        const compiledBuf = readFileSync(`${outputPath}/${options.outputFile}`);
        
        assert.ok(compiledBuf.equals(expectedBuf), 'it compiles to the expected output');
        return resolve();
      })
  });
  
});

