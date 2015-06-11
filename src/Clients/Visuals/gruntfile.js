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

/// <vs BeforeBuild='default' Clean='clean' />
gruntConfig = require('../gruntConfig.js');

module.exports = function (grunt) {

    var opts = gruntConfig.getOpts();

    grunt.initConfig({
        name: opts[0],
        pkg: grunt.file.readJSON('package.json'),
        uglify: gruntConfig.uglifyConfig(opts[1]),
        sprite: gruntConfig.spriteSmithConfig(opts[0], opts[3]),
        less: gruntConfig.lessConfig(opts[2], opts[2] + '/visuals.less'),
        cssmin: gruntConfig.cssMinConfig(opts[2], opts[2] + '/visuals.css'),
        cssjanus: gruntConfig.cssJanusConfig(opts[2], opts[2] + '/visuals.css', opts[2] + '/visuals.min.css'),
    });

    gruntConfig.loadParentNpmTasks(grunt, 'grunt-contrib-uglify');
    gruntConfig.loadParentNpmTasks(grunt, 'grunt-contrib-less');
    gruntConfig.loadParentNpmTasks(grunt, 'grunt-spritesmith');
    gruntConfig.loadParentNpmTasks(grunt, 'grunt-contrib-cssmin');
    gruntConfig.loadParentNpmTasks(grunt, 'grunt-cssjanus');

    grunt.registerTask('default', ['uglify', 'sprite', 'less', 'cssmin', 'cssjanus']);
};