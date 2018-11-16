var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer= require('gulp-autoprefixer');

var reload = browserSync.reload;
var src={
    scss: './src/scss/**/*.scss',
    css: './src/css/**/*.css',
    html: 'src/*.html',
    js: './src/js/**/*.js'

};

gulp.task('serve', ['sass', 'css-libs', 'scripts'], function() {

    browserSync.init({
        server: "./src"
    });

    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.html).on('change', reload);
    gulp.watch(src.js, ['scripts']);
});

gulp.task('sass', function(){
    return gulp.src(src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7', 'ie 9'], { cascade: true }))
    .pipe(gulp.dest('./src/css'))
    .pipe(reload({stream: true}));
});

gulp.task('css-libs', ['sass'], function(){
    return gulp.src('./src/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./src/css'))
});


gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'src/libs/semantic/dist/semantic.min.js' // Берем jQuery
         
        ])
      //  .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('src/js')); // Выгружаем в папку src/js
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function(){
    return gulp.src('./src/img/**/*')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('./dist/img'));
})

gulp.task('build', ['clean','img', 'sass'], function(){
    var buildCss = gulp.src([
        './src/css/main.css',
        './src/css/libs.min.css'
    ])
    .pipe(gulp.dest('./dist/css'))
    
    var buildFonts = gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'));
    
    var buildJs = gulp.src('./src/js/**/*')
    .pipe(gulp.dest('./dist/js'));
    
    var buildHtml =gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('clear', function () {  //Сброс кєша Gulp. Если у возникнут проблемы с 
    return cache.clearAll();      //изображениями или другими кешируемыми файлами, просто очистить кеш.
})

gulp.task('default', ['serve']);