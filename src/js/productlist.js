require(['config'],function(){
    require(['jquery','lzfbanner','common'],function($,ban,com){
        //轮播图代码部分
        $('#banner').lzfbanner({
            imgs:['../img/ban1.png','../img/ban2.jpg','../img/ban3.jpg','../img/ban4.jpg','../img/ban5.png'],
            buttons:false,
            index:0
        });
        //本周爆品图片切换
        $('.smallList img').on('mouseenter',function(){
            $('.biggood .good1 img').attr({
                'src':this.src
            });
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

        // 获取盛放生成页码的容器元素
        var datalist = document.getElementById('datalist');
        // 获取盛放某个产品类别的容器元素
        var page = document.querySelector('#mainlist #page .pagenum');
        // 获取盛放当前页面所有产品数量元素
        var total = document.querySelector('#mainlist #page .totalnum');

         // 五、购物车功能，1、新建一个空的数组，用于保存购物车中的商品信息
         // 注意一定要将carlist定义成一个全局变量
        var carlist = [];
        var cookies = document.cookie; 
        if(cookies.length){
            cookies = cookies.split('; ');
            cookies.forEach(function(item){
                var arr = item.split('=');
                if(arr[0] === 'carlist'){
                    carlist = JSON.parse(arr[1]);
                }
            })
        }
        //板块功能三：在本页面点击菜单导航栏跳转到商品列表页面并加载指定的商品类别的数据
        var tab = document.querySelector('#showlist .tabmain');

        tab.addEventListener('click',function(e){
            e = e || window.event;
            var target = e.target || e.srcElement;
            // 若点击的事件源对象为a标签，则获取源对象所在的li 的category参数
            if(target.tagName.toLowerCase()==="a"){
                var nowli = target.parentNode;
                var category = nowli.getAttribute("data-category");
                location.href = "productlist.html" + "?" + "category=" + category;
            }
        });     
       

     

        // 四、接收来自首页和本列表页面的category信息，生成对应类别的商品列表，
        // 且点击对应的图片查看商品信息和加入购物车功能
        var params = location.search;
        params = params.slice(1);   // 去掉?号
        var arr = params.split('=');
        var category = arr[1];//从首页传来的category数据
        var pageNo = 1; //页数
        var qty = 16;//每页显示数量  

        $.ajax({
            type:"post",
            url:'../api/productlist.php',
            data:{
                category:category,
                pageNo:pageNo,
                qty:qty
            },
            success:function(res){
                // console.log(res);
                // 注意，jQuery返回的数据还是需要进行json转换才可以使用哦
                var res_cate = JSON.parse(res);
                console.log(res_cate);
                var ul = document.createElement('ul');
                ul.classList.add('clearfix');
                
                ul.innerHTML = res_cate.data.map(function(item){
                    return`
                            <li data-guid="${item.id}">
                                <a href="productdetail.html?id=${item.id}"><img src="${item.imgurl1}" /></a>
                                <p class="title">${item.title}</p>
                                <h3>￥<span class="ourprice">${item.ourprice}</span></h3>
                                <h4>￥<span class="listprice">${item.listprice}</span></h4>
                                <button class="addcar">加入购物车</button>
                            </li>
                        `
                }).join('');
                datalist.innerText = '';
                datalist.appendChild(ul);

                // 2、生成分页
                page.innerText = '';
                //显示当前类别的所有商品总数
                total.innerText = res_cate.total;
                //加载数据前必须清空前面的数据

                var pageQty = Math.ceil(res_cate.total/res_cate.qty);

                for(var i=1;i<=pageQty;i++){
                    var span = document.createElement('span');
                    span.innerHTML = i;

                    if(i === pageNo){
                        span.className = 'active';
                    }
                    page.appendChild(span);
                };       

                ul.addEventListener('click',function(e){
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                 
                    //五购物车功能 1、保存被选中的商品信息到cookie 2、点击飞入购物车动画
                    if(target.tagName.toLowerCase()==='button'){
                        //5-1 购物车最后将在aplication标签页面会显示所有的产品信息
                        //不管是首页传递参数生成的列表页还是本页生成的产品列表，
                        //共用一个叫carlist的cookie
                        var id = target.parentNode.getAttribute('data-guid');
                        //判断carlist中是否存在相同的商品信息
                        //判断循环是否跑完
                        for(var i = 0; i<carlist.length; i++){
                            if(carlist[i].id === id){
                                break;
                            }
                        }
                        //如果点击的产品信息经过上面的循环发现并没有这个产品在购物车的话
                        //就创建一个对象，并且计数为1；
                        if(i === carlist.length){                    
                            var goods = {
                                id:id,
                                imgurl1:target.parentNode.children[0].children[0].src,
                                title:target.parentNode.children[1].innerText,
                                listprice:target.parentNode.children[3].children[0].innerText,
                                ourprice:target.parentNode.children[2].children[0].innerText,
                                qty:1
                            }
                            carlist.unshift(goods);
                        }else{
                            //若已经存在产品信息：数量加1
                            carlist[i].qty++;
                        }
                        document.cookie =  'carlist=' + JSON.stringify(carlist);
                    }
                });
        
                // 飞入购物车动画jQuery代码开始
                $(ul).on('click','.addcar',function(){
                    var $li = $(this).closest('li');
                    var $targetimg = $li.find('img');

                    var $copyimg = $targetimg.clone();

                    $copyimg.css({
                        position:'absolute',
                        left:$targetimg.offset().left,
                        top:$targetimg.offset().top,
                        width:$targetimg.outerWidth()
                    });
                    $('body').append($copyimg);
                    // 动画
                    $copyimg.animate({
                        left:$('#asider .shiftbtn').offset().left,
                        top:$('#asider .shiftbtn').offset().top,
                        width:30,
                        height:30
                    },function(){
                        // 动画完成后

                        // 删除复制的图片
                        $copyimg.remove();
                    })
                });
            }
        });
        //3、实现点击切换内容的功能
        //注意：由于数据生成的页码span标签是异步请求生成的，根据代码执行顺序不能将点击切换事件绑定在span上而是要绑定在在它的父级元素page--page已经写死在HTML结构上面，不受异步请求的影响
        //每次点击页码就发起对应的新的ajax请求，加载指定页数的内容
        page.onclick = function(e){
            if(e.target.tagName.toLowerCase()==='span'){
                pageNo = e.target.innerText*1;
                $.ajax({
                    type:"post",
                    url:'../api/productlist.php',
                    data:{
                        category:category,
                        pageNo:pageNo,
                        qty:qty
                    },
                    success:function(res){
                        // console.log(res);
                        // 注意，jQuery返回的数据还是需要进行json转换才可以使用哦
                        var res_cate = JSON.parse(res);
                        console.log(res_cate);
                        var ul = document.createElement('ul');
                        ul.classList.add('clearfix');
                        
                        ul.innerHTML = res_cate.data.map(function(item){
                            return`
                                    <li data-guid="${item.id}">
                                        <a href="productdetail.html?id=${item.id}"><img src="${item.imgurl1}" /></a>
                                        <p class="title">${item.title}</p>
                                        <h3>￥<span class="ourprice">${item.ourprice}</span></h3>
                                        <h4>￥<span class="listprice">${item.listprice}</span></h4>
                                        <button class="addcar">加入购物车</button>
                                    </li>
                                `
                        }).join('');
                        datalist.innerText = '';
                        datalist.appendChild(ul);

                        // 2、生成分页
                        page.innerText = '';
                        //显示当前类别的所有商品总数
                        total.innerText = res_cate.total;
                        //加载数据前必须清空前面的数据

                        var pageQty = Math.ceil(res_cate.total/res_cate.qty);

                        for(var i=1;i<=pageQty;i++){
                            var span = document.createElement('span');
                            span.innerHTML = i;

                            if(i === pageNo){
                                span.className = 'active';
                            }
                            page.appendChild(span);
                        };       

                        ul.addEventListener('click',function(e){
                            e = e || window.event;
                            var target = e.target || e.srcElement;

                            if(target.tagName.toLowerCase()==='button'){
                                 // 五、购物车功能，2、保存购物车中的商品信息
                                var id = target.parentNode.getAttribute('data-guid');
                                //判断carlist中是否存在相同的商品信息
                                //判断循环是否跑完
                                for(var i = 0; i<carlist.length; i++){
                                    if(carlist[i].id === id){
                                        break;
                                    }
                                }
                                //如果点击的产品信息经过上面的循环发现并没有这个产品在购物车的话
                                //就创建一个对象，并且计数为1；
                                if(i === carlist.length){                    
                                    var goods = {
                                        id:id,
                                        imgurl1:target.parentNode.children[0].children[0].src,
                                        title:target.parentNode.children[1].innerText,
                                        listprice:target.parentNode.children[3].children[0].innerText,
                                        ourprice:target.parentNode.children[2].children[0].innerText,
                                        qty:1
                                    }
                                    carlist.unshift(goods);
                                }else{
                                    //若已经存在产品信息：数量加1
                                    carlist[i].qty++;
                                }
                                document.cookie =  'carlist=' + JSON.stringify(carlist);
                            }
                        });
                        // 飞入购物车动画jQuery代码开始
                        $(ul).on('click','.addcar',function(){
                            //获取事件源对象.addcar按钮DOM节点最近的li父级元素$li
                            var $li = $(this).closest('li');
                            // 获取当前$li下面的子元素img
                            var $targetimg = $li.find('img');

                            var $copyimg = $targetimg.clone();

                            $copyimg.css({
                                position:'absolute',
                                left:$targetimg.offset().left,
                                top:$targetimg.offset().top,
                                width:$targetimg.outerWidth()
                            });
                            $('body').append($copyimg);
                            // 动画
                            $copyimg.animate({
                                left:$('#asider .shiftbtn').offset().left,
                                top:$('#asider .shiftbtn').offset().top,
                                width:30,
                                height:30
                            },function(){
                                // 动画完成后，删除复制的图片
                                $copyimg.remove();
                            });
                        });
                    }
                });
            }
        };

        //五、显示小购物车列表
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

        //六、点击切换显示小购物车列表
        $('#asider .shiftbtn').on('click',function(){
            $('#asider .shopcart').toggleClass('onclick');
            $('#asider .contentlist').fadeToggle();
        });     
    });
});


