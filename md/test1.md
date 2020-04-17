# Mybatis 项目搭建 (IDEA)

一个简单的 Mybatis 项目，实现了增删改查功能，具体步骤如下

## 1. 导入依赖

> pom.xml

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <source>7</source>
                <target>7</target>
            </configuration>
        </plugin>
    </plugins>
</build>

<dependencies>
    <!-- mysql 驱动-->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.15</version>
    </dependency>

    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.2</version>
    </dependency>

    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.10</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```


## 2. 配置`db.properties`

> src/main/resources/db.properties

数据库使用的是 `mysql 8.0`

```properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatisuseSSL=false&useUnicode=true&characterEncoding=utf8&serverTimezone=UTC
username=root
password=123456
```



## 3. 创建工具类`MybatisUtils`

> src/main/java/com/utils/MybatisUtils.java

该工具类的主要作用是，通过读取配置文件`mybatis-config.xml`返回`SqlSessionFactory`

```java
public class MybatisUtils {
    private static SqlSessionFactory sqlSessionFactory;

    static {
        try {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static SqlSession getSqlSession() {
        return sqlSessionFactory.openSession();
    }
}
```



## 4. 创建业务相关类

### 4.1 `POJO`

> src/main/java/com/pojo/Blog.java

```java
@Data
@AllArgsConstructor
public class Blog {
    private String id;
    private String title;
    private String author;
    private Date createdAt;
    private int views;
}
```

这里使用了`lombok`快速创建了`Blog`的 `setter`, `getter`, `constructor` 等方法

![image-20200407155337519](http://q8aqauxg5.bkt.clouddn.com/image-20200407155337519.png)

### 4.2 `Mapper`

> src/main/java/com/mapper/BlogMapper.java

基础的 CRUD 接口

```java
public interface BlogMapper {
    int insertBlog(Blog blog);

    int deleteBlog(String id);

    int updateBlog(Blog blog);

    int updateBlogByMap(Map<String, Object> map);

    Blog queryBlogByID(String id);

    List<Blog> queryAllBlog();

    // 模糊查询
    List<Blog> searchBlogByTitleKey(String key);
}
```

## 5. 配置`mybatis-config.xml`

> src/main/resources/mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!-- 使用外部属性文件 -->
    <properties resource="db.properties"/>

    <settings>
        <!-- 开启驼峰命名自动映射 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        <!-- 指定 MyBatis 所用日志的具体实现 -->
        <setting name="logImpl" value="STDOUT_LOGGING"/>
        <!-- 显式的开启缓存（cacheEnabled 默认为 true）-->
        <setting name="cacheEnabled" value="true"/>
    </settings>

    <!-- 为包下的所有 Java Bean 设置缩写名字 -->
    <typeAliases>
        <package name="com.pojo"/>
    </typeAliases>

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <mapper resource="com/mapper/BlogMapper.xml"/>
    </mappers>
</configuration>
```

## 6. 配置`BlogMapper.xml`

> src/main/resources/com/mapper/BlogMapper.xml

`Mapper.xml`配置文件最好是创建在`resources`文件夹中与`Mapper.java`同包名的文件夹中，这样在部署运行时，配置文件和类文件会在同一文件夹下

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.mapper.BlogMapper">
    <insert id="insertBlog" parameterType="blog">
        insert into mybatis.blog(id, title, author, created_at, views)
            value (#{id}, #{title}, #{author}, #{createdAt}, #{views});
    </insert>

    <delete id="deleteBlog" parameterType="string">
        delete
        from mybatis.blog
        where id = #{id};
    </delete>

    <update id="updateBlog" parameterType="blog">
        update mybatis.blog
        set title  = #{title},
            author = #{author},
            views  = #{views}
        where id = #{id};
    </update>

    <update id="updateBlogByMap" parameterType="map">
        update mybatis.blog
        <set>
            <if test="title != null">title = #{title},</if>
            <if test="author != null">author = #{author},</if>
            <if test="views != null">views = #{views},</if>
        </set>
        where id = #{bid};
    </update>

    <select id="queryBlogByID" parameterType="string" resultType="blog">
        select *
        from mybatis.blog
        where id = #{id};
    </select>

    <select id="queryAllBlog" resultType="blog">
        select *
        from mybatis.blog;
    </select>

    <select id="searchBlogByTitleKey" resultType="blog">
        select *
        from mybatis.blog
        where title like concat('%', #{key}, '%');
    </select>
</mapper>
```

## 7. 测试

### 7.1 插入数据

```java
public void insertBlog() {
    try (SqlSession sqlSession = MybatisUtils.getSqlSession()) {
        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
        int i = mapper.insertBlog(new Blog("a", "test", "jwy", new Date(), 0));
        if (i == 1) {
            System.out.println("成功");
        }
        sqlSession.commit();
    }
}
```

### 7.2 删除数据

```java
public void deleteBlog() {
    try (SqlSession sqlSession = MybatisUtils.getSqlSession()) {
        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
        int i = mapper.deleteBlog("a");
        if (i == 1) {
            System.out.println("成功");
        }
        sqlSession.commit();
    }
}
```

### 7.3 更新数据（全部更新）

```java
public void updateBlog() {
    try (SqlSession sqlSession = MybatisUtils.getSqlSession()) {
        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
        int i = mapper.updateBlog(new Blog("5d47f00c86974c4db607a582706421a3", "修改了", "jwy", new Date(), 0));
        if (i == 1) {
            System.out.println("成功");
        }
        sqlSession.commit();
    }
}
```

### 7.4 更新数据（按需更新）

```java
public void updateBlogByMap() {
    try (SqlSession sqlSession = MybatisUtils.getSqlSession()) {
        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
        Map<String, Object> map = new HashMap<>();
        map.put("bid", "00d42657c6b54b12b1315d9d29ef4d76");
        map.put("views", 0);
        int i = mapper.updateBlogByMap(map);
        if (i == 1) {
            System.out.println("成功");
        }
        sqlSession.commit();
    }
}
```

### 7.5 查询数据（通过 ID）

```java
public void queryBlogByID() {
    try (SqlSession sqlSession = MybatisUtils.getSqlSession()) {
        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
        Blog blog = mapper.queryBlogByID("00d42657c6b54b12b1315d9d29ef4d76");
        System.out.println(blog);
    }
}
```

### 7.6 查询所有数据

```java
public void queryAllBlog() {
    try (SqlSession sqlSession = MybatisUtils.getSqlSession()) {
        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
        List<Blog> blogs = mapper.queryAllBlog();
        for (Blog blog : blogs) {
            System.out.println(blog);
        }
    }
}
```

### 7.7 模糊查找

```java
public void searchBlogByTitleKey() {
    try (SqlSession sqlSession = MybatisUtils.getSqlSession()) {
        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
        List<Blog> blogs = mapper.searchBlogByTitleKey("a");
        for (Blog blog : blogs) {
            System.out.println(blog);
        }
    }
}
```
