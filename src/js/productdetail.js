//模块化开发操作：
require(['config'],function(){
    require(['jquery','lzfzoom','common'],function($,zoom,com){
        // 1-1、获取HTML页面上的对应的元素
        var imgplacebig    = document.querySelector("#detail .biglist .targetpic");
        var imgplacesmall1 = document.querySelector("#detail .smallList .targetpic");
        // var imgplacesmall2 = document.querySelector("#detail .smallList .other1");
        var titleplace     = document.querySelector('#detail .textbox .title');
        var commentplace   = document.querySelector('#detail .textbox .comment');
        var listplace      = document.querySelector('#detail .textbox .listprice');
        var ourplace       = document.querySelector('#detail .textbox .ourprice');

        // 获取数量input表单元素，实现用户自定义购买数量
        var qty = document.querySelector('#detail .amount #qty');
        // 获取购物车点击的按钮元素，注意要给该元素添加自定义id属性，详见封装函数detailload
        var addcar = document.querySelector('#detail .addtocar');

        // 三、实现购物车添加功能cookie，和购物车飞入动画效果
        // 购物车3-1：新建一个空的数组，用于保存购物车中的商品信息
        // 注意一定要将carlist定义成一个全局变量
        var goods = {};//创建一个盛放当前商品信息的对象
        var carlist = [];//创建一个盛放所有cookie商品信息的数组
        var cookies = document.cookie.split('; ');
        if(cookies.length){
            cookies.forEach(function(item){
                var arr = item.split('=');
                if(arr[0]==='carlist'){
                    carlist = JSON.parse(arr[1]);
                }
            });
        }; 

        // 一、实现利用ajax加载指定的商品详细信息
        // 1-2、获取来自商品列表页的商品id数据
        var params = location.search;
        // 去掉?号
        params = params.slice(1);
        var arr = params.split('=');
        var currentid = arr[1];//得到从商品列表页面传过来的currentid
        console.log(currentid);

        // 1-3、以获取到的产品id数据发起ajax请求
        var status = [200,304];
        var xhr_goods = new XMLHttpRequest();
        xhr_goods.onload = function(){
            if(status.includes(xhr_goods.status)){
                // console.log(555);
                // console.log(xhr_goods.responseText);
                var currentgoods = JSON.parse(xhr_goods.responseText);
                console.log(currentgoods);
                // 3、将数据渲染到页面对应的位置，注意这里的res是一个对象
                detailload(currentgoods);
                // 三、购物车功能;
                // 3-2 添加当前商品详情页面的产品到购物车
                addcar.onclick = function(){
                    var id = this.dataset.id;
                    console.log(id);
                    for(var i = 0;i<carlist.length; i++){
                        if(carlist[i].id === id){
                            break;
                        }
                    }
                    if(i === carlist.length){
                        for(var attr in currentgoods){
                            goods[attr] = currentgoods[attr];
                             // 实现将表单输入框里面的数据添加作为该商品在购物车的qty,注意：goods后面的qty是给goods对象新增qty属性，而等号右边的qty是指前面输入的值
                            goods.qty=qty.value*1;
                        }
                        carlist.unshift(goods);
                    }else{
                        // 重复点击添加商品实现将表单输入框里面的数据添加作为该商品在购物车的数量qty
                        // 注意：carlist[i]后面的qty是指该对象qty属性，而等号右边的qty是指前面输入的值
                        carlist[i].qty += qty.value*1;
                    }
                    document.cookie =  'carlist=' + JSON.stringify(carlist);
                };
            }
        }
        xhr_goods.open('post','../api/goods_detail.php',true);
        xhr_goods.setRequestHeader('content-type',"application/x-www-form-urlencoded");
        xhr_goods.send("currentid="+currentid); 
        
        // 1-0、封装一个生成页面结构的函数detailload
        function detailload(targetitem){
            //2/获取页面上的元素        
            imgplacebig.src = '';
            imgplacebig.dataset.big = '';
            imgplacesmall1.src = '';
            imgplacesmall1.dataset.big = '';
            // imgplacesmall2.src = '';
            // imgplacesmall2.dataset.big = '';

            imgplacebig.src = targetitem.imgurl1; 
            imgplacebig.dataset.big = targetitem.imgurl1;
            imgplacesmall1.src = targetitem.imgurl1;
            imgplacesmall1.dataset.big = targetitem.imgurl1;
            // 补充：如果想要达到对应商品能够显示多个不同的小图，请在json数据添加多个imgurl路径即可
            // imgplacesmall2.src = targetitem.imgurl1;      
            // imgplacesmall2.dataset.big = targetitem.imgurl1;

            //3//投影价格、标题、描述等信息
           
            titleplace.innerText = '';
            titleplace.innerText = targetitem.title;
            
            commentplace.innerText = '';
            commentplace.innerText = targetitem.comment;
            
            listplace.innerText = '';
            listplace.innerText = targetitem.listprice;
           
            ourplace.innerText = '';
            ourplace.innerText = targetitem.ourprice;
            
            //5-0给加入购物车按钮添加自定义属性data-id，就是为了下面判断加入购物车的商品计数
            addcar.dataset.id = '';
            addcar.dataset.id = targetitem.id;
        };

        //第二个功能：放大镜插件
        $('#detail .biglist ').lzfzoom({
            position:'right'
        });
        $('#detail .smallList img').on('mouseenter',function(){
            $('#detail .biglist img').attr({
                'src':this.src,
                'data-big':$(this).attr('data-big') || this.src,
            });
        }); 


        
        // 三。购物车
        // 3-4、点击添加到购物车飞入动画效果---利用jQuery
        //获取需要复制的图片元素
        var $targetimg = $('#detail .good1 img');
        console.log($targetimg);
        // 给添加到购物车添加点击事件，由于之前已经定义DOM节点addcar
        // 所以转化成jQuery对象
        $(addcar).on('click',function(){
            // 复制目标图片
            var $copyimg = $targetimg.clone();
            console.log($copyimg);
            // 给复制的图片添加样式
            $copyimg.css({
                position:'absolute',
                // 目的是定位到购物车的位置
                left:$(addcar).offset().left+75,
                top:$(addcar).offset().top-50,
                width:66,
                zIndex:2
            });
            // 插入body
            $('body').append($copyimg);
            // 动画效果
            $copyimg.animate({
                left:$('#asider .shiftbtn').offset().left,
                top: $('#asider .shiftbtn').offset().top,
                width:99,
                zIndex:200
            },function(){
                // 动画结束后去除复制的图片
                $copyimg.remove();
            });
        }); 
        // 3-4 飞入效果代码结束  
        
        //四、显示小购物车列表
        var smallcart = document.querySelector('.contentlist .smallcart');
        var cartQty = document.querySelector('.contentlist .cartQty');
        var cartTotalCost =document.querySelector('.contentlist .cartTotalCost');
        var goodsQty = document.querySelector('#asider .goodsqty');console.log(goodsQty);
        var goodsnumber = document.querySelector('#goodsnumber');
        var cartqty = 0;
        var carttotalcost = 0;
        var smallul = document.createElement('ul');

        smallul.innerHTML = carlist.map(function(item){
            cartqty += item.qty;
            carttotalcost += item.ourprice*item.qty;
            return`
                <li data-guid="${item.id}">
                    <a href="productdetail.html?id=${item.id}">
                        <img src="${item.imgurl1}" alt="" />
                    </a>
                    <p class="title">${item.title}</p>
                    <p class="shopprice">￥
                        <span class="oprice">${item.ourprice}</span>
                          X
                        <span class="itemqty">${item.qty}</span>
                    </p>
                </li>
            `
        }).join('');
        smallcart.appendChild(smallul);
        cartQty.innerText = cartqty;
        goodsQty.innerText = cartqty;
        goodsnumber.innerText = cartqty;
        cartTotalCost.innerText = carttotalcost.toFixed(2);

        //五、点击切换显示小购物车列表
        $('#asider .shiftbtn').on('click',function(){
            $('#asider .shopcart').toggleClass('onclick');
            $('#asider .contentlist').fadeToggle();
        });
        //六、首页吸顶，附带延时效果
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

        // 六、左右切换小图功能
        var container = document.querySelector('#detail .container');
        console.log(container);
        var prev1 = document.querySelector('#detail .prev1');
        console.log(prev1);
        var next1 = document.querySelector('#detail .next1');
        console.log(next1);
       
        var focus = document.querySelector('#detail .focus');
        console.log(focus);
        var ullist = document.querySelector('#detail .smallList');
        console.log(ullist);
        var length = ullist.children.length;
        console.log(length);//6
        var index = 0;
        var showWidth = focus.offsetWidth;
        console.log(showWidth);
        function display(){
            if(index > Math.ceil(length/4)-1){
                index = Math.ceil(length/4)-1;
            }else if(index < 0){
                index = 0;
            }
            let target = -index*showWidth;
            animate(ullist,{left:target});
        }
        //事件委托,点击左右方向标切换产品列表
        container.onclick = function(e){
            e = e || window.event;
            var target = e.target || e.srcElement;
            if(target.className.toLowerCase()==="prev1"){
                // console.log(666);
                 index--;
                 display();
            }else if(target.className.toLowerCase()==="next1"){
                  // console.log(666);
                 index++;
                 display();
            }
        }
        // 补充功能：实现鼠标上移小图片添加高亮样式
        // 2-2-1:默认第一张高亮
        $('#detail .smallList').find('li.targetli').addClass('border');
        // 2-2-2:鼠标上移才会高亮
        $('#detail .smallList').on('mouseenter','li',function(){
                console.log(this);
                console.log($(this));
                $(this).addClass('border').siblings().removeClass('border');
        });
    });
});




// document.addEventListener('DOMContentLoaded',function(){
//     ;jQuery(function($){
//         // 1-1、获取HTML页面上的对应的元素
//         var imgplacebig    = document.querySelector("#detail .biglist .targetpic");
//         var imgplacesmall1 = document.querySelector("#detail .smallList .targetpic");
//         // var imgplacesmall2 = document.querySelector("#detail .smallList .other1");
//         var titleplace     = document.querySelector('#detail .textbox .title');
//         var commentplace   = document.querySelector('#detail .textbox .comment');
//         var listplace      = document.querySelector('#detail .textbox .listprice');
//         var ourplace       = document.querySelector('#detail .textbox .ourprice');

//         // 获取数量input表单元素，实现用户自定义购买数量
//         var qty = document.querySelector('#detail .amount #qty');
//         // 获取购物车点击的按钮元素，注意要给该元素添加自定义id属性，详见封装函数detailload
//         var addcar = document.querySelector('#detail .addtocar');

//         // 三、实现购物车添加功能cookie，和购物车飞入动画效果
//         // 购物车3-1：新建一个空的数组，用于保存购物车中的商品信息
//         // 注意一定要将carlist定义成一个全局变量
//         var goods = {};//创建一个盛放当前商品信息的对象
//         var carlist = [];//创建一个盛放所有cookie商品信息的数组
//         var cookies = document.cookie.split('; ');
//         if(cookies.length){
//             cookies.forEach(function(item){
//                 var arr = item.split('=');
//                 if(arr[0]==='carlist'){
//                     carlist = JSON.parse(arr[1]);
//                 }
//             });
//         }; 

//         // 一、实现利用ajax加载指定的商品详细信息
//         // 1-2、获取来自商品列表页的商品id数据
//         var params = location.search;
//         // 去掉?号
//         params = params.slice(1);
//         var arr = params.split('=');
//         var currentid = arr[1];//得到从商品列表页面传过来的currentid
//         console.log(currentid);

//         // 1-3、以获取到的产品id数据发起ajax请求
//         var status = [200,304];
//         var xhr_goods = new XMLHttpRequest();
//         xhr_goods.onload = function(){
//             if(status.includes(xhr_goods.status)){
//                 // console.log(555);
//                 // console.log(xhr_goods.responseText);
//                 var currentgoods = JSON.parse(xhr_goods.responseText);
//                 console.log(currentgoods);
//                 // 3、将数据渲染到页面对应的位置，注意这里的res是一个对象
//                 detailload(currentgoods);
//                 // 三、购物车功能;
//                 // 3-2 添加当前商品详情页面的产品到购物车
//                 addcar.onclick = function(){
//                     var id = this.dataset.id;
//                     console.log(id);
//                     for(var i = 0;i<carlist.length; i++){
//                         if(carlist[i].id === id){
//                             break;
//                         }
//                     }
//                     if(i === carlist.length){
//                         for(var attr in currentgoods){
//                             goods[attr] = currentgoods[attr];
//                              // 实现将表单输入框里面的数据添加作为该商品在购物车的qty,注意：goods后面的qty是给goods对象新增qty属性，而等号右边的qty是指前面输入的值
//                             goods.qty=qty.value*1;
//                         }
//                         carlist.unshift(goods);
//                     }else{
//                         // 重复点击添加商品实现将表单输入框里面的数据添加作为该商品在购物车的数量qty
//                         // 注意：carlist[i]后面的qty是指该对象qty属性，而等号右边的qty是指前面输入的值
//                         carlist[i].qty += qty.value*1;
//                     }
//                     document.cookie =  'carlist=' + JSON.stringify(carlist);
//                 };
//             }
//         }
//         xhr_goods.open('post','../api/goods_detail.php',true);
//         xhr_goods.setRequestHeader('content-type',"application/x-www-form-urlencoded");
//         xhr_goods.send("currentid="+currentid); 
        
//         // 1-0、封装一个生成页面结构的函数detailload
//         function detailload(targetitem){
//             //2/获取页面上的元素        
//             imgplacebig.src = '';
//             imgplacebig.dataset.big = '';
//             imgplacesmall1.src = '';
//             imgplacesmall1.dataset.big = '';
//             // imgplacesmall2.src = '';
//             // imgplacesmall2.dataset.big = '';

//             imgplacebig.src = targetitem.imgurl1; 
//             imgplacebig.dataset.big = targetitem.imgurl1;
//             imgplacesmall1.src = targetitem.imgurl1;
//             imgplacesmall1.dataset.big = targetitem.imgurl1;
//             // 补充：如果想要达到对应商品能够显示多个不同的小图，请在json数据添加多个imgurl路径即可
//             // imgplacesmall2.src = targetitem.imgurl1;      
//             // imgplacesmall2.dataset.big = targetitem.imgurl1;

//             //3//投影价格、标题、描述等信息
           
//             titleplace.innerText = '';
//             titleplace.innerText = targetitem.title;
            
//             commentplace.innerText = '';
//             commentplace.innerText = targetitem.comment;
            
//             listplace.innerText = '';
//             listplace.innerText = targetitem.listprice;
           
//             ourplace.innerText = '';
//             ourplace.innerText = targetitem.ourprice;
            
//             //5-0给加入购物车按钮添加自定义属性data-id，就是为了下面判断加入购物车的商品计数
//             addcar.dataset.id = '';
//             addcar.dataset.id = targetitem.id;
//         };

//         //第二个功能：放大镜插件
//         $('#detail .biglist ').lzfzoom({
//             position:'right'
//         });
//         $('#detail .smallList img').on('mouseenter',function(){
//             $('#detail .biglist img').attr({
//                 'src':this.src,
//                 'data-big':$(this).attr('data-big') || this.src,
//             });
//         }); 


        
//         // 三。购物车
//         // 3-4、点击添加到购物车飞入动画效果---利用jQuery
//         //获取需要复制的图片元素
//         var $targetimg = $('#detail .good1 img');
//         console.log($targetimg);
//         // 给添加到购物车添加点击事件，由于之前已经定义DOM节点addcar
//         // 所以转化成jQuery对象
//         $(addcar).on('click',function(){
//             // 复制目标图片
//             var $copyimg = $targetimg.clone();
//             console.log($copyimg);
//             // 给复制的图片添加样式
//             $copyimg.css({
//                 position:'absolute',
//                 // 目的是定位到购物车的位置
//                 left:$(addcar).offset().left+75,
//                 top:$(addcar).offset().top-50,
//                 width:66,
//                 zIndex:2
//             });
//             // 插入body
//             $('body').append($copyimg);
//             // 动画效果
//             $copyimg.animate({
//                 left:$('#asider .shiftbtn').offset().left,
//                 top: $('#asider .shiftbtn').offset().top,
//                 width:99,
//                 zIndex:200
//             },function(){
//                 // 动画结束后去除复制的图片
//                 $copyimg.remove();
//             });
//         }); 
//         // 3-4 飞入效果代码结束  
        
//         //四、显示小购物车列表
//         var smallcart = document.querySelector('.contentlist .smallcart');
//         var cartQty = document.querySelector('.contentlist .cartQty');
//         var cartTotalCost =document.querySelector('.contentlist .cartTotalCost');
//         var goodsQty = document.querySelector('#asider .goodsqty');console.log(goodsQty);
//         var goodsnumber = document.querySelector('#goodsnumber');
//         var cartqty = 0;
//         var carttotalcost = 0;
//         var smallul = document.createElement('ul');

//         smallul.innerHTML = carlist.map(function(item){
//             cartqty += item.qty;
//             carttotalcost += item.ourprice*item.qty;
//             return`
//                 <li data-guid="${item.id}">
//                     <a href="productdetail.html?id=${item.id}">
//                         <img src="${item.imgurl1}" alt="" />
//                     </a>
//                     <p class="title">${item.title}</p>
//                     <p class="shopprice">￥
//                         <span class="oprice">${item.ourprice}</span>
//                           X
//                         <span class="itemqty">${item.qty}</span>
//                     </p>
//                 </li>
//             `
//         }).join('');
//         smallcart.appendChild(smallul);
//         cartQty.innerText = cartqty;
//         goodsQty.innerText = cartqty;
//         goodsnumber.innerText = cartqty;
//         cartTotalCost.innerText = carttotalcost.toFixed(2);

//         //五、点击切换显示小购物车列表
//         $('#asider .shiftbtn').on('click',function(){
//             $('#asider .shopcart').toggleClass('onclick');
//             $('#asider .contentlist').fadeToggle();
//         });
//         //六、首页吸顶，附带延时效果
//         var toptimer;//定义全局变量
//         $(window).scroll( function() {
//             clearTimeout(toptimer);//必须要有这句
//             if( $(document).scrollTop() > 120 ){
//                 toptimer = setTimeout(function(){
//                     $("#nav").addClass("nav_top");
//                     // console.log($(document).scrollTop());
//                 },16);
//             }else{
//                 toptimer = setTimeout(function(){
//                     $("#nav").removeClass("nav_top");
//                 },16);
//             }
//         });

//         // 六、左右切换小图功能
//         var container = document.querySelector('#detail .container');
//         console.log(container);
//         var prev1 = document.querySelector('#detail .prev1');
//         console.log(prev1);
//         var next1 = document.querySelector('#detail .next1');
//         console.log(next1);
       
//         var focus = document.querySelector('#detail .focus');
//         console.log(focus);
//         var ullist = document.querySelector('#detail .smallList');
//         console.log(ullist);
//         var length = ullist.children.length;
//         console.log(length);//6
//         var index = 0;
//         var showWidth = focus.offsetWidth;
//         console.log(showWidth);
//         function display(){
//             if(index > Math.ceil(length/4)-1){
//                 index = Math.ceil(length/4)-1;
//             }else if(index < 0){
//                 index = 0;
//             }
//             let target = -index*showWidth;
//             animate(ullist,{left:target});
//         }
//         //事件委托,点击左右方向标切换产品列表
//         container.onclick = function(e){
//             e = e || window.event;
//             var target = e.target || e.srcElement;
//             if(target.className.toLowerCase()==="prev1"){
//                 // console.log(666);
//                  index--;
//                  display();
//             }else if(target.className.toLowerCase()==="next1"){
//                   // console.log(666);
//                  index++;
//                  display();
//             }
//         }
//         // 补充功能：实现鼠标上移小图片添加高亮样式
//         // 2-2-1:默认第一张高亮
//         $('#detail .smallList').find('li.targetli').addClass('border');
//         // 2-2-2:鼠标上移才会高亮
//         $('#detail .smallList').on('mouseenter','li',function(){
//                 console.log(this);
//                 console.log($(this));
//                 $(this).addClass('border').siblings().removeClass('border');
//         });
//     });   
// })