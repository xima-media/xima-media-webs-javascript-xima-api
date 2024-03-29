module.exports = function (grunt) {

    /**
     * Option to only take action (concat, minify, etc.) to specified modules.
     * You can seperate modulenames by ",".
     * Default are all modules.
     */
    var modules = grunt.option('modules') || ['*'];

    /**
     * Initialize configuration
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        conf: {
            dist: {
                dir: './dist',
                js: '<%= conf.dist.dir %>/js'
            },
            src: {
                dir: 'Source',
                js: '<%= conf.src.dir %>/js'
            }
        },

        // Verzeichnisse leeren
        clean: {
            dist: ['<%= conf.dist.dir %>/*']
        },

        // JS minimieren
        uglify: {
            options: {
                preserveComments: 'some'
            },
            dist: {
                src: '<%= conf.dist.js %>/xima_api.js',
                dest: '<%= conf.dist.js %>/xima_api.min.js'
            }
        },

        // Dateien zusammenfassen
        concat: {
            options: {
                seperator: ';\r\n'
            },
            dist: {
                src: [
                    '<%= conf.src.js %>/xima_api.js',
                    '<%= conf.src.js %>/modules/OverlappingMarkerSpiderfier.min.js',
                    '<%= conf.src.js %>/modules/*.js'
                ],
                filter: function(filepath) {
                    var filepathParts = /(modules)(?:\\|\/)([^/\\]+)(?=\.js$)/.exec(filepath);

                    if (filepathParts != null && filepathParts[1] == 'modules' && modules[0] != '*'){
                        return modules.indexOf(filepathParts[2]) != -1
                    }
                    return true;
                },
                dest: '<%= conf.dist.js %>/xima_api.js'
            }
        },

        // Dateien kopieren
        copy: {
            dist: {
                files: [
                    {
                        cwd: '<%= conf.src.js %>',
                        src: ['**', './**'],
                        expand: true,
                        dest: '<%= conf.dist.js %>'
                    }
                ]
            }
        },

        // Veränderungen beobachten
        watch: {
            files: ['<%= conf.src.js %>/**/*'],
            tasks: ['dist']
        }
    });

    /**
     * Grunt-Tasks-Bibliotheken
     */
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');

    /**
     * Grunt-Tasks
     */
    // Dist - Einfaches Kopieren der Dateien in das /dist -Verzeichnis.
    grunt.registerTask('dist', ['clean', 'copy']);

    // Prod - Für Live-Umgebungen geeignet.
    grunt.registerTask('prod', ['clean', 'concat', 'uglify']);

    // Default - Zur Entwicklungszeit geeignet.
    grunt.registerTask('default', ['clean', 'copy', 'watch']);
};
