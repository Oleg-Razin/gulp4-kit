        
const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();

function clear() {
    return src('./dist/*', {
            read: false
        })
        .pipe(clean());
}

function js() {
    const source = './src/js/*.js';

    return src(source)
        .pipe(changed(source))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('./dist/js/'))
        .pipe(browsersync.stream());
}

function css() {
    const source = './src/scss';

    return src([source + '/style.scss',
    source + '/**/*.scss',
    source + '/*.scss'])
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.init())
        .pipe(concat('styles.css'))
        .pipe(dest('./dist/css/'))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('./dist/css/'))
        .pipe(browsersync.stream())
        .pipe(notify({ message: 'styles.min.css generated', onLast: true }));
}

function img() {
    return src('./src/images/*')
        .pipe(imagemin())
        .pipe(dest('./dist/images'));
}

function watchFiles() {
    watch('./src/scss/*', css);
    watch('./src/js/*', js);
    watch('./src/img/*', img);
}

function browserSync() {
    browsersync.init({
        server: {
            baseDir: './'
        },
        port: 3000
    });
}

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(js, css, img));
    