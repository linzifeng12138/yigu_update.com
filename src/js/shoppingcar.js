require(['config'],function(){
    require(['jquery','common'],function($,com){
        // 一、导航栏吸顶效果
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
        //二、显示购物车的信息到HTML结构里面
        //先设置一个空的数组，作用是读取cookie
        var carlist =[];
        var cookies = document.cookie.split('; ');
        if(cookies.length){
            cookies.forEach(function(item){
                var arr = item.split('=');
                if(arr[0]==='carlist'){
                    carlist = JSON.parse(arr[1]);
                }
            });
        }
        // console.log(carlist);
        var maincar = document.querySelector('.maincar');console.log(maincar);
        var cost = 0;//单项产品总花费
        var totalcost = 0;//所有产品总花费金额
        var totalqty = 0;//用户购买产品总数量
        var totalsave = 0;//原价减去市价乘以总数量
        var ul = document.createElement('ul');
        ul.innerHTML = carlist.map(function(item){
            cost = (item.ourprice*item.qty).toFixed(2);
            totalcost += item.ourprice*item.qty;
            totalqty += item.qty;
            totalsave += (item.listprice-item.ourprice)*item.qty;
        
            return`
                <li class="carlist" data-guid = "${item.id}">
                    <input type="checkbox" class="onecheck"/>
                    <img src="${item.imgurl1}" alt="" />
                    <span class="title">${item.title}</span>

                    <div class="box-right fr">
                        <p class="ourprice">￥<span>${item.ourprice}</span></p>
                        <p class="amount0">
                            <span class="minus">-</span>                 
                            <span class="amount">${item.qty}</span>
                            <span class="plus">+</span>
                        </p>
                        
                        <p class="count">￥<span class="total">${cost}</span></p>
                        <p class="weight"><span>22</span>kg</p>
                        <p class="control">
                             <span>移入收藏</span>
                             <span class="btn-close">完全删除</span>
                        </p>
                    </div>              
                </li>
            `
        }).join('');
        maincar.appendChild(ul);
        // 将计算的结果写入HTML结构
        var totalQty = document.querySelector('#caroutcome .totalqty');
        totalQty.innerText = totalqty;
        var totalCost1 = document.querySelector('#caroutcome .totalcost');
        totalCost1.innerText = totalcost.toFixed(2);
        var totalCost2 = document.querySelector('#payfor .act i');
        totalCost2.innerText = totalcost.toFixed(2);
        var totalSave = document.querySelector('#payfor .save i');
        totalSave.innerText = totalsave.toFixed(2);
        var goodsnumber = document.querySelector('#goodsnumber');
        goodsnumber.innerText = totalqty;


        //三、删除单个商品代码开始--事件委托
        maincar.onclick = function(e){
            e= e || window.event;
            var target = e.target || e.srcElement;
            if(target.className.toLowerCase() === 'btn-close'){
                //先找到当前商品在数组中的位置，根据guid
                //删除：获取索引值，splice(idx,1)
                //重写cookie
                //删除DOM节点
                var currentLi = target.parentNode.parentNode.parentNode;
                var guldId = currentLi.getAttribute('data-guid');
                //删除商品前先让客户确认一下:   window.confirm()
                if(confirm('您真的要删除该商品吗？')){
                    for(var i = 0 , len = carlist.length; i<len; i++){
                        if(carlist[i].id === guldId){
                             carlist.splice(i,1);
                             break;
                        }
                    }
                    document.cookie = 'carlist=' + JSON.stringify(carlist);
                    //删除DOM节点
                    currentLi.parentNode.removeChild(currentLi);
                    location = location;
                }   
            }
        };
        //四、实现全选功能
        $('.allcheck').on('click',function(){
            $('.maincar').find(':checkbox').prop('checked',this.checked);
        });    
    });
});
