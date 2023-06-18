
## 安装
[Index of /dist/zookeeper (apache.org)](http://archive.apache.org/dist/zookeeper/)
推荐使用 3.5.7 版本
![[Pasted image 20230427104629.png]]
## Docker
[docker-compose 安装-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/896904)
![[Pasted image 20230427110443.png]]

## 构建镜像

### 基础镜像

```bash
dell@vm:~$ docker run --name ubuntu-test -itd ubuntu
db8d914cfc4772414c9668d226c813e4625ace7192a302326cf88b7ec98c7916
dell@vm:~$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED         STATUS         PORTS     NAMES
db8d914cfc47   ubuntu    "bash"    2 minutes ago   Up 2 minutes             ubuntu-test
dell@vm:~$ docker exec -it db bash
root@db8d914cfc47:/# apt update
Get:1 http://archive.ubuntu.com/ubuntu focal InRelease [265 kB]
...
root@db8d914cfc47:/# apt upgrade
Reading package lists... Done
Building dependency tree
...
root@db8d914cfc47:/# apt install -y vim curl net-tools
...
Done.
root@db8d914cfc47:/# apt install -y openssh-server
...
Configuring tzdata
------------------

Please select the geographic area in which you live. Subsequent configuration questions will narrow this down by presenting a list of cities, representing the time zones in which they are located.

Geographic area: 6

Please select the city or region corresponding to your time zone.

Time zone: 71

Current default time zone: 'Asia/Shanghai'
...
root@db8d914cfc47:/# date
Thu Apr 27 12:32:19 CST 2023
root@db8d914cfc47:/# echo "PermitRootLogin yes" >> /etc/ssh/sshd_config
root@db8d914cfc47:/# passwd
New password:123456
Retype new password:123456
passwd: password updated successfully
root@db8d914cfc47:/# service ssh restart
 * Restarting OpenBSD Secure Shell server sshd
root@db8d914cfc47:/# tee /root/start_ssh.sh <<-'EOF'
>
> #!/bin/bash
>
> LOGTIME=$(date "+%Y-%m-%d %H:%M:%S")
> echo "[$LOGTIME] startup run..." >>/root/start_ssh.log
> service ssh start >>/root/start_ssh.log
> EOF
root@db8d914cfc47:~# chmod +x /root/start_ssh.sh
root@db8d914cfc47:~# echo ". /root/start_ssh.sh" >> /root/.bashrc
root@db8d914cfc47:/# exit
exit
dell@vm:~$ docker stop db
db
dell@vm:~$ docker commit db ubuntu-with-ssh:1.0
sha256:35546244fe2b60212ea7c83b9e571f833f25acf81a97f12fddcc2c1ded8d0999
dell@vm:~$ docker images
REPOSITORY         TAG       IMAGE ID       CREATED             SIZE
ubuntu-with-ssh    1.0       35546244fe2b   7 seconds ago       338MB
ubuntu             latest    ba6acccedd29   18 months ago       72.8MB
dell@vm:~$ docker run --name ubuntu-ssh-1 -p 8022:22 -itd ubuntu-with-ssh:1.0
4aa626f84266151fd6064c671e5bd93b0376e17a1ea2c34fa2eaa4889b06e3f2
dell@vm:~$ docker ps
CONTAINER ID   IMAGE                 COMMAND   CREATED         STATUS         PORTS                                   NAMES
4aa626f84266   ubuntu-with-ssh:1.0   "bash"    3 seconds ago   Up 2 seconds   0.0.0.0:8022->22/tcp, :::8022->22/tcp   ubuntu-ssh-1
dell@vm:~$ ssh root@192.168.10.107 -p 8022
root@192.168.10.107's password:
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-146-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

This system has been minimized by removing packages and content that are
not required on a system that users do not log into.

To restore this content, you can run the 'unminimize' command.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

root@4aa626f84266:~#
```

### openjdk-8 镜像

```Dockerfile
FROM ubuntu-with-ssh:1.0
RUN apt install -y openjdk-8-jdk
```

```bash
dell@vm:~/docker/ubuntu-with-openjdk8$ docker build -t ubuntu-with-openjdk8:1.0 .
dell@vm:~/docker/ubuntu-with-openjdk8$ docker run --name ubuntu-1 -p 8022:22 -itd ubuntu-with-openjdk8:1.0
dell@vm:~/docker/ubuntu-with-openjdk8$ ssh root@192.168.10.107 -p 8022
root@192.168.10.107's password:123456
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-146-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

This system has been minimized by removing packages and content that are
not required on a system that users do not log into.

To restore this content, you can run the 'unminimize' command.
Last login: Thu Apr 27 13:08:52 2023 from 192.168.10.107
root@7b9c1bcc0509:~# java -version
openjdk version "1.8.0_362"
OpenJDK Runtime Environment (build 1.8.0_362-8u362-ga-0ubuntu1~20.04.1-b09)
OpenJDK 64-Bit Server VM (build 25.362-b09, mixed mode)
root@7b9c1bcc0509:~#
```

## 安装 docker-compose

1. 下载 https://github.com/docker/compose/releases/download/v2.17.2/docker-compose-linux-x86_64
2. 放到`/usr/local/bin`目录，并创建软链接`/usr/bin/docker-compose -> /usr/local/bin/docker-compose*`
3. 测试
```bash
dell@vm:~$ docker-compose --version
Docker Compose version v2.17.2
```

## 创建zk集群

### 创建容器

使用 docker-compose 创建容量。
```bash
dell@vm:~/docker-compose/zookeeper$ ll
total 9108
drwxrwxr-x 2 dell docker    4096 Apr 27 06:47 ./
drwxrwxr-x 3 dell docker    4096 Apr 27 03:12 ../
-rw-rw-r-- 1 dell dell   9311744 Apr 27 03:14 apache-zookeeper-3.5.7-bin.tar.gz
-rw-rw-r-- 1 dell docker     752 Apr 27 06:08 docker-compose.yml
dell@vm:~/docker-compose/zookeeper$
```

编写配置文件：
```yaml
version: '3'
services:
  zookeeper-1:
    image: ubuntu-with-openjdk8:1.0
    container_name: zk102
    hostname: zk102
    volumes:
      - ./apache-zookeeper-3.5.7-bin.tar.gz:/root/apache-zookeeper-3.5.7-bin.tar.gz
    ports:
      - "8022:22"
    tty: true
  zookeeper-2:
    image: ubuntu-with-openjdk8:1.0
    container_name: zk103
    hostname: zk103
    volumes:
      - ./apache-zookeeper-3.5.7-bin.tar.gz:/root/apache-zookeeper-3.5.7-bin.tar.gz
    ports:
      - "8023:22"
    command: bash
    tty: true
  zookeeper-3:
    image: ubuntu-with-openjdk8:1.0
    container_name: zk104
    hostname: zk104
    volumes:
      - ./apache-zookeeper-3.5.7-bin.tar.gz:/root/apache-zookeeper-3.5.7-bin.tar.gz
    ports:
      - "8024:22"
    tty: true
```

然后启动：
```bash
dell@vm:~/docker-compose/zookeeper$ docker-compose up -d
[+] Running 3/3
 ✔ Container zk104  Started                                                                                                                                                    
 ✔ Container zk102  Started                                                                                                                                                       
 ✔ Container zk103  Started                                                                                                                                                       
dell@vm:~/docker-compose/zookeeper$ docker ps
CONTAINER ID   IMAGE                      COMMAND   CREATED          STATUS          PORTS                                   NAMES
e4e19eac68fc   ubuntu-with-openjdk8:1.0   "bash"    40 minutes ago   Up 34 seconds   0.0.0.0:8023->22/tcp, :::8023->22/tcp   zk103
cce417412a7d   ubuntu-with-openjdk8:1.0   "bash"    40 minutes ago   Up 34 seconds   0.0.0.0:8024->22/tcp, :::8024->22/tcp   zk104
cd452cee4988   ubuntu-with-openjdk8:1.0   "bash"    40 minutes ago   Up 34 seconds   0.0.0.0:8022->22/tcp, :::8022->22/tcp   zk102

```

登录`zk102`，解压`apache-zookeeper-3.5.7-bin.tar.gz` 到根目录。
```bash
root@zk102:~# ll
total 9152
drwx------ 1 root root    4096 Apr 27 14:24 ./
drwxr-xr-x 1 root root    4096 Apr 27 14:09 ../
-rw------- 1 root root     784 Apr 27 12:57 .bash_history
-rw-r--r-- 1 root root    3127 Apr 27 12:57 .bashrc
drwx------ 2 root root    4096 Apr 27 14:09 .cache/
-rw-r--r-- 1 root root     161 Dec  5  2019 .profile
drwx------ 2 root root    4096 Apr 27 14:10 .ssh/
-rw------- 1 root root    8748 Apr 27 14:24 .viminfo
drwxr-xr-x 8 root root    4096 Apr 27 14:29 apache-zookeeper-3.5.7/
-rw-rw-r-- 1 1000 1000 9311744 Apr 27 11:14 apache-zookeeper-3.5.7-bin.tar.gz
-rw-r--r-- 1 root root     564 Apr 27 14:49 start_ssh.log
-rwxr-xr-x 1 root root     147 Apr 27 12:47 start_ssh.sh*
```
在`/root/apache-zookeeper-3.5.7`下创建目录`zkData`，新建一个`myid`文件，并写入"2"，即服务器ID。
```bash
root@zk102:~/apache-zookeeper-3.5.7# cat zkData/myid
2
```
修改`conf/zoo.cfg`，配置**3**台zk服务器：
```bash
root@zk102:~/apache-zookeeper-3.5.7# cat conf/zoo.cfg
# The number of milliseconds of each tick
tickTime=2000
# The number of ticks that the initial
# synchronization phase can take
initLimit=10
# The number of ticks that can pass between
# sending a request and getting an acknowledgement
syncLimit=5
# the directory where the snapshot is stored.
# do not use /tmp for storage, /tmp here is just
# example sakes.
dataDir=/root/apache-zookeeper-3.5.7/zkData
# the port at which the clients will connect
clientPort=2181
# the maximum number of client connections.
# increase this if you need to handle more clients
#maxClientCnxns=60
#
# Be sure to read the maintenance section of the
# administrator guide before turning on autopurge.
#
# http://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_maintenance
#
# The number of snapshots to retain in dataDir
#autopurge.snapRetainCount=3
# Purge task interval in hours
# Set to "0" to disable auto purge feature
#autopurge.purgeInterval=1
server.2=zk102:2888:3888
server.3=zk103:2888:3888
server.4=zk104:2888:3888
```

完成后，分别在`zk103`、`zk104`服务器用`scp -r root@zk102:/root/apache-zookeeper-3.5.7 /root/apache-zookeeper-3.5.7`拷贝文件到服务器，并修改自己服务器的`zkData/myid`为自己的ID。

### 启动

分别在各个服务器上启动zk：`bin/zkServer.sh start`：

先启动zk102，可见未启动成功（服务器数未超过半数2）
```bash
root@zk102:~/apache-zookeeper-3.5.7# bin/zkServer.sh start
/usr/bin/java
ZooKeeper JMX enabled by default
Using config: /root/apache-zookeeper-3.5.7/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
root@zk102:~/apache-zookeeper-3.5.7# bin/zkServer.sh status
/usr/bin/java
ZooKeeper JMX enabled by default
Using config: /root/apache-zookeeper-3.5.7/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Error contacting service. It is probably not running.
```

再启动zk103，可见其被选为leader：
```bash
root@zk103:~/apache-zookeeper-3.5.7# bin/zkServer.sh start
/usr/bin/java
ZooKeeper JMX enabled by default
Using config: /root/apache-zookeeper-3.5.7/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
root@zk103:~/apache-zookeeper-3.5.7# bin/zkServer.sh status
/usr/bin/java
ZooKeeper JMX enabled by default
Using config: /root/apache-zookeeper-3.5.7/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: leader
```

查看zk102，可见其被选为follower：
```bash
root@zk102:~/apache-zookeeper-3.5.7# bin/zkServer.sh status
/usr/bin/java
ZooKeeper JMX enabled by default
Using config: /root/apache-zookeeper-3.5.7/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: follower

```

启动zk104，可见其被选为follower：
```bash
root@zk104:~/apache-zookeeper-3.5.7# bin/zkServer.sh start
/usr/bin/java
ZooKeeper JMX enabled by default
Using config: /root/apaSTARTEDkeeper-3.5.7/bin/../conf/zoo.cfg
root@zk104:~/apache-zookeeper-3.5.7# bin/zkServer.sh status
/usr/bin/java
ZooKeeper JMX enabled by default
Using config: /root/apache-zookeeper-3.5.7/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: follower
```

