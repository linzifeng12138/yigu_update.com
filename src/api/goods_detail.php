<?php
/**
 * @Author: Marte
 * @Date:   2018-01-27 10:24:27
 * @Last Modified by:   Marte
 * @Last Modified time: 2018-01-27 11:34:17
 */
    include 'connect.php';
    // 在后端获取前端的数据
    // 必须注意前后端的接口类型必须保持一致，建议使用$_REQUEST作为后端接口，兼容get和post请求
    $id = isset($_REQUEST['currentid']) ? $_REQUEST['currentid'] : null;

    // sql语句
    $sql = "select * from yigugoodsdata where id=$id";

    // 查询
    $result = $conn->query($sql);

    $row = $result->fetch_assoc();

    //释放查询结果集
    $result->close();

    //关闭数据库连接
    $conn->close();

    echo json_encode($row,JSON_UNESCAPED_UNICODE);
?>