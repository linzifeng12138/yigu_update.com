document.addEventListener('DOMContentLoaded',function(){
    ;jQuery(function($){
    	//板块功能一：轮播图代码部分
    	$('#banner').lzfbanner({
    		imgs:['img/ban1.png','img/ban2.jpg','img/ban3.jpg','img/ban4.jpg','img/ban5.png'],
    		buttons:false,
    		index:0
    	});
        //本周爆品图片切换，注意鼠标上移有高亮效果是用css的hover完成
        $('.smallList img').on('mouseenter',function(){
            $('.biggood .good1 img').attr({
                'src':this.src
            });
        });
        //板块功能二：首页吸顶，附带延时效果
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

        //板块功能三：获取数据并生成页面主体结构：
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
        var category = 'fruit';
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
                            <a href = "javacript:;">
                                    <img src="${item.imgurl}" alt="" />
                            </a>
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
                //函数封装：
                // detailshow(ul,res_fruit1.data);
                //以上，数据已经可以传递到商品详情页面了 
                //4、实现点击添加对应商品到购物车功能cookie                 
            }
        }
        //2、新建一个接口获取数据:post写法
        xhr_fruit1.open('post','api/category.php',true);
        //3-1、数据请求要写在send方法里面，多个参数以&分开
        //3-2、post与get不同：post请求还要设置一个请求头--固定写法
        xhr_fruit1.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        //3-3 发送请求
        xhr_fruit1.send('category='+category+'&index='+index+'&qty='+qty);




        var fruit2 = document.querySelectorAll("#fruit .style1_rightbox")[1];
        console.log(fruit2);
        var category = 'fruit';
        var index = 2; //开始值
        var qty  = 2;

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
                            <a href = "javacript:;">
                                    <img src="${item.imgurl}" alt="" />
                            </a>
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
                //函数封装：
                // detailshow(ul,res_fruit2.data);
            }
        }

         //2、新建一个接口获取数据:post写法
        xhr_fruit2.open('post','api/category.php',true);
        //3-1、数据请求要写在send方法里面，多个参数以&分开
        //3-2、post与get不同：post请求还要设置一个请求头--固定写法
        xhr_fruit2.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        //3-3 发送请求
        xhr_fruit2.send('category='+category+'&index='+index+'&qty='+qty);


        //第三部分：肉蛋产品6个
        var eggs = $("#eggs .container")[0];
        console.log(eggs);

        var category = 'milk';
        var index = 0; //
        var qty = 6;
        //每页显示商品的数量，注意这里根据页面的大小确认一个固定的数量
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
                            <a href = "javacript:;">
                                    <img src="${item.imgurl}" alt="" />
                            </a>
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
                //函数封装：
                // detailshow(ul,res_eggs.data);
            }
        }

        //2、新建一个接口获取数据:post写法
        xhr_eggs.open('post','api/category.php',true);
        //3-1、数据请求要写在send方法里面，多个参数以&分开
        //3-2、post与get不同：post请求还要设置一个请求头--固定写法
        xhr_eggs.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        //3-3 发送请求
        xhr_eggs.send('category='+category+'&index='+index+'&qty='+qty);


        //第四部分：粮油副食6个
        var rice = $("#rice .container")[0];
        console.log(rice);
        
        var category = 'rice';
        var index = 0; //开始值
        var qty  = 6;

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
                            <a href = "javacript:;">
                                    <img src="${item.imgurl}" alt="" />
                            </a>
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
                //函数封装：
                // detailshow(ul,res_rice.data);
            }
        }

        //2、新建一个接口获取数据:post写法
        xhr_rice.open('post','api/category.php',true);
        //3-1、数据请求要写在send方法里面，多个参数以&分开
        //3-2、post与get不同：post请求还要设置一个请求头--固定写法
        xhr_rice.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        //3-3 发送请求
        xhr_rice.send('category='+category+'&index='+index+'&qty='+qty);


        //第五部分：主题产品4个
        var topic1 = document.querySelectorAll("#topic .style1_rightbox")[0];

        var category = 'cake';
        var index = 0; //开始值
        var qty  = 2;

        var xhr_topic1 = new XMLHttpRequest();
        xhr_topic1.onload = function(){
            if(status.includes(xhr_topic1.status)){
                var res_topic1 = JSON.parse(xhr_topic1.responseText);
               
                var ul = document.createElement('ul');
                ul.className = "fl";
                ul.innerHTML =  res_topic1.data.map(function(item){
                    return`
                        <li class="index-cart" data-guid="${item.id}">
                            <a href = "javacript:;">
                                    <img src="${item.imgurl}" alt="" />
                            </a>
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
                //函数封装：
                // detailshow(ul,res_topic1.data);
            }
        }
         //2、新建一个接口获取数据:post写法
        xhr_topic1.open('post','api/category.php',true);
        //3-1、数据请求要写在send方法里面，多个参数以&分开
        //3-2、post与get不同：post请求还要设置一个请求头--固定写法
        xhr_topic1.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        //3-3 发送请求
        xhr_topic1.send('category='+category+'&index='+index+'&qty='+qty);




        var topic2 = document.querySelectorAll("#topic .style1_rightbox")[1];
        var category = 'cake';
        var index = 2; //开始值
        var qty  = 2;//

        var xhr_topic2 = new XMLHttpRequest();
        xhr_topic2.onload = function(){
            if(status.includes(xhr_topic2.status)){
                var res_topic2 = JSON.parse(xhr_topic2.responseText);
                console.log('主题2：' + res_topic2);
                var ul = document.createElement('ul');
                ul.className = "fl";
                ul.innerHTML =  res_topic2.data.map(function(item){
                    return`
                        <li class="index-cart" data-guid="${item.id}">
                            <a href = "javacript:;">
                                    <img src="${item.imgurl}" alt="" />
                            </a>
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
                //函数封装：
                // detailshow(ul,res_topic2.data);
            }
        }
        //2、新建一个接口获取数据:post写法
        xhr_topic2.open('post','api/category.php',true);
        //3-1、数据请求要写在send方法里面，多个参数以&分开
        //3-2、post与get不同：post请求还要设置一个请求头--固定写法
        xhr_topic2.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        //3-3 发送请求
        xhr_topic2.send('category='+category+'&index='+index+'&qty='+qty);



        //第六部分：这箱有礼6个
        var box = $("#box .container")[0];

        var category = 'box';
        var index = 0; 
        var qty = 6;

        var xhr_box = new XMLHttpRequest();

        xhr_box.onload = function(){
            if(status.includes(xhr_box.status)){

                var res_box = JSON.parse(xhr_box.responseText);
                
                console.log('开箱有礼：'  + res_box);
                var ul = document.createElement('ul');
                ul.className = "style2_midbox fl";
                ul.innerHTML =  res_box.data.map(function(item){
                     return`
                        <li class="index-cart" data-guid="${item.id}">
                            <a href = "javacript:;">
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
                console.log(res_box.data);
                //3-2 方式二：利用cookie传递商品详情到===事件委托
                ////函数封装：
                // detailshow(ul,res_box.data);
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
                            <a href = "javacript:;">
                                    <img src="${item.imgurl}" alt="" />
                            </a>
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
                //3-2 方式二：利用cookie传递商品详情到===事件委托
                 //函数封装：
                // detailshow(ul,res_life1.data);
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
                            <a href="javascript:;">
                                    <img src="${item.imgurl}" alt="" />
                                    </a>
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
                //3-2 方式二：利用cookie传递商品详情到===事件委托
                //函数封装：
                // detailshow(ul,res_life2.data);
                // 方式1：利用location传递参数
                // locationload (ul,res_life2.data); 
                // var carlist = [];
                // var cookies = document.cookie.split('; ');
                // if(cookies.length){
                //     cookies.forEach(function(item){
                //         var arr = item.split('=');
                //         if(arr[0] === 'carlist'){
                //             carlist = JSON.parse(arr[1]);
                //         }
                //     })
                // } 
                //利用事件委托
                // ul.addEventListener('click',function(e){
                //     e = e || window.event;
                //     var target = e.target || e.srcElement;
                //     if(target.tagName.toLowerCase()==='img'){
                //         var currentli = target.parentNode.parentNode;
                //         var currentid = currentli.dataset.guid;
                //         //判断carlist中是否已经包含了相同的商品信息
                //         for(var i=0,len=carlist.length;i<len;i++){
                //             if(carlist[i].currentid === currentid){
                //                 break;
                //             }
                //         }
                //         //遍历结束还是没有发现相同的guid的话就说明添加了新的产品
                //         if(i===carlist.length){
                //             var goods = {
                //                 currentid:currentid,
                //                 imgurl:currentli.children[0].children[0].src,
                //                 name:currentli.children[1].innerText,
                //                 listprice:currentli.children[3].children[0].innerText,
                //                 ourprice:currentli.children[2].children[0].innerText,
                //                 qty:1
                //             }
                //             carlist.unshift(goods);
                //         }else{
                //             carlist[i].qty++;
                //         }
                //         document.cookie = 'goodslist=' + JSON.stringify(carlist);
                //     }
                // })          
            }
        }
        xhr_life2.open('post','api/category.php',true);
     
        xhr_life2.setRequestHeader('content-type',"application/x-www-form-urlencoded");

        xhr_life2.send('category='+category+'&index='+index+'&qty='+qty);

        //板块功能四：点击菜单导航栏跳转到商品列表页面并加载指定的商品类别的数据
        var tab = document.querySelector('#showlist .tabmain');

        tab.addEventListener('click',function(e){
            e = e || window.event;
            var target = e.target || e.srcElement;
            // 若点击的事件源对象为a标签，则获取源对象所在的li 的category参数
            if(target.tagName.toLowerCase()==="a"){
                var nowli = target.parentNode;
                var category = nowli.getAttribute("data-category");
                location.href = "html/productlist.html" + "?" + "category=" + category;
            }
        });      
    });
})