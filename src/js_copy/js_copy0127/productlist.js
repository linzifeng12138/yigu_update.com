;document.addEventListener('DOMContentLoaded',function(){
    ;jQuery(function($){
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
    
        var tablis = document.querySelectorAll('#showlist .tabmain li');
        console.log(tablis);
        var status = [200,304];
        var datalist = document.getElementById('datalist');
        var page = document.querySelector('#mainlist #page .pagenum');
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
       

        //三、在本界面实现点击顶部标签栏加载指定类别的所有的产品信息，
        //且点击对应商品显示到商品详情
        for(var i=0;i<tablis.length;i++){
            (function(i){
                tablis[i].onclick=function(){
                    var category = tablis[i].dataset.category;
                    //获得类名后以类名作为请求标准发起ajax请求
                    console.log(category);//字符串
                    
                    
                    var pageNo = 1; //页数
                    var qty = 16;//每页显示评论的数量
                   

                    var xhr_cate = new XMLHttpRequest();
                    xhr_cate.onload=function(){
                        if(status.includes(xhr_cate.status)){
                            var res_cate = JSON.parse(xhr_cate.responseText);
                            console.log(res_cate);
                            //1、开始处理数据
                            var ul = document.createElement('ul');
                            ul.classList.add('clearfix');
                            
                            ul.innerHTML =  res_cate.data.map(function(item){
                                return`
                                        <li data-guid="${item.id}">
                                            <a href="productdetail.html">
                                                <img src="${item.imgurl1}" alt="" />
                                            </a>
                                            <p class="title">${item.title}</p>
                                            <h3>￥<span class="ourprice">${item.ourprice}</span></h3>
                                            <h4>￥<span class="listprice">${item.listprice}</span></h4>
                                            <button>加入购物车</button>
                                        </li>
                                    `
                            }).join('');
                            datalist.innerText = '';
                            datalist.appendChild(ul);
   
                            ul.addEventListener('click',function(e){
                                e = e || window.event;
                                var target = e.target || e.srcElement;
                                //判断
                                if(target.tagName.toLowerCase() === 'img'){
                                    //获取当前的商品id
                                    var currentguid = target.parentNode.parentNode.getAttribute('data-guid');
                                    console.log(currentguid);
                                    //再根据当前的id获得当前产品所有信息
                                    var currentgoods = res_cate.data.filter(function(item){
                                        return item.id === currentguid;
                                        //注意这里item.id的'id'必须与数据库数据命名一致才行
                                    })[0];
                                    console.log(currentgoods);
                                    //将产品信息写入cookie传递到详情页面
                                    var now = new Date();
                                    now.setHours(now.getHours()+1);
                                    document.cookie = 'currentgoods=' + JSON.stringify(currentgoods) + ';expires=' + now;
                                };
                                if(target.tagName.toLowerCase()==='button'){
                                    // 五、购物车功能，2、保存购物车中的商品信息
                                    var id = target.parentNode.getAttribute('data-guid');
                                    //购物车功能，3、判断carlist中是否存在相同的商品信息
                                    //判断循环是否跑完
                                    for(var i = 0; i<carlist.length; i++){
                                        if(carlist[i].id === id){
                                            break;
                                        }
                                    }
                                    // 购物车功能，3
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
                                    //五、购物车最后将在aplication标签页面会显示所有cookie
                                    document.cookie =  'carlist=' + JSON.stringify(carlist);

                                    // 5-2点击飞入购物车动画效果代码开始
                                    var currentLi = target.parentNode;
                                    console.log(currentLi);
                                    var cloneimg = currentLi.children[0].children[0].cloneNode();
                                    console.log(cloneimg);
                                    cloneimg.classList.add('clone-img');
                                    // 1、把复制的图片定位到与当前商品的图片一致
                                    
                                    var myleft = cloneimg.style.left = (currentLi.offsetLeft)+'px';
                                    var mytop = cloneimg.style.top = (currentLi.offsetTop)+'px';
                                    console.log(myleft);
                                    console.log(mytop);
                                    //注意：css样式里面li如果有padding会对图片的位置生成有影响，应去除
                                
                                    //3 把复制的图片写入页面
                                    currentLi.appendChild(cloneimg); 
                                    console.log(cloneimg);
                                    animate(cloneimg,{left:1210,top:760,width:20,height:20},function(){
                                        console.log(555);
                                        // 4、利用回调函数将复制的图片去除
                                        currentLi.removeChild(cloneimg); 
                                    });
                                }
                            });
                            //2、生成分页
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
                        }
                    }
                    xhr_cate.open('post','../api/productlist.php',true);
                    xhr_cate.setRequestHeader('content-type',"application/x-www-form-urlencoded");
                    xhr_cate.send('category='+category+'&pageNo='+pageNo+'&qty='+qty); 
                    //3、实现点击切换内容的功能
                    //每次点击页码就发起对应的新的ajax请求，加载指定页数的内容
                    //注意：必须放在for循环里面才能获取对应的category的值
                    page.onclick = function(e){
                        if(e.target.tagName.toLowerCase()==='span'){
                            pageNo = e.target.innerText*1;

                            xhr_cate.open('post','../api/productlist.php',true);
                            xhr_cate.setRequestHeader('content-type',"application/x-www-form-urlencoded");   
                            xhr_cate.send('category='+category+'&pageNo='+pageNo+'&qty='+qty);
                        }
                    }            
                }
            }) (i);
        } 

        // 四、接收来自首页的category信息，生成对应类别的商品列表，
        // 且点击对应的图片查看商品信息和加入购物车功能
        var params = location.search;
        // 去掉?号
        params = params.slice(1);
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
                                <a href="productdetail.html"><img src="${item.imgurl1}" alt="" /></a>
                                <p class="title">${item.title}</p>
                                <h3>￥<span class="ourprice">${item.ourprice}</span></h3>
                                <h4>￥<span class="listprice">${item.listprice}</span></h4>
                                <button>加入购物车</button>
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
                    //实现点击商品列表的某个商品图片跳转到对应的商品详情界面开始：
                    if(target.tagName.toLowerCase() === 'img'){
                        //获取当前的商品id
                        var currentguid = target.parentNode.parentNode.getAttribute('data-guid');
                        console.log(currentguid);
                        //再根据当前的id获得当前产品所有信息
                        var currentgoods = res_cate.data.filter(function(item){
                            return item.id === currentguid;
                            //注意这里item.id的'id'必须与数据库数据命名一致才行
                        })[0];
                        console.log(currentgoods);
                        //将产品信息写入cookie传递到详情页面
                        var now = new Date();
                        now.setHours(now.getHours()+1);
                        document.cookie = 'currentgoods='+JSON.stringify(currentgoods)+';expires='+now;
                    };

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
                        // 5-2点击飞入购物车动画效果代码开始
                        var currentLi = target.parentNode;
                        console.log(currentLi);
                        var cloneimg = currentLi.children[0].children[0].cloneNode();
                        console.log(cloneimg);
                        cloneimg.classList.add('clone-img');
                        // 3、把复制的图片定位到与当前商品的图片一致
                        
                        var myleft = cloneimg.style.left = (currentLi.offsetLeft)+'px';
                        var mytop = cloneimg.style.top = (currentLi.offsetTop)+'px';
                        console.log(myleft);
                        console.log(mytop);
                        //注意：css样式里面li如果有padding会对图片的位置生成有影响，应去除
                    
                        //3 把复制的图片写入页面
                        currentLi.appendChild(cloneimg); 
                        console.log(cloneimg);
                        animate(cloneimg,{left:1210,top:800,width:20,height:20},function(){
                            console.log(555);
                            // 4、利用回调函数将复制的图片去除
                            currentLi.removeChild(cloneimg); 
                        });
                    }
                });
            }
        })

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
                                        <a href="productdetail.html"><img src="${item.imgurl1}" alt="" /></a>
                                        <p class="title">${item.title}</p>
                                        <h3>￥<span class="ourprice">${item.ourprice}</span></h3>
                                        <h4>￥<span class="listprice">${item.listprice}</span></h4>
                                        <button>加入购物车</button>
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
                            //判断
                            if(target.tagName.toLowerCase() === 'img'){
                                //获取当前的商品id
                                var currentguid = target.parentNode.parentNode.getAttribute('data-guid');
                                console.log(currentguid);
                                //再根据当前的id获得当前产品所有信息
                                var currentgoods = res_cate.data.filter(function(item){
                                    return item.id === currentguid;
                                    //注意这里item.id的'id'必须与数据库数据命名一致才行
                                })[0];
                                console.log(currentgoods);
                                //将产品信息写入cookie传递到详情页面
                                var now = new Date();
                                now.setHours(now.getHours()+1);
                                document.cookie = 'currentgoods=' + JSON.stringify(currentgoods) + ';expires=' + now;
                            };

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
                                //五、购物车最后将在aplication标签页面会显示所有的产品信息
                                //不管是首页传递参数生成的列表页还是本页生成的产品列表，
                                //共用一个carlist的cookie
                                // 5-2点击飞入购物车动画效果代码开始
                                var currentLi = target.parentNode.parentNode;
                                var cloneimg = currentLi.children[0].children[0].cloneNode();
                                cloneimg.classList.add('clone-img');
                                // 3、把复制的图片定位到与当前商品的图片一致
                                
                                var myleft = cloneimg.style.left = (currentLi.offsetLeft)+'px';
                                var mytop = cloneimg.style.top = (currentLi.offsetTop)+'px';
                                console.log(myleft);
                                console.log(mytop);
                            
                                //3 把复制的图片写入页面
                                currentLi.appendChild(cloneimg); 
                                // console.log(cloneimg);
                                animate(cloneimg,{left:1210,top:800,width:20,height:20},function(){
                                    // 4、利用回调函数将复制的图片去除
                                    currentLi.removeChild(cloneimg); 
                                });
                            }
                        });
                    }
                })
            }
        }     
    });
});