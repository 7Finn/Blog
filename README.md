# Angular Express Seed Example App

Based on the [Angular Express Seed](https://github.com/btford/angular-express-seed), this simple app illustrates how to use [AngularJS](http://angularjs.org/) and [Express](http://expressjs.com/) on a [Node.js](http://nodejs.org/) server to make a simple blog.


服务运行的端口是8000

管理员账号: admin@finn.com (需要自己注册)
权限分三级:
	1.未登录用户只能看blog和评论，不能发表blog与评论
	2.普通用户能够看到和评论所有人的blog，只能够修改自己的blog和评论
	3.可以隐藏所有人的blog或者评论，隐藏后显示“该内容已被管理员隐藏”

内容被隐藏后，被隐藏的用户自己和管理员能通过编辑看内容。
有分页和搜索功能，文本可显示换行