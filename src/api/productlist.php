<?php
    //商品列表页分页处理
    //5、引进商品全集的接口
    include 'connect.php';

    // 6、在后端获取前端的数据----关键所在         
    $category = isset($_POST['category']) ? $_POST['category'] : null;
    $page_no  = isset($_POST['pageNo']) ? $_POST['pageNo'] : 1;
    $qty      = isset($_POST['qty']) ? $_POST['qty'] : 16;

    // 7、获取查询结果集----先筛选出目标商品类别，注意这里面的'$category'外面的单引号不可以省略
    $sql = "select * from yigugoodsdata where category='$category'";

    $result = $conn->query($sql);

   
    $row = $result->fetch_all(MYSQLI_ASSOC);//从结果集中取得所有行作为关联数组,MYSQLI_ASSOC表示获取的是值数组
  
    // 7-2截取数据
    $res = array(
        'data' => array_slice($row, ($page_no-1)*$qty, $qty),
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