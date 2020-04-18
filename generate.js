const fs = require('fs')

fs.readdir("./articles", function (err, files) {
    if (err) {
        console.log("路径错误")
    }

    files.forEach(function (item) {
        console.log(item)
    })
})