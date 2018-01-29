document.addEventListener('DOMContentLoaded',function(){
    ;jQuery(function($){
    	//轮播图代码部分
    	$('#banner').lzfbanner({
    		imgs:['img/ban1.png','img/ban2.jpg','img/ban3.jpg','img/ban4.jpg','img/ban5.png'],
    		buttons:false,
    		index:0
    	});
        //本周爆品图片切换
        $('.smallList img').on('mouseenter',function(){
            $('.biggood .good1 img').attr({
                'src':this.src
            });
        });
        //商品列表按钮上移动画效果
        $(".index-cart").hover(function() {
            $(this).find(".addcar").stop(false,true).slideDown();
        }, function() {
            $(this).find(".addcar").stop(false,true).slideUp();
        });
        //首页吸顶，附带延时效果
        var toptimer;//定义全局变量
        $(window).scroll( function() {
            clearTimeout(toptimer);//必须要有这句
            if( $(document).scrollTop() > 120 ){
                toptimer = setTimeout(function(){
                    $("#nav").addClass("nav_top");
                    // console.log($(document).scrollTop());
                },16);
            }else{
                toptimer = setTimeout(function(){
                    $("#nav").removeClass("nav_top");
                },16);
            }
        });

        //开始获取数据并生成页面结构：
        //第一部分：热门产品2个
        var hotdog = $("#hotdog .container")[0];
        // console.log(hotdog);
        var status = [200,304];
        var index = 0; //
        var qty = 2;//每页显示商品的数量，注意这里根据页面的大小确认一个固定的数量
        var xhr_hotdog = new XMLHttpRequest();

        xhr_hotdog.onload = function(){
            if(status.includes(xhr_hotdog.status)){
                
                var res_hotdog = JSON.parse(xhr_hotdog.responseText);
                console.log(res_hotdog);

                var ul = document.createElement('ul');
                ul.className = "hotlist fl";
                ul.innerHTML =  res_hotdog.data.map(function(item){
                    return`
                        <li data-guid = "${item.id}">
                                <h2>特色预定</h2>
                                <h3>${item.title}</h3>
                                <h4>${item.comment}</h4>
                                <span class="label">抢鲜</span>
                                <span class="ourprice">￥<i>${item.ourprice}</i></span>
                                <span class="discount">折扣7.5折</span>
                                <span class="listprice">原价￥<i>${item.listprice}</i></span>
                                <a href=""><img src="${item.imgurl}"></a>
                            </li>
                        `
                }).join('');
                // hotdog.innerText = '';
                hotdog.appendChild(ul);
            }
        }

        //2、新建一个接口获取数据:
        xhr_hotdog.open('post','api/index.php',true);
        //3-1、数据请求要写在send方法里面，多个参数以&分开
        //3-2、post与get不同：post请求还要设置一个请求头--固定写法
        xhr_hotdog.setRequestHeader('content-type',"application/x-www-form-urlencoded");

        //3-3 发送请求
        xhr_hotdog.send('index=' + index + '&qty=' + qty);

        //第二部分：水果产品4个
        //1、从端口获取信息并在HTML页面生成对应的结构：
        var fruit1 = document.querySelectorAll("#fruit .style1_rightbox")[0];
        // var fruit1 = $("#fruit .style1_rightbox")[0];
        console.log(fruit1);
        var index = 2; //开始值
        var qty  = 2;//长度每页显示商品的数量，注意这里根据页面的大小确认一个固定的数量
        var xhr_fruit1 = new XMLHttpRequest();
        xhr_fruit1.onload = function(){
            if(status.includes(xhr_fruit1.status)){
                var res_fruit1 = JSON.parse(xhr_fruit1.responseText);
                console.log(res_fruit1);
                var ul = document.createElement('ul');
                ul.className = "fl goods1";
                ul.innerHTML =  res_fruit1.data.map(function(item){
                    return`
                        <li class="index-cart" data-guid="${item.id}">
                            <img src="${item.imgurl}" alt="" />
                            <a href="javascript:;" class="intro">${item.title}</a>
                            <p class="ourprice fl">￥<span>${item.ourprice}</span></p>
                            <p class="listprice fr">￥<span>${item.listprice}</span></p>
                            <a href="#" class="addcar index-cart-button">加入购物车</a>
                        </li>
                        `
                }).join('');          
                fruit1.appendChild(ul);

                 //2、实现商品列表按钮上移动画效果
                $(".index-cart").hover(function() {
                    $(this).find(".addcar").slideDown();
                }, function() {
                    $(this).find(".addcar").slideUp();
                });

                //3、传输对应的商品信息到详情页
                ul.addEventListener('click', function(event){
                    event = event || window.event;
                    var target = event.target || event.srcElement;
                    //判断是否点击了产品
                    if(target.tagName.toLowerCase() === 'img'){
                        var nowLi = target.parentNode; 
                        var transid = nowLi.getAttribute('data-guid'); 
                        var obj = {};
                        // 遍历产品总数组，下面的item指的是数组里面的单个对象元素
                        // 注意，要使用ajax请求传过来的json数组，非常关键：
                        res_fruit1.data.forEach(function(item){
                            // 当鼠标事件获取的transid等于对象里面的id时，把整个对象的内容转移到obj
                             if(item.id === transid){
                                obj = item;
                             }
                        });
                        //固定传递格式
                        var str1 = '?';
                        for(var attr in obj){
                            str1 += attr + '=' + encodeURI(obj[attr]) + '&';
                        }
                        str1 = str1.slice(0,-1);//目的是去掉最后一个“&”

                        location.href = 'http://localhost:2018/html/productdetail.html' + str1;
                    }
                });
                //以上，数据已经可以传递到商品详情页面了 
                //4、实现点击添加对应商品到购物车功能cookie                 
            }
        }
        xhr_fruit1.open('post','api/index.php',true);
     
        xhr_fruit1.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        xhr_fruit1.send('index=' + index + '&qty=' + qty);
        //
        //
        //
        var fruit2 = document.querySelectorAll("#fruit .style1_rightbox")[1];
        console.log(fruit2);
        var index = 2; //开始值
        var qty  = 2;//
        var xhr_fruit2 = new XMLHttpRequest();
        xhr_fruit2.onload = function(){
            if(status.includes(xhr_fruit2.status)){
                var res_fruit2 = JSON.parse(xhr_fruit2.responseText);
                console.log(res_fruit2);
                var ul = document.createElement('ul');
                ul.className = "fruitlist1 fl";
                ul.innerHTML =  res_fruit2.data.map(function(item){
                    return`
                        <li class="index-cart" data-guid="${item.id}">
                            <img src="${item.imgurl}" alt="" />
                            <a href="#" class="intro">${item.title}</a>
                            <p class="ourprice fl">￥<span>${item.ourprice}</span></p>
                            <p class="listprice fr">￥<span>${item.listprice}</span></p>
                            <a href="#" class="addcar index-cart-button">加入购物车</a>
                        </li>
                        `
                }).join('');
              
                fruit2.appendChild(ul);
                 //商品列表按钮上移动画效果
                $(".index-cart").hover(function() {
                    $(this).find(".addcar").slideDown();
                }, function() {
                    $(this).find(".addcar").slideUp();
                });
                //3、传输对应的商品信息到详情页
                ul.addEventListener('click', function(event){
                    event = event || window.event;
                    var target = event.target || event.srcElement;
                    //判断是否点击了产品
                    if(target.tagName.toLowerCase() === 'img'){
                        var nowLi = target.parentNode; 
                        var transid = nowLi.getAttribute('data-guid'); 
                        var obj = {};
                        // 遍历产品总数组，下面的item指的是数组里面的单个对象元素
                        // 注意，要使用ajax请求传过来的json数组，非常关键：
                        res_fruit2.data.forEach(function(item){
                            // 当鼠标事件获取的transid等于对象里面的id时，把整个对象的内容转移到obj
                             if(item.id === transid){
                                obj = item;
                             }
                        });
                        //固定传递格式
                        var str1 = '?';
                        for(var attr in obj){
                            str1 += attr + '=' + encodeURI(obj[attr]) + '&';
                        }
                        str1 = str1.slice(0,-1);//目的是去掉最后一个“&”

                        location.href = 'http://localhost:2018/html/productdetail.html' + str1;
                    }
                });
            }
        }

        xhr_fruit2.open('post','api/index.php',true);
     
        xhr_fruit2.setRequestHeader('content-type',"application/x-www-form-urlencoded");

        xhr_fruit2.send('index=' + index + '&qty=' + qty);

        //第三部分：肉蛋产品6个
        var eggs = $("#eggs .container")[0];
        console.log(eggs);
        
        var index = 4; //
        var qty = 6;//每页显示商品的数量，注意这里根据页面的大小确认一个固定的数量
        var xhr_eggs = new XMLHttpRequest();

        xhr_eggs.onload = function(){
            if(status.includes(xhr_eggs.status)){
                
                var res_eggs = JSON.parse(xhr_eggs.responseText);
                console.log(res_eggs);

                var ul = document.createElement('ul');
                ul.className = "style2_midbox fl";
                ul.innerHTML =  res_eggs.data.map(function(item){
                     return`
                        <li class="index-cart" data-guid="${item.id}">
                            <img src="${item.imgurl}" alt="" />
                            <a href="#" class="intro">${item.title}</a>
                            <p class="ourprice fl">￥<span>${item.ourprice}</span></p>
                            <p class="listprice fr">￥<span>${item.listprice}</span></p>
                            <a href="#" class="addcar index-cart-button">加入购物车</a>
                        </li>
                        `
                }).join('');
               
                eggs.appendChild(ul);
                 //商品列表按钮上移动画效果
                $(".index-cart").hover(function() {
                    $(this).find(".addcar").slideDown();
                }, function() {
                    $(this).find(".addcar").slideUp();
                });
                //3、传输对应的商品信息到详情页
                ul.addEventListener('click', function(event){
                    event = event || window.event;
                    var target = event.target || event.srcElement;
                    //判断是否点击了产品
                    if(target.tagName.toLowerCase() === 'img'){
                        var nowLi = target.parentNode; 
                        var transid = nowLi.getAttribute('data-guid'); 
                        var obj = {};
                        // 遍历产品总数组，下面的item指的是数组里面的单个对象元素
                        // 注意，要使用ajax请求传过来的json数组，非常关键：
                        res_eggs.data.forEach(function(item){
                            // 当鼠标事件获取的transid等于对象里面的id时，把整个对象的内容转移到obj
                             if(item.id === transid){
                                obj = item;
                             }
                        });
                        //固定传递格式
                        var str1 = '?';
                        for(var attr in obj){
                            str1 += attr + '=' + encodeURI(obj[attr]) + '&';
                        }
                        str1 = str1.slice(0,-1);//目的是去掉最后一个“&”

                        location.href = 'http://localhost:2018/html/productdetail.html' + str1;
                    }
                });
            }
        }

        //2、新建一个接口获取数据:
        xhr_eggs.open('post','api/index.php',true);
        //3-1、数据请求要写在send方法里面，多个参数以&分开
        //3-2、post与get不同：post请求还要设置一个请求头--固定写法
        xhr_eggs.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        //3-3 发送请求
        xhr_eggs.send('index=' + index + '&qty=' + qty);

        //第四部分：粮油副食6个
        var rice = $("#rice .container")[0];
        console.log(rice);
        
        var index = 10; //
        var qty = 6;//
        var xhr_rice = new XMLHttpRequest();

        xhr_rice.onload = function(){
            if(status.includes(xhr_rice.status)){
                
                var res_rice = JSON.parse(xhr_rice.responseText);
                console.log(res_rice);

                var ul = document.createElement('ul');
                ul.className = "style2_midbox fl";
                ul.innerHTML =  res_rice.data.map(function(item){
                     return`
                        <li class="index-cart" data-guid="${item.id}">
                            <img src="${item.imgurl}" alt="" />
                            <a href="#" class="intro">${item.title}</a>
                            <p class="ourprice fl">￥<span>${item.ourprice}</span></p>
                            <p class="listprice fr">￥<span>${item.listprice}</span></p>
                            <a href="#" class="addcar index-cart-button">加入购物车</a>
                        </li>
                        `
                }).join('');
               
                rice.appendChild(ul);
                 //商品列表按钮上移动画效果
                $(".index-cart").hover(function() {
                    $(this).find(".addcar").slideDown();
                }, function() {
                    $(this).find(".addcar").slideUp();
                });
                  //3、传输对应的商品信息到详情页
                ul.addEventListener('click', function(event){
                    event = event || window.event;
                    var target = event.target || event.srcElement;
                    //判断是否点击了产品
                    if(target.tagName.toLowerCase() === 'img'){
                        var nowLi = target.parentNode; 
                        var transid = nowLi.getAttribute('data-guid'); 
                        var obj = {};
                        // 遍历产品总数组，下面的item指的是数组里面的单个对象元素
                        // 注意，要使用ajax请求传过来的json数组，非常关键：
                        res_rice.data.forEach(function(item){
                            // 当鼠标事件获取的transid等于对象里面的id时，把整个对象的内容转移到obj
                             if(item.id === transid){
                                obj = item;
                             }
                        });
                        //固定传递格式
                        var str1 = '?';
                        for(var attr in obj){
                            str1 += attr + '=' + encodeURI(obj[attr]) + '&';
                        }
                        str1 = str1.slice(0,-1);//目的是去掉最后一个“&”

                        location.href = 'http://localhost:2018/html/productdetail.html' + str1;
                    }
                });
            }
        }

        //2、新建一个接口获取数据:
        xhr_rice.open('post','api/index.php',true);
        //3-1、数据请求要写在send方法里面，多个参数以&分开
        //3-2、post与get不同：post请求还要设置一个请求头--固定写法
        xhr_rice.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        //3-3 发送请求
        xhr_rice.send('index=' + index + '&qty=' + qty);

        //第五部分：主题产品4个
        var topic1 = document.querySelectorAll("#topic .style1_rightbox")[0];
        var index = 16; //开始值
        var qty  = 2;//长度每页显示商品的数量，注意这里根据页面的大小确认一个固定的数量
        var xhr_topic1 = new XMLHttpRequest();
        xhr_topic1.onload = function(){
            if(status.includes(xhr_topic1.status)){
                var res_topic1 = JSON.parse(xhr_topic1.responseText);
               
                var ul = document.createElement('ul');
                ul.className = "fl";
                ul.innerHTML =  res_topic1.data.map(function(item){
                    return`
                        <li class="index-cart" data-guid="${item.id}">
                            <img src="${item.imgurl}" alt="" />
                            <a href="#" class="intro">${item.title}</a>
                            <p class="ourprice fl">￥<span>${item.ourprice}</span></p>
                            <p class="listprice fr">￥<span>${item.listprice}</span></p>
                            <a href="#" class="addcar index-cart-button">加入购物车</a>
                        </li>
                        `
                }).join('');
              
                topic1.appendChild(ul);
                 // 商品列表按钮上移动画效果
                $(".index-cart").hover(function() {
                    $(this).find(".addcar").slideDown();
                }, function() {
                    $(this).find(".addcar").slideUp();
                });
                 //3、传输对应的商品信息到详情页
                ul.addEventListener('click', function(event){
                    event = event || window.event;
                    var target = event.target || event.srcElement;
                    //判断是否点击了产品
                    if(target.tagName.toLowerCase() === 'img'){
                        var nowLi = target.parentNode; 
                        var transid = nowLi.getAttribute('data-guid'); 
                        var obj = {};
                        // 遍历产品总数组，下面的item指的是数组里面的单个对象元素
                        // 注意，要使用ajax请求传过来的json数组，非常关键：
                        res_topic1.data.forEach(function(item){
                            // 当鼠标事件获取的transid等于对象里面的id时，把整个对象的内容转移到obj
                             if(item.id === transid){
                                obj = item;
                             }
                        });
                        //固定传递格式
                        var str1 = '?';
                        for(var attr in obj){
                            str1 += attr + '=' + encodeURI(obj[attr]) + '&';
                        }
                        str1 = str1.slice(0,-1);//目的是去掉最后一个“&”

                        location.href = 'http://localhost:2018/html/productdetail.html' + str1;
                    }
                });
            }
        }
        xhr_topic1.open('post','api/index.php',true);
     
        xhr_topic1.setRequestHeader('content-type',"application/x-www-form-urlencoded");

        xhr_topic1.send('index=' + index + '&qty=' + qty);
        //
        //
        //
        //
        var topic2 = document.querySelectorAll("#topic .style1_rightbox")[1];
       
        var index = 18; //开始值
        var qty  = 2;//
        var xhr_topic2 = new XMLHttpRequest();
        xhr_topic2.onload = function(){
            if(status.includes(xhr_topic2.status)){
                var res_topic2 = JSON.parse(xhr_topic2.responseText);
                // console.log(res_fruit2);
                var ul = document.createElement('ul');
                ul.className = "fl";
                ul.innerHTML =  res_topic2.data.map(function(item){
                    return`
                        <li class="index-cart" data-guid="${item.id}">
                            <img src="${item.imgurl}" alt="" />
                            <a href="#" class="intro">${item.title}</a>
                            <p class="ourprice fl">￥<span>${item.ourprice}</span></p>
                            <p class="listprice fr">￥<span>${item.listprice}</span></p>
                            <a href="#" class="addcar index-cart-button">加入购物车</a>
                        </li>
                        `
                }).join('');
              
                topic2.appendChild(ul);
                 //商品列表按钮上移动画效果
                $(".index-cart").hover(function() {
                    $(this).find(".addcar").slideDown();
                }, function() {
                    $(this).find(".addcar").slideUp();
                });
                 //3、传输对应的商品信息到详情页
                ul.addEventListener('click', function(event){
                    event = event || window.event;
                    var target = event.target || event.srcElement;
                    //判断是否点击了产品
                    if(target.tagName.toLowerCase() === 'img'){
                        var nowLi = target.parentNode; 
                        var transid = nowLi.getAttribute('data-guid'); 
                        var obj = {};
                        // 遍历产品总数组，下面的item指的是数组里面的单个对象元素
                        // 注意，要使用ajax请求传过来的json数组，非常关键：
                        res_topic2.data.forEach(function(item){
                            // 当鼠标事件获取的transid等于对象里面的id时，把整个对象的内容转移到obj
                             if(item.id === transid){
                                obj = item;
                             }
                        });
                        //固定传递格式
                        var str1 = '?';
                        for(var attr in obj){
                            str1 += attr + '=' + encodeURI(obj[attr]) + '&';
                        }
                        str1 = str1.slice(0,-1);//目的是去掉最后一个“&”

                        location.href = 'http://localhost:2018/html/productdetail.html' + str1;
                    }
                });
            }
        }

        xhr_topic2.open('post','api/index.php',true);
     
        xhr_topic2.setRequestHeader('content-type',"application/x-www-form-urlencoded");

        xhr_topic2.send('index=' + index + '&qty=' + qty);



        //第六部分：这箱有礼6个
        var box = $("#box .container")[0];

        var category = 'box';
        var index = 0; 
        var qty = 6;

        var xhr_box = new XMLHttpRequest();

        xhr_box.onload = function(){
            if(status.includes(xhr_box.status)){

                var res_box = JSON.parse(xhr_box.responseText);
                // console.log(res_box);

                var ul = document.createElement('ul');
                ul.className = "style2_midbox fl";
                ul.innerHTML =  res_box.data.map(function(item){
                     return`
                        <li class="index-cart" data-guid="${item.id}">
                            <a href = "javascript:;">
                                    <img src="${item.imgurl}" alt="" />
                            </a>
                            <a href="#" class="intro">${item.title}</a>
                            <p class="ourprice fl">￥<span>${item.ourprice}</span></p>
                            <p class="listprice fr">￥<span>${item.listprice}</span></p>
                            <a href="#" class="addcar index-cart-button">加入购物车</a>
                        </li>
                        `
                }).join('');
               
                box.appendChild(ul);
                 //商品列表按钮上移动画效果
                $(".index-cart").hover(function() {
                    $(this).find(".addcar").slideDown();
                }, function() {
                    $(this).find(".addcar").slideUp();
                });

                 //3、传输对应的商品信息到详情页---事件委托
                // ul.addEventListener('click', function(event){
                //     event = event || window.event;
                //     var target = event.target || event.srcElement;
                //     //判断是否点击了产品
                //     if(target.tagName.toLowerCase() === 'img'){
                //         var nowLi = target.parentNode; 
                //         var transid = nowLi.getAttribute('data-guid'); 
                //         var obj = {};
                //         // 遍历产品总数组，下面的item指的是数组里面的单个对象元素
                //         // 注意，要使用ajax请求传过来的json数组，非常关键：
                //         res_box.data.forEach(function(item){
                //             // 当鼠标事件获取的transid等于对象里面的id时，把整个对象的内容转移到obj
                //              if(item.id === transid){
                //                 obj = item;
                //              }
                //         });
                //         //固定传递格式
                //         var str1 = '?';
                //         for(var attr in obj){
                //             str1 += attr + '=' + encodeURI(obj[attr]) + '&';
                //         }
                //         str1 = str1.slice(0,-1);//目的是去掉最后一个“&”

                //         location.href = 'http://localhost:2018/html/productdetail.html' + str1;
                //     }
                // });
                //3-2 方式二：利用cookie传递商品详情到===事件委托
                ul.addEventListener('click',function(e){
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    //判断
                    if(target.tagName.toLowerCase() === 'img'){
                        //获取当前的商品id
                        var currentguid = target.parentNode.parentNode.getAttribute('data-guid');
                        console.log(currentguid);
                        //再根据当前的id获得当前产品所有信息
                        var currentgoods = res_box.data.filter(function(item){
                            return item.guid === currentguid;
                        })[0];
                        //将产品信息写入cookie传递到详情页面
                        var now = new Date();
                        now.setDate(now.getDate()+1);
                        document.cookie = 'currentgoods=' + JSON.stringify(currentgoods) + ';expires=' + now;
                    }
                });
            }
        }

        //2、新建一个接口获取数据:post写法
        xhr_box.open('post','api/category.php',true);
        //3-1、数据请求要写在send方法里面，多个参数以&分开
        //3-2、post与get不同：post请求还要设置一个请求头--固定写法
        xhr_box.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        //3-3 发送请求
        xhr_box.send('category='+category+'&index='+index+'&qty='+qty);

        //get写法：
        // xhr_box.open('get','../api/goodscategory.php?category=' + category,true);
        // xhr_box.send();        
 


        //第七部分：生活用品产品4个
        var life1 = document.querySelectorAll("#life .style1_rightbox")[0];
        var category = 'life';
        var index = 0; //开始值
        var qty  = 2;//长度每页显示商品的数量，注意这里根据页面的大小确认一个固定的数量
        var xhr_life1 = new XMLHttpRequest();
        xhr_life1.onload = function(){
            if(status.includes(xhr_life1.status)){
                var res_life1 = JSON.parse(xhr_life1.responseText);
               
                var ul = document.createElement('ul');
                ul.className = "fl";
                ul.innerHTML =  res_life1.data.map(function(item){
                    return`
                        <li class="index-cart" data-guid="${item.id}">
                            <img src="${item.imgurl}" alt="" />
                            <a href="#" class="intro">${item.title}</a>
                            <p class="ourprice fl">￥<span>${item.ourprice}</span></p>
                            <p class="listprice fr">￥<span>${item.listprice}</span></p>
                            <a href="#" class="addcar index-cart-button">加入购物车</a>
                        </li>
                        `
                }).join('');
              
                life1.appendChild(ul);
                 // 商品列表按钮上移动画效果
                $(".index-cart").hover(function() {
                    $(this).find(".addcar").slideDown();
                }, function() {
                    $(this).find(".addcar").slideUp();
                });
                 //3、传输对应的商品信息到详情页
                ul.addEventListener('click', function(event){
                    event = event || window.event;
                    var target = event.target || event.srcElement;
                    //判断是否点击了产品
                    if(target.tagName.toLowerCase() === 'img'){
                        var nowLi = target.parentNode; 
                        var transid = nowLi.getAttribute('data-guid'); 
                        var obj = {};
                        // 遍历产品总数组，下面的item指的是数组里面的单个对象元素
                        // 注意，要使用ajax请求传过来的json数组，非常关键：
                        res_life1.data.forEach(function(item){
                            // 当鼠标事件获取的transid等于对象里面的id时，把整个对象的内容转移到obj
                             if(item.id === transid){
                                obj = item;
                             }
                        });
                        //固定传递格式
                        var str1 = '?';
                        for(var attr in obj){
                            str1 += attr + '=' + encodeURI(obj[attr]) + '&';
                        }
                        str1 = str1.slice(0,-1);//目的是去掉最后一个“&”

                        location.href = 'http://localhost:2018/html/productdetail.html' + str1;
                    }
                });
            }
        }
        xhr_life1.open('post','api/category.php',true);
     
        xhr_life1.setRequestHeader('content-type',"application/x-www-form-urlencoded");

        xhr_life1.send('category='+category+'&index='+index+'&qty='+qty);
        //
        //
        //
        //
        var life2 = document.querySelectorAll("#life .style1_rightbox")[1];
        var category = 'life';
        var index = 2; //开始值
        var qty  = 2;//
        var xhr_life2 = new XMLHttpRequest();
        xhr_life2.onload = function(){
            if(status.includes(xhr_life2.status)){
                var res_life2 = JSON.parse(xhr_life2.responseText);
                console.log(res_life2);
                var ul = document.createElement('ul');
                ul.className = "fl";
                ul.innerHTML =  res_life2.data.map(function(item){
                    return`
                        <li class="index-cart" data-guid="${item.id}">
                            <img src="${item.imgurl}" alt="" />
                            <a href="#" class="intro">${item.title}</a>
                            <p class="ourprice fl">￥<span>${item.ourprice}</span></p>
                            <p class="listprice fr">￥<span>${item.listprice}</span></p>
                            <a href="#" class="addcar index-cart-button">加入购物车</a>
                        </li>
                        `
                }).join('');
              
                life2.appendChild(ul);
                 //商品列表按钮上移动画效果
                $(".index-cart").hover(function() {
                    $(this).find(".addcar").slideDown();
                }, function() {
                    $(this).find(".addcar").slideUp();
                });
                 //3、传输对应的商品信息到详情页
                ul.addEventListener('click', function(event){
                    event = event || window.event;
                    var target = event.target || event.srcElement;
                    //判断是否点击了产品
                    if(target.tagName.toLowerCase() === 'img'){
                        var nowLi = target.parentNode; 
                        var transid = nowLi.getAttribute('data-guid'); 
                        var obj = {};
                        // 遍历产品总数组，下面的item指的是数组里面的单个对象元素
                        // 注意，要使用ajax请求传过来的json数组，非常关键：
                        res_life2.data.forEach(function(item){
                            // 当鼠标事件获取的transid等于对象里面的id时，把整个对象的内容转移到obj
                             if(item.id === transid){
                                obj = item;
                             }
                        });
                        //固定传递格式
                        var str1 = '?';
                        for(var attr in obj){
                            str1 += attr + '=' + encodeURI(obj[attr]) + '&';
                        }
                        str1 = str1.slice(0,-1);//目的是去掉最后一个“&”

                        location.href = 'http://localhost:2018/html/productdetail.html' + str1;
                    }
                });
            }
        }
        xhr_life2.open('post','api/category.php',true);
     
        xhr_life2.setRequestHeader('content-type',"application/x-www-form-urlencoded");

        xhr_life2.send('category='+category+'&index='+index+'&qty='+qty);
    });
})