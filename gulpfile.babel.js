'use strict';
import gulp from 'gulp';

// HTML related plugins
import pug from 'gulp-pug';

// CSS related plugins
import importCss from 'gulp-import-css';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'cssnano';

// JS related plugins
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
const webpack = webpackStream.webpack;

// SVG related plugins
import svgSprite from 'gulp-svg-sprites';

// Utility plugins
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import del from 'del';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';

// Browser related plugins
import browserSync from 'browser-sync';
const server = browserSync.create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';


// Tasks

// Start server
gulp.task('server:start', () => {
    return server.init({
        server: 'dist',
        notify: false
    });
});

function reload(done) {
    server.reload();
    done();
}


// Templates compile
gulp.task('templates:compile', function buildHTML(){
    return gulp.src('src/*.pug')
        .pipe(plumber({
            errorHandler: notify.onError((err) => {
                return {
                    title: 'Templates',
                    message: err.message
                }
            })
        }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(server.stream());
});


// Styles compile
gulp.task('styles:compile', () => {
    return gulp.src('./src/style.css')
        .pipe(plumber({
            errorHandler: notify.onError((err) => {
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
        .pipe(gulpif(isDevelopment, sourcemaps.init()))
        .pipe(importCss())
        .pipe(autoprefixer({browsers: ['last 1 version']}))
        .pipe(gulpif(isDevelopment, sourcemaps.write('')))
        .pipe(gulpif(!isDevelopment, cssnano()))
        .pipe(gulp.dest('./dist'))
        .pipe(server.stream());
});


// Scripts compile
gulp.task('scripts:compile', () => {
    webpackConfig.devtool = isDevelopment ? 'cheap-module-inline-source-map' : '';
    if (!isDevelopment) webpackConfig.plugins.push(
        new UglifyJSPlugin()
    );
    return webpackStream(webpackConfig)
        .pipe(gulp.dest('./dist'))
});


// SVG sprite
gulp.task('sprite:compile', () => {
    return gulp.src('./src/components/**/*.svg')
        .pipe(plumber({
            errorHandler: notify.onError((err) => {
                return {
                    title: 'Sprites',
                    message: err.message
                }
            })
        }))
        .pipe(svgSprite({
            mode: "symbols",
            preview: false,
            svgId: "%f",
            svg: {
                symbols: "./sprite.svg"
            }
        }))
        .pipe(gulp.dest('dist/assets'));
});


gulp.task('watch', () => {
    gulp.watch('./src/components/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('./src/components/**/*.css', gulp.series('styles:compile'));
    gulp.watch('./src/components/**/*.js', gulp.series('scripts:compile', reload));
});


gulp.task('default', gulp.series(
    gulp.parallel('templates:compile', 'styles:compile', 'scripts:compile'),
    gulp.parallel('server:start', 'watch')
));


gulp.task('dist:delete', () => {
    return del.sync('dist');
});

