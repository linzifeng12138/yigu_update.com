<?php
   include 'connect.php';
   //4、接收来自前端register.js的用户名、密码信息
   $username = isset($_GET['username']) ? $_GET['username'] : '';
   $password = isset($_GET['password']) ? $_GET['password'] : '123456';

    //5  若不存在相同的用户名，则开始将用户名和密码写入database，
    //以便后面的用户登录验证操作
    //加密信息：md5加密方法
    $password = md5($password);

    /*  扩展知识：hash加密方法：
        password_hash()     //对密码加密.
            * PASSWORD_DEFAULT：Bcrypt加密算法，字段超过60个字符长度，
            * PASSWORD_BCRYPT：字符串长度总为60。
        password_verify()    //验证已经加密的密码，检验其hash字串是否一致.
     */
    // $password = password_hash($password,PASSWORD_DEFAULT);
    // 
    // 6、将加密后的密码写进到数据库insert into 数据库名称 
    $sql = "insert into yiguregisterdata (username,password) values('$username','$password')";
    // 7、获取查询结果，目的是确认新用户的注册信息是否已经
    // 写好在数据库里面，同时给前端返回注册成功的信息判断依据
    // 
    $result = $conn->query($sql);

    if ($result) {
        echo "register is ok";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    //8、关闭连接
    $conn->close();

?>