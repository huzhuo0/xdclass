var express = require('express');
var router = express.Router();
const querySql = require('../db/index')



//发表评论接口
router.post('/public',async(req,res,next) => {
  // let {content,article_id} = req.body
  let content= req.body.content
  let article_id = Number(req.body.article_id)
  let {username} = req.user
  try {
    let userSql = 'select id,head_img,nickname from user where username = ?'
    let user = await querySql(userSql,[username])
    console.log(user[0],'查看返回数据')
    // let {id,head_img,nickname} = user[0]
    let {id:user_id,head_img,nickname} = user[0]
    /*    user[0]里的id取名为user_id */
    let sql = 'insert into new_comment(user_id,article_id,cm_content,nickname,head_img,create_time) values(?,?,?,?,?,NOW())'
    let result = await querySql(sql,[user_id,article_id,content,nickname,head_img])
    res.send({code:0,msg:'发表成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  } 
})


//评论列表接口
router.get('/list',async(req,res,next) => {
    let {article_id} = req.query
    try {
      let sql = 'select id,head_img,nickname,cm_content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS creat_time from new_comment where article_id = ?'
                                                                 
      let result = await querySql(sql,[article_id])
      res.send({code:0,msg:'成功',data:result})
    }catch(e){
      console.log(e)
      next(e)
    } 
})


module.exports = router;
