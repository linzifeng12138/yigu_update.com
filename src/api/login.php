<?php
    include 'connect.php';
    //3、接收来自前端的信息
    $username = isset($_GET['username']) ? $_GET['username'] : '';
    $password = isset($_GET['password']) ? $_GET['password'] : '123456';
    // 4、密码md5加密
    $password = md5($password);

    $sql = "select * from yiguregisterdata where username='$username' and password='$password'";


    // 5、获取查询结果
    $result = $conn->query($sql);
    if($result->num_rows>0){
        echo 'ok';
    }else{
        echo 'fail';
    }

    // 6、释放查询内存(销毁)
    $result->free();

    // 7、关闭连接
    $conn->close();
?>