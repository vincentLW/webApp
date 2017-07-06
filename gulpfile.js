var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');

var app = {
    srcPath: 'src/',
    devPath: 'build/',
    prdPath: 'dist/'
};
// copy lib to dest buid file and product file
gulp.task('lib', function() {
    return gulp.src('bower_components/**/*.js')
        .pipe(gulp.dest(app.devPath + 'vender'))
        .pipe(gulp.dest(app.prdPath + 'vender'))
        .pipe($.connect.reload());
});
//copy html file to dest file
gulp.task('html', function() {
   return gulp.src(app.srcPath + '**/*.html')
        .pipe($.plumber())
        .pipe(gulp.dest(app.devPath))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());
});
//copy json data to dest file
gulp.task('json', function() {
   return gulp.src(app.srcPath + 'data/**/*.json')
        .pipe(gulp.dest(app.devPath + 'data'))
        .pipe(gulp.dest(app.prdPath + 'data'))
        .pipe($.connect.reload());
});
//compress less and copy to dsst file
gulp.task('less', function() {
   return gulp.src(app.srcPath + 'style/index.less')
        .pipe($.plumber())
        .pipe($.less())
        .pipe(gulp.dest(app.devPath + 'css'))
        .pipe($.cssmin())
        .pipe(gulp.dest(app.prdPath + 'css'))
        .pipe($.connect.reload());
});
//concat and compress js to dest file
gulp.task('js', function() {
   return gulp.src(app.srcPath + 'script/**/*.js')
        .pipe($.plumber())
        .pipe($.concat('index.js'))
        .pipe(gulp.dest(app.devPath + 'js'))
        .pipe($.uglify())
        .pipe(gulp.dest(app.prdPath + 'js'))
        .pipe($.connect.reload());
});
//compress image file and copy it to dest directives
gulp.task('image', function() {
   return gulp.src(app.srcPath + 'image/**/*')
        .pipe(gulp.dest(app.devPath + 'image'))
        .pipe($.imagemin())
        .pipe(gulp.dest(app.prdPath + 'image'))
        .pipe($.connect.reload());
});
//run all the task as build command
gulp.task('build', ['image', 'js', 'less', 'lib', 'json', 'html']);
//clean all the files before release product
gulp.task('clean', function() {
    gulp.src([app.devPath, app.prdPath])
        .pipe($.clean());
});
//config server
gulp.task('serve', ['build'], function() {
    $.connect.server({
        root: [app.devPath],
        livereload: true,
        port: 1234

    });
    open('http://localhost:1234');

    gulp.watch('bower_components/**/*', ['lib']);
    gulp.watch(app.srcPath + '**/*.html', ['html']);
    gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
    gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
    gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
    gulp.watch(app.srcPath + 'image/**/*', ['image']);
});

gulp.task('default', ['serve']);
