require.config({
    // 默认为data-main文件所在的目录
    // path的路径是以各个页面设置的data-main 为标准
    paths:{
        'jquery'    : '../lib/jquery-3.2.1',
        'lzfbanner' : '../lib/jquery-lzfbanner/jquery.lzfbanner',
        'lzfzoom'   : '../lib/jquery-lzfzoom/jquery-lzfzoom',
        'common'    : 'common'
    },
    shim:{
        // 设置依赖
        lzfbanner:['jquery'],
        lzfzoom:['jquery']
    }
})