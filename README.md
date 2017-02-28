# 简易博客
基于[Angular Express Seed](https://github.com/btford/angular-express-seed)搭建的博客，前端使用[AngularJS](http://angularjs.org/)，后端使用 [Express](http://expressjs.com/)。并使用[Bootstrap](http://www.bootcss.com/)框架，以及[MongoDB](https://www.mongodb.com/)作数据库。
### 运行步骤
1. 安装依赖模块
```
npm install
```
2. 运行
```
npm start
```
3. 在浏览器中打开本地的8000端口: localhost:8000

### 功能介绍
- 能注册，登录。管理员账号: admin@finn.com (需要自己注册，密码任意)
- 有权限管理：
	1. 未登录用户只能看blog和评论，不能发表blog与评论
	2. 普通用户能够看到和评论所有人的blog，只能够修改自己的blog和评论
	3. 可以隐藏所有人的blog或者评论，隐藏后显示“该内容已被管理员隐藏”，（内容被隐藏后，被隐藏的用户自己和管理员能通过编辑看内容）。
- 支持分页和搜索功能
