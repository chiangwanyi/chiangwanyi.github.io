# MySQL 数据库

## 1. 创建`user`数据库

```mysql
create database user default character 
set utf8 collate utf8_general_ci;
```

## 2. 创建数据表

### 2.1 创建`teacher`数据表

```mysql
create table teacher (
	id int primary key auto_increment comment '教师编号',
	name varchar(50) not null unique comment '教师姓名',
	birthday date not null comment '教出生日期',
	salary float not null default 6000 comment '基本工资'
) engine = INNODB default charset = utf8;
```
### 2.2 创建`student`数据表

```mysql
create table student (
	id int primary key auto_increment comment '学生编号',
	name varchar(50) not null unique comment '学生姓名',
	birthday date not null comment '学生出生日期',
	tid int not null comment '所属老师编号',
	foreign key (tid) references teacher(id)
) engine = INNODB default charset = utf8;
```

## 3. 插入数据

### 3.1 添加到`teacher`表

```mysql
insert into teacher(name, birthday, salary) 
values 
	('Mark', '1980-03-04', 7000),
	('Ryan', '1993-12-12', 5000),
	('Curme', '1989-01-30', 8000)
```

### 3.2 添加到`student`表

```mysql
insert into student(name, birthday, tid)
values
	('Dawn', '1999-9-9', 1),
	('Nora', '2001-12-03', 2),
	('Ann', '1998-07-04', 2)
```

## 4. 查询数据

### 4.1 单表查询

- 查询`salary`大于6000的老师

```mysql
select * from teacher where salary > 6000;
```

- 获得老师的年龄

```mysql
select
	teacher.*, round(datediff(now(), birthday) / 365) as age
from
	teacher;
```

- 根据`salary`排序

```mysql
# 降序
select * from teacher order by salary desc;

# 升序
select * from teacher order by salary asc;
```

![image-20200416114007232](1. 创建数据库.assets/image-20200416114007232.png)

### 4.2 多表查询

## 5. 事务

### 5.1 手动开启事务

```mysql
start transaction;
```

### 5.2 提交事务

```mysql
start transaction;

insert into user value(null, 'admin', 1);

commit;
```

### 5.3 回滚事务

```mysql
start transaction;

insert into user value(null, 'admin', 1);

rollback;
```



## 6. 存储过程

### 6.1 无参无返回值

```mysql
create procedure p1()
begin
	select * from `user`;
end;

call p1();
```

### 6.2 有参无返回值

```mysql
create procedure p2(in uid int)
begin
	select * from `user` where id = uid;
end;

call p2(1);
```

### 6.3 无参有返回值

```mysql
create procedure p3(out s int)
begin 
	select count(*) into s from user;
end;

call p3(@s);

select @s;
```

### 6.4 有参有返回值

```mysql
create procedure p4 (in n varchar(50), out s int)
begin
	select
		count(*) into s
	from
		user
	where
		name like concat('%', n, '%');
end;

call p4('a', @s);

select @s;
```

## 7. 自定义函数

### 7.1 创建自定义函数

**注意：**

在`mysql 8.0`版本后，创建自定义函数前需要运行命令：

```mysql
set global log_bin_trust_function_creators = 1;
```

#### 7.1.1 标量函数 - 返回值

- 无参函数

```mysql
create function Helloworld() returns varchar(20)
begin
return 'Hello, world!';
end;
```

- 有参函数

```mysql
create function MyAdd (num1 float, num2 float) returns float
begin
declare a float;
select num1 + num2 into a;
return a;
```

- 在自定义函数中使用**内置函数**

```mysql
create function AvgSalary() returns float
begin 
	declare avg_salary float;
	select avg(salary) from teacher into avg_salary;
	return avg_salary;
end;
```

### 7.2 使用自定义函数

```mysql
select MyAdd(1, 2);
```

## 8. 游标

### 8.1 创建接收游标数据的表

```mysql
create TABLE tb(
	id int PRIMARY KEY auto_increment,
	name varchar(10),
	age int
);
```

该表的结构要与游标查询的表结构一致

### 8.2 定义游标

```mysql
create procedure user_cursor()
begin
	declare id INT;
	declare name varchar(10);
	declare age int;

	declare flag int default 0;

	declare mycursor cursor for select * from user;
	declare continue handler for not found set flag = 1;

	open mycursor;

	label:loop
		fetch mycursor into id, name, age;

		if flag = 1 then
			leave label;
		end if;

		insert into tb values(id, name, age);
	end loop;
	
	close mycursor;
end;
```

### 8.3 使用游标

```mysql
call user_cursor();
```



```mysql

```

