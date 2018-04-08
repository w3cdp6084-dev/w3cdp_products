var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var options = {
    outputStyle: 'compressed',
    sourceMap: true,
    sourceComments: false
};
var autoprefixerOptions = {
    browsers: ['last 3 version', 'ie >= 6', 'Android 4.0']
};
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");
var datas = {
    title: 'test site',
    message: 'hello world'
};
var settings = {
    ext: '.html'
};
var pug = require('gulp-pug');
var packageImporter = require('node-sass-package-importer');

gulp.task('pug', function() {
    gulp.src(['app/src/pug/*.pug', '!app/src/pug/_*.pug'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(pug(datas, settings))
        .pipe(rename({extname: ".html"}))
        .pipe(browserSync.reload({stream:true}))
        .pipe(notify('pugをコンパイルしました！'))
        .pipe(gulp.dest('app/public'));
});

gulp.task('sass', function() {
    gulp.src('app/src/sass/*.scss')
        .pipe(sass(options))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sass())
        .pipe(gulp.dest('app/public/css/'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(sass({
            importer: packageImporter({
                extensions: ['.scss', '.css']
            })
        }))
        .pipe(notify('Sassをコンパイルしました！'));
});

gulp.task('reload', function(){
    browserSync.reload();
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app/public",
            reloadDelay: 2000
        }
    });
});

gulp.task('watch',["reload"], function () {
    gulp.watch('app/src/sass/*.scss',['sass']);
    gulp.watch('app/src/pug/*.pug',['pug']);
    gulp.watch('app/public/*.html',['reload']);
    gulp.watch('app/public/css/*.css',['reload']);

});

gulp.task('default', ['watch','reload','sass','browser-sync']);
