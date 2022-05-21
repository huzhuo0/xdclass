var express = require('express');
var router = express.Router();
const querySql = require('../db/index')
const {PWD_SALT,PRIVATE_KEY,EXPIRESD} = require('../utils/constant')
const {md5,upload} = require('../utils/index')
const jwt = require('jsonwebtoken')   /* 生成token的中间件 */
// const multer = require('multer') /* 上传文件的中间件 */
// var upload = multer({dest:'uploads/'}) /* 上传的文件的存放地的配置 */


/* 注册接口 */
router.post('/register', function(req, res, next) {
  let {username,password,nickname} = req.body
  querySql('select * from user where username=?',[username]).then(data=>{
    if(!data||data.length ===0){
      password = md5(`${password}${PWD_SALT}`)/* 加密的方法就是密码和秘钥拼接，然后用md5方法进行加密 */
      console.log(password)
      querySql('insert into user(username,password,nickname) value(?,?,?)',[username,password,nickname])
      .then(c=>{
        res.send({code:0,msg:'注册成功'})
      })
    }else{
      res.send({code:1,msg:'注册失败'})
    }
  })
})
/* 登录接口 */
router.post('/login', function(req, res, next) {
  let {username,password} = req.body
  querySql('select * from user where username=?',[username]).then(data=>{
    if(!data||data.length ===0){
      /* 等于0 就是没找到对应的账号呗 */
      res.send({code:-1,msg:'该账号不存在'})
    }else{ /* 登录成功我们要在数据库中验证登录账号和密码是否一致 */
      password = md5(`${password}${PWD_SALT}`)/* 同样是要对密码进行加密 */
      querySql('select * from user where username=? and password = ?',[username,password]).then(e=>{
        if(!e||e.length==0){
          res.send({
            code:-1,
            msg:'账号或者密码不正确'
          })
        }else{ /* 在数据库中确定账号和密码确实一致后我们就去生成token怎么去生成token，我们要先定义一个秘钥 */
              /* 生成token我们用jwt提供的sing()方法，有三个参数，第一个参数是要携带的信息，第二个参数是秘钥，第三个参数是
              秘钥过期时间也就是token过期时间 */
              let token = jwt.sign({username},PRIVATE_KEY,{expiresIn:EXPIRESD})
              /* 生成token后，我们就可以把token返回给前端 */
              res.send({
                code:0,
                msg:'登录成功',
                token:token,
                username:username
              })
        }
      })
    }
  })
})

/* 获取用户信息接口 */
router.get('/info', function(req, res, next) {
  console.log(req.query,'用户信息接口参数')
  let {username} = req.query
  querySql('select nickname,head_img from user where username = ?',[username]).then(data=>{
    console.log(data,'yonghu信息')
     res.send({code:0,msg:'成功',data:data[0]})
  })
})

/* 上传图片接口 */
router.post('/upload',upload.single('head_img'),(req,res,next) => {
  console.log(req.file) /* 上传文件时数据是在req.file里面的 */
  let imgPath = req.file.path.split('public')[1]
  let imgUrl = 'http://127.0.0.1:3000'+imgPath
  res.send({code:0,msg:'上传成功',data:imgUrl})
})

//用户信息更新接口
router.post('/updateUser',(req,res,next) => {
  let {nickname,head_img} = req.body
  let {username} = req.user /* 使用token后会将解析出来的数据存放到req.user中 */
    querySql('update user set nickname = ?,head_img = ? where username = ?',[nickname,head_img,username]).then(adata=>{
      console.log(adata)
      res.send({code:0,msg:'更新成功',data:null})
    })
    

})

module.exports = router;
