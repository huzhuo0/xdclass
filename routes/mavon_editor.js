var express = require('express');
var router = express.Router();
const {md5,upload} = require('../utils/index')
const querySql = require('../db/index')

/* mavon_editor富文本上传图片接口 */
router.post('/mavonupload',upload.single('head_img'),(req,res,next) => {
  // console.log(req.file) /* 上传文件时数据是在req.file里面的 */
  let imgPath = req.file.path.split('public')[1]
  /* imgPath的值是这样子的：\uploads\20220515\1652603358729.jpg */
  // 这样前端回显不了，要改成/uploads/20220515/1652603358729.jpg
  let imgUrl = 'http://127.0.0.1:3000'+imgPath.replace(/\\/g,'/')

  res.send({code:0,msg:'上传成功',data:imgUrl})
})

module.exports = router;