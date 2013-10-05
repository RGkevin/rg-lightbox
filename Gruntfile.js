'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		stylus: {
      compile: {
        options: {
          compress : true
        },
        files: {
          'rg-lightbox.css' : [
            'stylus/**/*.styl'
          ]
        }
      }
    },
		watch: {
      stylus: {
        files: [
          'stylus/**/*.styl'
        ],
        tasks: ['stylus']
      }
    }
	});

  grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Register tasks
  grunt.registerTask('default', [
    'stylus'
  ]);
  grunt.registerTask('dev', [
    'watch'
  ]);
}