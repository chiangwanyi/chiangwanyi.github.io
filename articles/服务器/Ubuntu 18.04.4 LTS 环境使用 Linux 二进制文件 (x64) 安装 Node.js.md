## 1. 新建文件夹
例如选择 `/usr/local/lib/nodejs` 放置 node 文件
```shell
mkdir /usr/local/lib/nodejs
```

## 2. 下载 node 二进制文件
我们可以在 node [官网](https://nodejs.org/en/download/)下载最新的 Linux 二进制文件，并复制下载链接，然后使用下列命令下载二进制包
```shell
cd /usr/local/lib/nodejs
wget https://nodejs.org/dist/v12.16.2/node-v12.16.2-linux-x64.tar.xz
```
## 3. 解压
```shell
tar xvJf node-v12.16.2-linux-x64.tar.xz
```

## 4. 测试
```shell
cd node-v12.16.2-linux-x64/bin
./node -v
```
如果看到 `v12.16.2`，证明下载的 node 的文件没有问题

## 5. 配置环境变量
```shell
vim /etc/profile
```
在 profile 文件末尾添加 `export PATH=$PATH:/usr/local/lib/nodejs/node-v12.16.2-linux-x64/bin`，保存退出

## 6. 更新配置
```shell
source /etc/profile
```
## 7. 验证安装
```shell
node -v
npm -v
```
如果能够正常看到版本号输出，Node.js 就安装好了

