<?php
    //直接操作硬盘数据的写法：在本次项目之中无作用，统一使用MySQL加ajax
    //
    //5、接收来自前端的信息请求
    //
    $index = isset($_POST['index']) ? $_POST['index'] : 1;//
    $qty = isset($_POST['qty']) ? $_POST['qty'] : 10;//


    //6、从硬盘存储的json文件中调取数据
    $file_url = './data/index.json';//共用

    $myfile = fopen($file_url, 'r');

    $content  = fread($myfile, filesize($file_url));//返回的是字符串

    // 将读取到的内容转化成数组：
    
    $arr_data = json_decode($content);

    // 根据分页截取数据：{data:[],total:100}并加工数据

    $res = array(
         'data' => array_slice($arr_data, $index, $qty),
         // 'total'=> count($arr_data_hotdog),
         'qty'  => $qty
    );

    // 输出json字符串到前端页面后关闭文件 
    echo json_encode($res,JSON_UNESCAPED_UNICODE);

    fclose($myfile);
?>