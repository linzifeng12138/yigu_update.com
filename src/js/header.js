jQuery(function($){
    //板块功能一：点击菜单导航栏跳转到商品列表页面并加载指定的商品类别的数据
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