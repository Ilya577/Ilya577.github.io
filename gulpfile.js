let project_folder = "dist";
let source_folder = "src";


let { src, dest } = require('gulp'),
   gulp = require('gulp'),
   browsersync = require("browser-sync").create(),
   fileinclude = require("gulp-file-include"),
   del = require("del"),
   scss = require('gulp-sass')(require('sass')),
   autoprefixer = require('gulp-autoprefixer'),
   group_media = require('gulp-group-css-media-queries'),
   clean_css = require('gulp-clean-css'),
   rename = require('gulp-rename'),
   uglify = require('gulp-uglify'),
   imagemin = require('gulp-image');


let path = {
    build: {
        html: project_folder + "/",
        js: project_folder + "/js/",
        css: project_folder + "/css/",
        img: project_folder + "/img/"
       // fonts: project_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        js: source_folder + "/js/main.js",
        css: source_folder + "/scss/style.sass",
        img: 'src/img/**/*.*'
       // fonts: source_folder + '/fonts/**/*.*'
    },
    watch: {
        html: source_folder + '/**/*.html',
        js: source_folder + '/js/**/*.js',
        css: source_folder + '/scss/**/*.sass',
        img: 'src/img/**/*.*',
    },
    clean: "./" + project_folder + "/"
};

function browserSync(params) {
    browsersync.init({
        server:{
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
    .pipe(
        scss({
            outputStyle: 'expanded' 
        }).on('error', scss.logError)
    )
    .pipe(
        group_media()
    )
    .pipe(
        autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade : true
        })
    )
    .pipe(dest(path.build.css))
    .pipe(
        clean_css()
    )
    .pipe(
        rename({
            extname: ".min.css"
        })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(
        uglify()
    )
    .pipe(
        rename({
            extname: ".min.js"
        })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
    .pipe(imagemin({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        gifsicle: true,
        svgo: true,
        concurrent: 10,
        quiet: true 
      }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params) {
    return del(path.clean);
}


let build = gulp.series(clean, gulp.parallel(js, css, html, images));
let watch = gulp.parallel(build,browserSync, watchFiles);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;