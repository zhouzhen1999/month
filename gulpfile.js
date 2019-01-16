let gulp = require("gulp");

let sass = require("gulp-sass");

let server = require("gulp-webserver");
let url = require("url");
let fs = require("fs");
let path = require("path");

gulp.task("sass", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe("./src/css")
})

gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("sass"))
})

gulp.task("webserver", function() {
    return gulp.src("src")
        .pipe(server({
            port: 8989,
            middleware: function(req, res, next) {
                let pathname = url.parse(req.url).pathname;
                if (pathname == "/api") {
                    res.end("");
                    return
                } else {
                    pathname = pathname == "/" ? "index.html" : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
                }
            }
        }))
})