var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
let babel = require('gulp-babel');

//script paths
var jsFiles = 'scripts/**/*.js',
    jsDest = 'min';

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('splitpane.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('splitpane.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest(jsDest));
});
