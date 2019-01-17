let gulp = require("gulp");

let sass = require("gulp-sass");

let server = require("gulp-webserver");
let url = require("url");
let fs = require("fs");
let path = require("path");
let data = require("./mock/data.json");


gulp.task("sass", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css"))
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
                if (pathname == "/favicon.ico") {
                    res.end("");
                    return
                } else if (pathname == "/api/data") {
                    let { page, page_size, type, key } = url.parse(req.url, true).query;

                    var arr = [];
                    data.forEach((i) => {
                        if (i.title.match(key) != null) {
                            arr.push(i)
                        }
                    })
                    console.log(url.parse(req.url, true).query)
                    let news = arr.slice(0);
                    if (type == "asc") {
                        var dataType = news.sort(function(a, b) {
                            return a.money - b.money
                        })
                    } else if (type == "desc") {
                        var dataType = news.sort(function(a, b) {
                            return b.money - a.money
                        })
                    } else if (type == "credit") {
                        var dataType = news.sort(function(a, b) {
                            return a.credit - b.credit
                        })
                    } else if (type == "credits") {
                        var dataType = news.sort(function(a, b) {
                            return b.credit - a.credit
                        })
                    } else if (type == "sale") {
                        var dataType = news.sort(function(a, b) {
                            return a.sale - b.sale
                        })
                    } else if (type == "normal") {
                        dataType = news
                    }
                    let total = Math.ceil(dataType.length / page_size);
                    let start = (page - 1) * page_size;
                    let end = page * page_size;
                    let datas = dataType.slice(start, end);

                    res.end(JSON.stringify({ code: 1, newData: datas, total: total }))
                } else {
                    pathname = pathname == "/" ? "index.html" : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
                }
            }
        }))
})

gulp.task("dev", gulp.series("sass", "webserver", "watch"))