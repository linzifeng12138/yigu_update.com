// //模块化封装common.js的常用方法，面向对象
// define(['jquery'],function(){
//     //返回一个函数或对象
//     return {
//         /**
//          * [1/得到某个范围内的随机数]
//          * @param  {Number} min [最小值]
//          * @param  {Number} max [最大值]
//          * @return {Number}     [返回值]
//          */
//         randomNumber: function(min,max){
//             return parseInt(Math.random()*(max-min+1)) + min;//0:得到一个最小数min,1:得到一个最大值max
//         },

//         /**
//          * [2/得到一个随机颜色]
//          * @return {String} [返回rgb格式颜色]
//          */
//         randomColor(){
//             var str = '0123456789abcdef';
//             var res = '#';
//             for(var i=0;i<6;i++){
//                 res += str[this.randomNumber(0,str.length-1)]
//             }
//             return res;
//         },
//         /**
//          * [3/生成4位随机数字验证码]
//          * @return {String} [返回随机4位数字的字符串]
//          */
//         vCode(){
//             var res = '';
//             for(var i=0;i<4;i++){
//                 res += parseInt(Math.random()*10);
//             }
//             return res;
//         }
//     }
// });




// 如果封装没有思路，先使用
// randomNumber(10,20);//得到一个随机整数
// randomNumber('abc',20);//得到一个随机整数


// createTable(10,6);//得到一个10行6列的表格

/**
 * [得到一个随机颜色]
 * @return {String} [返回rgb格式颜色]
 */
function randomColor(){
	// 生成rgb颜色
	// var r = parseInt(Math.random()*256);
	var r = randomNumber(0,255);
	var g = randomNumber(0,255);
	var b = randomNumber(0,255);

	return 'rgb('+ r +','+ g +','+ b +')';
}
// randomColor();//得到一个随机颜色'rgb(255,0,0)'

/**
 * [生成4位随机数字验证码]
 * @return {String} [返回随机4位数字的字符串]
 */
function vCode(){
    var res = '';
    for(var i=0;i<4;i++){
        res += parseInt(Math.random()*10);//'' + 8=>'8'+6=>'86'+5=>'865'+0=>'8650'
    }

    return res;
}
/**
 * [数据类型判断]
 * @param  {All} data [数据类型]
 * @return {String}      [返回数据类型字符串]
 */
function type(data){
    return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
}


/**
 * [动画效果，多属性改变，支持回调函数]
 * @param  {element}  ele      [元素节点，目标元素]
 * @param  {object}   opt      [属性]
 * @param  {Function} callback [回调函数]

 */
function animate(ele,opt,callback){
    var timerQty = 0;
    for (var attr in opt){
        //记录属性个数，动画个数
        timerQty++;
        createTimer(attr);
    }
    //创建一个局部作用域function函数createTimer，使得每次for循环能够作用到下面的函数
    function createTimer(attr){

        //优化1：以属性名创建定时器名字：避免上一个定时器还没执行完毕就被下一个定时器清除，实现多个动画改变同时进行
        var timerName = attr + 'timer';

        //清除之前的变化的定时器,防止多个定时器作用同一个元素，但在这里是改变多个属性的样式
        //
        clearInterval(ele[timerName]);

        var target = opt[attr];//得到变化的目标值
        
        ele[timerName] = setInterval(function(){
            var current = getComputedStyle(ele)[attr];
            //提取单位：
            var unit = current.match(/\d([a-z]*)$/);
            unit = unit ? unit[1]: '';

            //提取数字
            current = parseFloat(current);

            //计算缓冲速度
            var speed = (target - current)/10;

            //判断opacity
            if(attr === 'opacity'){
               speed = speed >0?  0.05 : -0.05;
            }else{
               speed = speed >0? Math.ceil(speed):Math.floor(speed);
            }
            //到达目的，清除定时器
            if (current === target){
                clearInterval(ele[timerName]);
                current = target - speed;
                //
                timerQty--;


                //优化2：排队执行动画：执行回调函数
                //优化3：必须最后动画执行完毕之后才执行回调函数
                if(typeof callback === 'function' &&  timerQty == 0){
                    callback();
                }
            }

            ele.style[attr] = current + speed + unit;

        },30)
    }
}
//支持多个样式改变同时发生：
// animate(box,{width:200,opacity:0.2,top:200,left:200,height:200});
// 
//链式调用（动画排队效果）使用回调函数
// animate(box,{width:400,height:400,opacity:0.2},function(){
//     animate(box,{top:200});
// });