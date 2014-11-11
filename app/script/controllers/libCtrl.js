/**
 *
 * @authors feige (feige_hu@foxmail.com)
 * @date    2014-11-10 14:26:54
 * @version $Id$
 */

define(['jquery'], function($) {
    var libs = [
        {
            name:'router',
            icon:'images/icon_router.png',
            title:'路由'
        },{
            name:'computer',
            icon:'images/icon_computer.png',
            title:'主机'
        }
    ]
    var Ctrl = {
        init : function(){
            Ctrl.$el = $('#libbody');
            Ctrl.renderIcons();
            Ctrl.$el.find('img').tooltip();
        },
        renderIcons : function(){
            var html = '';
            $.each(libs, function(i, item) {
                html += "<img class='icon img-rounded' data-toggle='tooltip'  src='" + item.icon +"' data-name= '"+item.name+"' title='"+ item.title+"'/>"
            });
            Ctrl.$el.html(html);
        }
    };

    return Ctrl

});