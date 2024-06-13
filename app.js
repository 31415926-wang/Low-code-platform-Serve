const open = require('open')
var history = require('connect-history-api-fallback');
const path = require('path')
const fileUpload = require('express-fileupload');
const fs = require('fs');

const cors = require('cors');

//创建服务
const express = require('express')
const app = express();

//全局中间件
app.use(function (req, res, next) {
    next();
})

app.use(history()) //解决404问题


//路由中间件
app.use('/test', function (req, res, next) {
    next();
})

// 使用 cors 中间件处理跨域请求
app.use(cors())

/* 上传图片的接口 */
// 使用 express-fileupload 中间件来处理文件上传
app.use(fileUpload());
app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // 获取上传的文件，目前只处理单个
    const uploadedFile = req.files['file-upload'];
    console.log("后台监测上传图片", uploadedFile);
    // console.log("后台监测上传图片2", req.files['file-img'].mv);

    // 生成文件名
    const fileName = `${Date.now()}_${uploadedFile.name}`;
    // 保存文件到指定目录
    uploadedFile.mv(path.join(__dirname, 'uploads', fileName), (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        // 返回上传成功的图片路径
        let result = {
            data: `${fileName}`,
            state: 'success',
            code: 200
        }
        res.send(result);
    });
});

// 设置读取图片文件目录
app.use('/qsImgs', express.static(path.join(__dirname, 'uploads')));

//拦截路由
app.get('/test', function (req, res) {
    res.send(`<html><body> 
    <div>111222333</div>
    </body></html>`)
})


//指定静态资源的访问
app.use(express.static(path.resolve(__dirname, 'dist')))


//启动http服务
const port = 8888;
app.listen(port, function () {
    console.log("服务启动成功!!!");
    const url = 'http://localhost:' + port;
    // open(url)
})
