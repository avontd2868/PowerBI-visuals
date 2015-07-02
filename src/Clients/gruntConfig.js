fs = require('fs');
path = require('path');
grunt = require('grunt');

exports.getFileName = function (filePath) {
    var fileNameMatch = filePath.match(/\/([^/]*)$/)[1];
    var fileName = fileNameMatch.substr(0, fileNameMatch.lastIndexOf('.')) || fileNameMatch;
    return fileName;
}

function getUglifyJsOptions(outputDir, isDebug) {
    return {
        sourceMap: true,
        sourceMapIncludeSources: true,
        sourceMapIn: outputDir + '/<%= name %>.js.map', // input sourcemap from a previous compilation
        screwIE8: true,
        mangle: !isDebug,
        beautify: isDebug,
        compress: {
            drop_console: true,
            pure_funcs: ['debug.assertValue', 'debug.assertFail', 'debug.assert', 'debug.assertAnyValue'],
            warnings: false,
            dead_code: true,
            sequences: true,
            properties: true,
            conditionals: true,
            comparisons: true,
            booleans: true,
            cascade: true,
            unused: true,
            loops: true,
            if_return: true,
            join_vars: true,
            global_defs: {
                'DEBUG': !isDebug,
            }
        },
    };
}

function getMinifiedRetailOptions(outputDir) {
    var options = getUglifyJsOptions(outputDir, false);
    return options;
}

function getNonminifiedRetailOptions(outputDir) {
    var options = getUglifyJsOptions(outputDir, false);
    options.beautify = true;
    options.mangle = false;
    return options;
}

function getMinifiedDebugOptions(outputDir) {
    var options = getUglifyJsOptions(outputDir, true);
    options.mangle = true;
    return options;
}

exports.uglifyConfig = function (outputDir) {
    var config;
    var configuration = grunt.option('configuration');
    var isDebug = configuration && configuration.toLowerCase() == 'debug';
    
    if (!isDebug) {
        config = {
            minified_retail: {
                options: getMinifiedRetailOptions(outputDir),
                files: [{
                    src: [outputDir + '/<%= name %>.js'],
                    dest: outputDir + '/<%= name %>.min.js'
                }]
            },
            nonminified_retail: {
                options: getNonminifiedRetailOptions(outputDir),
                files: [{
                    src: [outputDir + '/<%= name %>.js'],
                    dest: outputDir + '/<%= name %>.nonmin.js'
                }]
            }
        };
    }
    else {
        config = {
            minified_debug: {
                options: getMinifiedDebugOptions(outputDir),
                files: [{
                    src: [outputDir + '/<%= name %>.js'],
                    dest: outputDir + '/<%= name %>.min.js'
                }]
            }
        }
    }
    return config;
}

exports.lessConfig = function (outputDir, referenceFile) {
    var fileName = exports.getFileName(referenceFile);

    return {
        options: {
            compress: false,
            relativeUrls: true,
        },
        files: {
            src: [referenceFile],
            dest: outputDir + '/' + fileName + '.css'
        }
    }
}

exports.cssMinConfig = function (outputDir, referenceFile) {
    var fileName = exports.getFileName(referenceFile);

    return {
        files: {
            src: [referenceFile],
            dest: outputDir + '/' + fileName + '.min.css'
        }
    }
}

exports.cssJanusConfig = function (outputDir, cssFile, minifiedCssFile) {
    var fileName = exports.getFileName(cssFile);

    return {
        options: {
            generateExactDuplicates: true
        },
        main: {
            src: cssFile,
            dest: outputDir + '/' + fileName + '.rtl.css'
        },
        minified: {
            src: minifiedCssFile,
            dest: outputDir + '/' + fileName + '.rtl.min.css'
        }
    }
}

exports.concatConfig = function (sourceFiles, outputFile) {
    var splitSourceFiles = sourceFiles.split(',');

    return {
        options: {
            separator: ';'
        },
        dist: {
            src: splitSourceFiles,
            dest: outputFile
        }
    }
}

exports.cssConcatConfig = function (sourceFiles, outputFile) {
    var splitSourceFiles = sourceFiles.split(',');

    return {
        dist: {
            src: splitSourceFiles,
            dest: outputFile
        }
    }
}

exports.spriteSmithConfig = function (projectName, projectDir) {

    projectName = projectName.toLowerCase();

    return {
        all: {
            src: projectDir + '/images/sprite-src/*.png',
            dest: projectDir + '/images/' + projectName + '.sprites.png',
            destCss: projectDir + '/styles/sprites.less',
            imgPath: '../images/' + projectName + '.sprites.png',
            padding: 4
        }
    }
}

exports.loadParentNpmTasks = function (grunt, name) {
    var root = path.resolve('node_modules');
    var depth = 0;
    while (depth < 10) {
        var tasksdir = path.join(root, name, 'tasks');
        if (grunt.file.exists(tasksdir)) {
            grunt.loadNpmTasks(name);
            return;
        } else {
            name = '../../node_modules/' + name;
            depth++;
        }
    }
    grunt.log.error('Parent Npm module "' + name + '" not found. Is it installed?');
};

exports.getOpts = function () {
    var outputDir = grunt.option('outputDir');
    var projectName = grunt.option('name');
    var cssOutputDir = grunt.option('cssDir');
    var projectDir = grunt.option('projectDir');

    if (!outputDir || !projectName) {
        grunt.util.error('outputDir or projectName not specified');
        throw new Error('invalid params');
    }

    return [projectName, outputDir, cssOutputDir, projectDir];
}