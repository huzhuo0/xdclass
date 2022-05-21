module.exports = {
  apps : [{ /* apps是固定参数，值是数组，数组里面就是我们的进程信息，每个进程都用一个对象来包裹住就OK了 */
  name:'hzapp', /* 进程名称 */
    script: './bin/www', /* 我们要执行的地址 */
    // args: 'one two', 传参用的，我们不需要
    instances:1,/* 要开启的进程数 */
    autorestart:true,/* 设置进程自动重启 */
    // watch: '.',
    watch:true,/* 监听文件变化进程就会重启 */
    ignore_watch:["node_modules","logs"],
    "error_file":"./logs/app-err.log",/* 配置错误日志存放文件路径 */
    "out_file":"./logs/app-out.log",
    "log_date_format":"YYYY-MM-DD HH:mm:ss",/* 给每行日志标记一个时间 */
    max_memeor_restart:'1G',/* 运行最大内存，当运行内存超过1G就会自动的帮我们重启 */
    env:{
        NODE_ENV:'development'
    },
    env_production:{
      NPDE_ENV:'production'/* 设置环境变量的 */
    }

  }, /* {
    script: './service-worker/',
    watch: ['./service-worker']
  } */],

  deploy : {/* 自动化部署的配置 */
    // production : {
    //   user : 'SSH_USERNAME',
    //   host : 'SSH_HOSTMACHINE',
    //   ref  : 'origin/master',
    //   repo : 'GIT_REPOSITORY',
    //   path : 'DESTINATION_PATH',
    //   'pre-deploy-local': '',
    //   'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
    //   'pre-setup': ''
    // }
    // production:{
    //   user : 'node',/* 服务器上的user名 */
    //   host : '212.83.163.1',
    //   ref  : 'origin/master',
    //   repo : 'git@github.com:repo.git',
    //   path : '/var/www/production',
    //   'post-deploy' : 'npm install &&pm2 reload ecosystem.config.js --env production',
    // }
    production:{
      user : 'root',/* 服务器上的user名,我们服务器上的登录名是root */
      host : '192.168.21.128',/* 服务器的ip地址 */
      ref  : 'origin/master', /* git上的分支，我们自动化部署其实就是我们输入命令之后我们
                                会远程拉取git上的仓库到我们的服务器上，把clone下来，然后又会自动的去帮我们安装依赖，
                                然后去启动我们的pm2去部署我们的项目 */
      repo : 'git@github.com:xd-eric/myblog.git',/* git上项目ssh地址 */
      path : '/usr/local/myProject',/* 存放的服务器上的路径 */
      ssh_options:"StrictHostKeyChecking=no",/* 设置秘钥的确认检测，我们这里设置为no
                   因为严格模式下的确认检测会把我们自动化的一些东西中断 */
      'post-deploy' : 'npm install &&pm2 reload ecosystem.config.js --env production',
      /* 这个语句是我们项目部署之后会自动运行的命令 */
      'env':{
        "NODE_ENV":"production"
      }
    }
  }
};
