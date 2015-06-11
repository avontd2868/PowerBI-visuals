/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
 
var gruntConfig = require('./gruntConfig.js'),
	pathModule = require('path');

function uglifyConfig(isMinify, inputPaths, outputFolder, outputFileName) {
	var jsFileExtensionRegExp = /.js/,
		jsMinFileExtensionRegExp = /.min.js/,
		inputFiles = [],
		outputFile,
		options,
		config;
	
	outputFile = outputFolder + '/' + outputFileName;
		
	for (var key in inputPaths) {
		var inputPath = inputPaths[key];
		
		if (jsFileExtensionRegExp.test(inputPath)) {
			if (isMinify) {
				inputPath = inputPath.replace(jsFileExtensionRegExp, '.min.js');
			} else {
				inputPath = inputPath.replace(jsMinFileExtensionRegExp, '.js');
			}
			
			inputFiles.push(inputPath);
		} else {
			inputFiles.push(inputPath + '/**/*.js');
		}
	}
		
	if (isMinify) {
		outputFile = outputFile + '.min.js';
		options = gruntConfig.getMinifiedRetailOptions();
	} else {
		outputFile = outputFile + '.js';
		options = gruntConfig.getNonminifiedRetailOptions();		
	}
	
	options.sourceMap = false;
	options.sourceMapIncludeSources = false;
	options.sourceMapIn = false;
	options.compress = false;	
		
	config = {
		all: {
			options: options,
			src: inputFiles,
			dest: outputFile,
			filter: function (filePath) {
				var isMinJsExtension = jsMinFileExtensionRegExp.test(filePath);
								
				if (isMinify) {
					return isMinJsExtension;
				} else {
					return !isMinJsExtension;
				}				
			}
		}
	}
		
	return config;		
}

module.exports = function(grunt) {
	var isMinifyOption = grunt.option('isMinify'),
		isMinify = false,
		config;
		
	isMinify = isMinifyOption && Boolean(isMinifyOption);
		
	config = uglifyConfig(
		isMinify, [
			'./Externals/ThirdPartyIP/JQuery/2.1.3',
			'./Externals/ThirdPartyIP/LoDash',
			'./Externals/ThirdPartyIP/D3',
			'./Externals/ThirdPartyIP/GlobalizeJS/globalize.js',
			'./Externals/ThirdPartyIP/GlobalizeJS/globalize.cultures.js',
			'./JsCommon/obj',
            './Data/obj',            
            './Visuals/obj'
		], 
		'../../build/neutral/PowerBI/scripts', 
		'powerbi-visuals.all');
	
	grunt.initConfig({
		uglify: config
	});
	
	gruntConfig.loadParentNpmTasks(grunt, 'grunt-contrib-uglify');
  
	grunt.registerTask('default', ['uglify']);
};