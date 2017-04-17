const gulp          = require('gulp');
const imagemin      = require('gulp-imagemin');
const sass          = require('gulp-sass');
const concat        = require('gulp-concat');
const autoprefixer  = require('gulp-autoprefixer');
const notify        = require('gulp-notify');
const plumber       = require('gulp-plumber');

const babelify      = require('babelify');
const stageTwo      = require('babel-preset-stage-2');
const browserify    = require('browserify');
const buffer        = require('vinyl-buffer');
const source        = require('vinyl-source-stream');
const uglify        = require('gulp-uglify');

const browserSync   = require('browser-sync').create();
const reload        = browserSync.reload;

gulp.task('browser-sync', () => {
    browserSync.init({
        server: './dist',
        ghostMode: false
    })
});

gulp.task('html', () => {
    return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist/'))
    .pipe(reload({stream: true}));
});

gulp.task('images', () => {
    return gulp.src('./src/assets/images/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/assets/images/'))
    .pipe(reload({stream: true}));
});

gulp.task('styles', () => {
    return gulp.src('./src/assets/styles/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./dist/assets/styles/'))
    .pipe(reload({stream: true}));
});

gulp.task('es6-dev', () => {
    return browserify('./src/app.js', { debug: true })
    .transform('babelify', {
        sourceMaps: true,
        presets: [
            'es2015', 
            'react', 
            'stage-2'
        ]
    })
    .bundle()
    .on('error',notify.onError({
        message: "Error: <%= error.message %>",
        title: 'Error in JS 💀'
    }))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(reload({stream: true}));
});

gulp.task('es6', () => {
    return browserify('./src/app.js')
    .transform('babelify', {
        presets: [
            'es2015', 
            'react', 
            'stage-2'
        ]
    })
    .bundle()
    .on('error',notify.onError({
        message: "Error: <%= error.message %>",
        title: 'Error in JS 💀'
    }))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(reload({stream: true}));
});

gulp.task('watch', () => {
    gulp.watch('./src/assets/styles/**/*.scss', ['styles']);
    gulp.watch('./src/**/*.js', ['es6-dev']);
    gulp.watch('./src/*.html', ['html']);
});

gulp.task('build', ['html', 'images', 'styles', 'es6']);

gulp.task('default', ['html', 'images', 'styles', 'es6-dev', 'browser-sync', 'watch']);
