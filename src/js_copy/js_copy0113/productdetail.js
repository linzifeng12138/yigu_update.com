document.addEventListener('DOMContentLoaded',function(){

    ;jQuery(function($){
        //第一种思路写法利用bom的location获取商品信息：
        //仅仅是学习使用，并不是那么常见：
        //第一个功能：显示详情信息
        var params = location.search;
        //1、string:"?id=G003&title=新疆红旗坡超级糖心毒苹果&comment=果色艳丽，丰满多汁，清甜可口！%20富含维生素，水果大哥大，快点买啊！&category=fruit&imgurl=img/apple.jpg&imgurl1=../img/apple.jpg&url=#&ourprice=49&listprice=58&off=0.2&star=4&commentCount=10002"
        params = params.slice(1);
        //2、string:"id=G003&title=新疆红旗坡超级糖心毒苹果&comment=果色艳丽，丰满多汁，清甜可口！%20富含维生素，水果大哥大，快点买啊！&category=fruit&imgurl=img/apple.jpg&imgurl1=../img/apple.jpg&url=#&ourprice=49&listprice=58&off=0.2&star=4&commentCount=10002"
        params = params.split('&');
        //3、["id=G003","title=新疆红旗坡超级糖心毒苹果","comment=果色艳丽，丰满多汁，清甜可口！%20富含维生素，水果大哥大，快点买啊！","category=fruit","imgurl=img/apple.jpg","imgurl1=../img/apple.jpg","url=#","ourprice=49","listprice=58","off=0.2","star=4","commentCount=10002"]
        // 创建一个空对象，用于保存参数里面的信息
        var data = {};
        params.forEach(function(item){
            var arr = item.split('=');
            data[arr[0]] = decodeURI(arr[1]);
        });
        console.log(data);
        //4、转码完成：{id:"G003",title:"新疆红旗坡超级糖心毒苹果",comment:"果色艳丽，丰满多汁，清甜可口！%20富含维生素，水果大哥大，快点买啊！",category:"fruit",imgurl:"img/apple.jpg",imgurl1:"../img/apple.jpg",url:"#",ourprice:"49",listprice:"58",off:"0.2",star:"4",commentCount:"10002"}
        //
        //第二种：思路写法接收cookie----重点掌握哦
        var currentgoods;
        //每次加载就需要读取页面存放的cookie
        var cookies = document.cookie.split('; ');
        
        




        //6、投影图片
        var pic = data.imgurl1;         console.log(pic);

        var imgplacebig = document.querySelector("#detail .biglist .targetpic");
        console.log(imgplacebig);
        imgplacebig.src = pic;
        imgplacebig.dataset.big = pic;
        console.log(imgplacebig.dataset.big);
        //将图片地址复制一份给自定义属性data-big
        //<img src="" data-big="" class="targetpic">

        var imgplacesmall1 = document.querySelector("#detail .smallList .targetpic");
        imgplacesmall1.src = pic;
        imgplacesmall1.dataset.big = pic;
        //将图片地址复制一份给自定义属性data-big
        //<img src="" data-big="" class="targetpic">
        
        //补充：如果想要达到对应商品能够显示多个不同的小图，请在json数据添加多个imgurl路径即可
        var pic1 = data.imgurl2;   console.log(pic1);
        var imgplacesmall2 = document.querySelector("#detail .smallList .other1");
        console.log(imgplacesmall2);
        imgplacesmall2.src = pic1;
        imgplacesmall2.dataset.big = pic1;
        

        //7、投影价格、标题、描述等信息
        var listprice = data.listprice; console.log(listprice);
        var ourprice = data.ourprice;   console.log(ourprice);
        var title = data.title;         console.log(title);
        var comment = data.comment;     console.log(comment);

        var titleplace = document.querySelector('#detail .textbox .title');
        titleplace.innerText = title;
        var commentplace = document.querySelector('#detail .textbox .comment');
        commentplace.innerText = comment;
        var listplace = document.querySelector('#detail .textbox .listprice');
        listplace.innerText = listprice;
        var ourplace = document.querySelector('#detail .textbox .ourprice');
        ourplace.innerText = ourprice;

        //第二个功能：放大镜插件
        $('#detail .biglist ').lzfzoom({
            position:'right'
        });
        $('#detail .smallList img').on('mouseenter',function(){
            $('#detail .biglist img').attr({
                'src':this.src,
                'data-big':$(this).attr('data-big') || this.src
            });
        }); 

        //第二个功能：加入到购物车加飞入购物车动画效果
    });
    
})