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