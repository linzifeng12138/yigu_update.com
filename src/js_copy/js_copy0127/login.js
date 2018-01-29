require(['config'],function(){
    require(['jquery'],function($){
        //1、点击提交按钮发送登录信息到后端
        $('.finish').on('click',function(){
            var _username = $('.username').val();
            var _password = $('.pass1').val();

            // 2、发起ajax请求
            $.ajax({
                // hardcode
                url:'../api/login.php',
                data:{
                    username:_username,
                    password:_password
                },
                success:function(data){
                    if(data === 'fail'){
                        alert('不存在该用户，请重试！');
                        location=location;//刷新当前页面，避免重复注册时的信息bug
                        return false;
                    }
                    console.log(data);
                    if(data === 'ok'){
                        alert('登录成功');
                        location=location;//刷新当前页面，避免重复注册时的信息bug
                        //加深要求：获取这里的用户名称，并自动跳转到首页，首页的左上角会出现用户，并点击“记住我”有七天免登陆的效果
                    }
                }
            })
        })
    })
})