;(function($){
	$.fn.lzfzoom = function(options){
		//1-设置默认值
		var defaults = {
			//大图的宽和高，注意这里的宽高若设置大小与样式中的.gds-zoom-big的宽高越相近越好
			width:500,
			height:500,
			//大图显示位置位置：
			position:'left',
			//小图与大图的间距
			gap : 28
		}
		//这里的this指向实例
		return this.each(function(idx,ele){
			//下面的this指向dom节点ele
			var opt = $.extend({},defaults,options);

			var $small = $(this).addClass('gds-zoom');
			console.log($small);

			var $smallImg = $small.find('img');
			console.log($smallImg);

			//生成大图容器--并且定位
			var $big = $('<div/>').addClass('gds-zoom-big');
			var left,top;
			if(opt.position === 'right'){
				top = $small.offset().top;
				left = $small.offset().left + $smallImg.outerWidth() + opt.gap;
			}else if(opt.position === 'left'){
				top = $small.offset().top;
				left = $small.offset().left - opt.width - opt.gap
			}else if(opt.position === 'top'){
				top = $small.offset().top - opt.height - opt.gap;
				left = $small.offset().left
			}else if(opt.position === 'bottom'){
				top = $small.offset().top + $small.outerWidth() + opt.gap;
				left = $small.offset().left
			}
			$big.css({
				left:left,
				top:top
			})


			//生成大图篇--可动，不在页面上就没有宽高，
			//涉及到图片宽高用原生js获取才行
			var $bigImg = $('<img/>');

			// 把大图显示到容器
			$bigImg.appendTo($big);

			//把大图容器写入页面
			$big.appendTo('body');

			//创建图片，为了加载
			var img = new Image();
			
			img.onload = function(){
				//图篇加载完才执行以下代码
				// 图片只有显示到页面才能得到宽高
				// console.log(img.offsetWidth);
				$bigImg.attr('src',img.src);

				// console.log($bigImg.width());
			}

			//生成放大镜
			var $zoom = $('<span/>').addClass('minzoom');
			$zoom.appendTo($small);

			// 只有移入才会显示大图--绑定事件
			//建立大图与小图的比例
			var ratio;
			$small.on('mouseenter',function(){

				img.src = $smallImg.attr('data-big');//得到data-big的属性值
				
				$big.show();

				$zoom.show();

				ratio = $bigImg.outerWidth()/$smallImg.outerWidth();
				console.log(ratio);
				
				//设置比例，跟放大区域成比例
				$zoom.css({
					width:opt.width/ratio,
					height : opt.height/ratio
				});


			}).on('mouseleave',function(){
				$big.fadeOut();

				$zoom.fadeOut();
			}).on('mousemove',function(e){
				//放大镜移动的距离
				var left = e.pageX - $zoom.outerWidth()/2 - $small.offset().left;
				var top  = e.pageY - $zoom.outerHeight()/2 - $small.offset().top;
				//边缘判断
				if(left<0){
					left = 0;
				}else if(left > $small.outerWidth()-$zoom.outerWidth()){
					left = $small.outerWidth() - $zoom.outerWidth();
				}

				if(top<0){
					top = 0;
				}else if(top > $small.outerHeight()-$zoom.outerHeight()){
					top = $small.outerHeight() - $zoom.outerHeight();
				}

				$zoom.css({
					left: left,
					top: top
				});

				$bigImg.css({
					left: - left*ratio,
					top: - top*ratio
				})
			});
		});
	}
}) (jQuery);