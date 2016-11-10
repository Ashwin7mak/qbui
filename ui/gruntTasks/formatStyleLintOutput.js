var stylelint = require('stylelint');

module.exports = function(grunt) {
    var lintStylesFail = grunt.option('lintStylesFail') || true;


    function showWarnings(data) {
        grunt.log.writeln(data.output);
    }

    function onlyShowErrors(data) {
        var errorDescriptions = [];

        data.results.forEach(function(cssFile) {
            var fileAdded = false;

            cssFile.warnings.forEach(function(item) {
                if (item.severity === 'error') {
                    if (!fileAdded) {
                        errorDescriptions.push(`FILE: ${cssFile.source}`);
                        fileAdded = true;
                    }
                    errorDescriptions.push(`${item.line}:${item.column} - ${item.severity} - ${item.text} [${item.rule}]`);
                }
            });
        });

        errorDescriptions.forEach(errorDescription => {
            if (errorDescription.indexOf('FILE')) {
                grunt.log.error(errorDescription);
            } else {
                grunt.log.subhead(errorDescription);
            }
        });
    }

    // Grunt task for linting and formatting css/sass styles
    grunt.registerTask('lintStyles', 'Run stylelint on code', function(target) {
        var done = this.async();
        stylelint.lint({
            configFile: 'stylelint.config.js',
            syntax: 'scss',
            formatter: 'string',
            files:  'client-react/src/**/*.{scss,css}'
        })
            .then(function(data) {
                var errors = 0;
                var warnings = 0;

                data.results.forEach(function(cssFile) {
                    cssFile.warnings.forEach(function(item) {
                        if (item.severity === 'error') {
                            errors++;
                        }

                        if (item.severity === 'warning') {
                            warnings++;
                        }
                    });
                });

                if (errors > 0 || warnings > 0) {
                    if (target === 'all') {
                        showWarnings(data);
                    } else {
                        onlyShowErrors(data);
                    }

                    grunt.log.subhead('Totals:');
                    grunt.log.error('Total of ' + errors + ' errors found.');
                    grunt.log.error('Total of ' + warnings + ' warnings found.');
                    grunt.log.error('For details on errors visit:');
                    grunt.log.error('https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md');
                    if (lintStylesFail && errors > 0) {
                        grunt.fail.fatal('Too many CSS/SASS styling errors [lintStyles]');
                    }
                } else {
                    grunt.log.ok('No stylelint errors found');
                }

                done();
            })
            .catch(function(err) {
                grunt.log.writeln(err.stack);
                done();
            });
    });
};
