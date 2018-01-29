//安全使用jquery
;(function($){
	jQuery.prototype.lzfbanner = function(options){
		//2、设置默认值
		var defaults = {
			//轮播图的容器的宽高，注意：图片的宽高请到css文件里面修改，两者需要一致
			width:1240,
			height:480,
			index:0,//索引值
			page:true,//页码
			buttons:false,
			//轮播图类型：
			type:'vertical',//水平，无缝，淡入淡出
			duration:2500
		}
	
		this.each(function(idx,ele){
			//5-1保持this一致性，指的是实例lzf
			var $self = $(ele);
			//3、扩张$.extend([d],target,obj1,obj2,…,[objN]) 
			//扩展对象或jQuery对象本身。用来扩展jQuery全局函数
			var opt = $.extend({},defaults,options);
			console.log(options);
			//0、添加特定类名
			$self.addClass('lx-carousel');
			//6/设置基础样式,调用默认值default里面的数据
			$self.css({
				width:opt.width,
				height:opt.height
			})

			//1/创建对象并初始化
			var lzf = {
				init:function(){
					//生成结构，绑定节点
					var $ul = $('<ul/>');

					//4/数组生成li结构：map()方法
					$ul.html(opt.imgs.map(function(url){
						return '<li><img src="' + url + '"></li>'
					}).join(''));
					//5-0/把ul写入box
					$self.append($ul);
					opt.len = opt.imgs.length;//图片数组的长度

					if(opt.buttons){
						$('<span/>').addClass('btn-prev').html('&lt').appendTo($self);
						$('<span/>').addClass('btn-next').html('&gt').appendTo($self);
					}
					// if(opt.page){
					// 	$('<div/>').addClass('page').appendTo($self);
					// }
					//移入移出
					// $self.hover(function(){
					// 	clearInterval($self.timer);
					// },function(){
					// 	lzf.move();
					// }).on('click','.btn-prev',function(){
					// 	opt.index--;
					// 	lzf.show();
					// }).on('click','.btn-next',function(){
					// 	opt.index++;
					// 	lzf.show();
					// })
					//上面的hover()方法存在bug无法实现移入移出效果
					//
					$self.on('mouseenter',function(){
						clearInterval($self.timer);
					}).on('mouseleave',function(){
						lzf.move();
					}).on('click','.btn-prev',function(){
						opt.index--;
						lzf.show();
					}).on('click','.btn-next',function(){
						opt.index++;
						lzf.show();
					})
					this.show();//显示默认的index操作
					this.move();
					return this;
				},

				//7/创建移动的函数方法move()
				move:function(){
					$self.timer = setInterval(function(){
						opt.index++;
						this.show();//这里用bind（）方法改变成this的指向为lzf
					}.bind(this),opt.duration);
					return this;
				},
				show:function(){
					//处理index
					if(opt.index >= opt.len){
						opt.index = 0;
					}else if(opt.index < 0){
						opt.index = opt.len - 1;
					}
					var $ul = $self.find('ul');
					//设置动画
					$ul.stop(false,true).animate({left:-opt.index*opt.width});//优化：防止动画积累的bug
					return this;
				}
			}
			lzf.init();
			return this;//指的是实例box，方便链式调用
		})		
	}
})(jQuery);
