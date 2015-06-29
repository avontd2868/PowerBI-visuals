/// <vs BeforeBuild='default' Clean='clean' />
gruntConfig = require('../gruntConfig.js');

module.exports = function (grunt) {

	var opts = gruntConfig.getOpts();

    grunt.initConfig({
		name: opts[0],
        pkg: grunt.file.readJSON('package.json'),
		uglify: gruntConfig.uglifyConfig(opts[1])
    });

	gruntConfig.loadParentNpmTasks(grunt, 'grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify']);
};