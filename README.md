# asdiop-server

> asdiop web & socket服务端

## 启动服务

- `node time.js`启动socket服务
- `node app.js`启动web服务

## web管理

- 用户设为有效：`:8341/save?userId=414012720&checked=1`
- 用户设为无效：`:8341/save?userId=414012720&checked=0`
- 查询特定用户：`:8341/user?userId=414012720`
- 查询全部用户：`:8341/users`

## 服务器的部署

- 从[https://nodejs.org/en/download/releases/](https://nodejs.org/en/download/releases/)下载安装Node.js v8.11.x。
- 从[https://gitforwindows.org/](https://gitforwindows.org/)下载安装git命令行工具。
- 创建一个github目录，在此目录中`shift+右键菜单`，启动git 命令行。
- 在命令行中运行`git clone https://github.com/peigong/asdiop-server.git`，拉取系统代码。
- 创建一个与github目录平级的目录`__data__`。如果有旧数据文件users.json，需要迁移至此目录。
- 创建一个与github目录平级的目录`webapps`。
- 进入`github/asdiop-server`目录，`shift+右键菜单`打开命令行，执行`npm install`命令安装项目依赖。
- 在`github/asdiop-server`目录中，`shift+右键菜单`打开命令行，启动服务。

### 本地化NPM配置 ###

> 国内服务器建议使用

用户根目录下如果有NPM本地配置文件`.npmrc`，写入如下内容：

    cd ~
    registry=http://r.cnpmjs.org

如果用户根目录没有`.npmrc`文件，使用以下命令生成：

    cd ~
    echo registry=http://r.cnpmjs.org > .npmrc


**备注：**此配置用于从国内的NPM镜像库更新数据。


