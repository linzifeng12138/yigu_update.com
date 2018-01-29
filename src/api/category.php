<?php
    //获取某一个对应的商品用category
    //查看具体某个产品的详情操作：获取category
    //
    //5、引进商品全集的接口
    include 'connect.php';

    // 6、在后端获取前端的数据----关键所在         
    $category = isset($_POST['category']) ? $_POST['category'] : null;
    $index    = isset($_POST['index']) ? $_POST['index'] : null;
    $qty      = isset($_POST['qty']) ? $_POST['qty'] : null;

    // 7、获取查询结果集----先筛选出目标商品类别
    $sql = "select * from yigugoodsdata where category='$category'";

    $result = $conn->query($sql);

   
    $row = $result->fetch_all(MYSQLI_ASSOC);//从结果集中取得所有行作为关联数组,MYSQLI_ASSOC表示获取的是值数组
  
    // 7-2截取数据
    $res = array(
        'data' => array_slice($row, $index, $qty),
        'total'=> count($row),
        'qty'  => $qty
    );

    //8、释放查询结果集合
    $result->close();

    // 9/关闭数据库，避免资源浪费
    $conn->close();

    // 10/输出结果到前端html
    echo json_encode($res,JSON_UNESCAPED_UNICODE);
?>