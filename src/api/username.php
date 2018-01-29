<?php
    include 'connect.php';
   //4、接收来自前端register.js的用户名、密码信息
   $username = isset($_GET['username']) ? $_GET['username'] : '';
   $password = isset($_GET['password']) ? $_GET['password'] : '123456';

   //5、查看database中该用户名是否已经存在
   $sql = "select username from yiguregisterdata where username='$username'";
   //6、在实例化对象后，我们可以使用‘->’操作该对象调用成员属性/方法
   //查询并判断
   $result = $conn->query($sql);

   if($result->num_rows>0){
        echo  "username is fail";
        //7-1 如果num_rows>0为true的话，表明数据库已存在相同的用户名，就用echo
        //传递fail信号给前端 
   }
   else {
        echo  "username is ok";
   }
   //如果传过来的用户名经过数据库的查询发现没问题的就给前端回传以下的信息：
   // echo "username is ok"
?>