'use strict';
var gulp = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        scss: 'dist/css/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    app: { //Пути откуда брать исходники
        html: 'app/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'app/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        scss: 'app/css/*.scss',
        css: 'app/css/*.css',
        img: 'app/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        scss: 'app/css/**/*.scss',
        css: 'app/css/**/*.css',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist'
};

var config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: false,
    host: 'localhost',
    port: 8081,
    logPrefix: "UpTrade"
};


gulp.task('html:build', function (done) {
    gulp.src(path.app.html) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.dist.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
    done()
});

gulp.task('js:build', function (done) {
    gulp.src(path.app.js) //Найдем наш main файл
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.dist.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
    done()
});

gulp.task('scss:build', function (done) {
    gulp.src(path.app.scss) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cleanCSS()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.scss)) //И в build
        .pipe(reload({stream: true}));
    done()
});

gulp.task('css:build', function (done) {
    gulp.src(path.app.css) //Выберем наш main.css
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(cleanCSS()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css)) //И в build
        .pipe(reload({stream: true}));
    done()
});

gulp.task('image:build', function (done) {
    gulp.src(path.app.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img)) //И бросим в build
        .pipe(reload({stream: true}));
    done()
});

gulp.task('fonts:build', function(done) {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts))
    done()
});

gulp.task('build', gulp.series(
    'html:build',
    'js:build',
    'scss:build',
    'css:build',
    'fonts:build',
    'image:build'
));


gulp.task('watch', function(){
    gulp.watch([path.watch.html], gulp.parallel('html:build'), function(done){
        done()
    });
    gulp.watch([path.watch.scss], gulp.parallel('scss:build'), function(done){
        done()
    });
    gulp.watch([path.watch.css], gulp.parallel('css:build'), function(done){
        done()
    });
    gulp.watch([path.watch.js], gulp.parallel('js:build'), function(done){
        done()
    });
    gulp.watch([path.watch.img], gulp.parallel('image:build'), function(done){
        done()
    });
    gulp.watch([path.watch.fonts], gulp.parallel('fonts:build'), function(done){
        done()
    });
});


gulp.task('webserver', function (done) {
    browserSync(config);
    done()
});


gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


gulp.task('default', gulp.series('build', 'webserver', 'watch'));