require(['config'],function(){
    require(['jquery'],function($){
        
        //第一个功能：用户名输入框失去焦点时，就发起ajax请求验证用户是否已经存在
        //且如果用户名不存在的情况就继续注册
        $('#registerbox .username').on('blur',function(){
            var _username = $('.username').val();
            //用户名输入注意去掉前后的多余空格
            _username = _username.trim();
            console.log(typeof(_username));
            console.log(_username);
            //判断用户名输入是否合乎规范
            var reg = /^[a-z][\da-z]{5,10}$/i;

            if(!reg.test(_username)){
                // alert1.innerText = "用户名不合标准";
                alert('用户名只能是6-11位数字或字母组成，只能以字母开头，不能为空,用户名内部不能使用空格隔开');
                // $('.username').val('');//清空不合格的输入数据，不能写这句话，会陷入死循环
                location = location;
                return false;

            }

            $.ajax({
                url:'../api/username.php',
                data:{
                    username:_username
                },
                success:function(data){
                    //如果用户名检验发现已存在重复就结束，不让其注册
                    if(data === 'username is fail'){                    
                        alert('用户名已存在，请重新输入');
                        return false;
                    }; 

                    console.log(data);
                    //只有后端返回提示信息说用户名不存在重复，才允许用户继续注册
                    if(data === 'username is ok'){
                        $('#btnreg').on('click',function(){
                            // var _username = $('.username').val();
                            var _password = $('.pass1').val();
                            var _password_con = $('.pass2').val();
                            //注意：密码也要去掉前后多余的空格

                            var reg = /^[\da-z]{6,11}$/;
                            if(!reg.test(_password)){
                                // alert1.innerText = "用户名不合标准";
                                alert('密码只能是6-11位数字或字母且不能为空');       
                                return false;
                            }
                            if(_password !== _password_con){
                                alert('两次输入的密码必须一致！');
                                return false;
                            }
                            //2/发起ajax请求到后端数据库验证
                            //3、发送用户名和密码到PHP接口：register.php
                            //目的是写入数据库
                            $.ajax({
                                url:'../api/register.php',
                                data:{
                                    username:_username,
                                    password:_password_con
                                },             
                                success:function(data){
                                    console.log(data);
                                   
                                    if(data === 'register is ok'){
                                        // //清空已经输入的信息
                                        // $('.username').val('');
                                        // $('.pass1').val('');
                                        // $('.pass2').val('');
                                        alert('恭喜注册成功');
                                        location=location;//刷新当前页面，避免重复注册时的信息bug
                                    }                            
                                }
                            });
                        });  
                    }                                             
                }
            });
        })
        //第二个功能：必须点击同意用户协议，否则无法提交信息
        // var agree = document.getElementById('agree');   
        // agree.onclick = function(){
        //     // 如何判断一个复选框是否勾选
        //     if(agree.checked){
        //         // btn1.disabled = false;
        //         $('#btnreg').fadeIn();
        //         // btn1.removeAttribute('disabled');
        //     }else{
        //          $('#btnreg').fadeOut();
        //         // btn1.disabled = true;
        //     }
        // }
        var agree = $('#registerbox .agreebox #agree');
        agree.on('click',function(){
            if(agree.prop('checked',true)){
                $('#btnreg').fadeIn();
            }else{
                $('#btnreg').fadeOut();
            }
        })
    })
})