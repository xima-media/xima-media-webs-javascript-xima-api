module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        conf: {
            dist: {
                dir: './dist',
                js: '<%= conf.dist.dir %>/js'
            },
            doc: './documentation',
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
                    '<%= conf.src.js %>/modules/*.js'
                ],
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
            tasks: ['dev']
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
    grunt.loadNpmTasks('grunt-grock');
    grunt.loadNpmTasks('grunt-contrib-clean');

    /**
     * Grunt-Tasks
     */
    // Dev - Zur Entwicklungszeit geeignet.
    grunt.registerTask('dev', ['clean', 'copy']);

    // Prod - Für Live-Umgebungen geeignet.
    grunt.registerTask('prod', ['clean', 'concat', 'uglify']);

    // Default
    grunt.registerTask('default', ['dev', 'watch']);
};
