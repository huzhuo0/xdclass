var createError = require('http-errors'); /* 报错依赖的模块，可以通过这个模块来写一些报错信息 */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); /* morgan是一个node.js关于http请求的日志中间件，这个模块主要就是做一些生成日志的操作 */
const cors = require('cors');
const expressJWT = require('express-jwt');
const {PRIVATE_KEY} = require('./utils/constant');

var articleRouter = require('./routes/article');
var usersRouter = require('./routes/users');
var commentRouter = require('./routes/comment')
var mavonEditroRouter = require('./routes/mavon_editor') /*  */

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); /* 这部分是弄模板引擎的 */

app.use(cors())
app.use(logger('dev'));
app.use(express.json()); /* 解析application/json方式的请求 */
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); /* 解析cookie */
app.use(express.static(path.join(__dirname, 'public'))); /* 设置静态文件路径 */

app.use(expressJWT({
  secret:PRIVATE_KEY,
  algorithms:['HS256']
}).unless({path: ['/api/user/register','/api/user/login','/api/user/upload','/api/article/allList','/api/article/detail','/api/article/list'] /* 白名单，除了这里写的地址，其他的URL都需要验证token */
}));

app.use('/api/article', articleRouter);
app.use('/api/user', usersRouter);
app.use('/api/comment', commentRouter);
app.use('/api/mavonEditor', mavonEditroRouter);/* 富文本图片上传 */

// catch 404 and forward to error handler
app.use(function(req, res, next) { /* 这个是处理没有写路由的地方，处理无效路由 */
  next(createError(404)); /* 这样就会交由下面的报错中间件进行处理 */
});

// error handler 
app.use(function(err, req, res, next) {  /* 错误中间件 */
  if(err.name === 'UnauthorizedError'){
    /* 这个需要根据自己的业务逻辑来处理 */
    res.status(401).send({code:-1,msg:'token验证失败'})
  }else{
    // set locals, only providing error in development
    res.locals.message = err.message; /* 把报错数据传递到views文件夹的模板上 */
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    /* req.app.get('env')相当于process.env.NODE_ENV */
  
    // render the error page
    res.status(err.status || 500);
    res.render('error'); /* 渲染views文件夹error模板 */
  }
});

module.exports = app;
