/**
 *
 * @authors feige (feige_hu@foxmail.com)
 * @date    2014-11-10 14:26:54
 * @version $Id$
 */

define(['jquery','d3','SM'], function($,d3,SM) {
    var libs = [{
        name: 'router',
        icon: 'images/icon_router.png',
        title: '路由'
    }, {
        name: 'computer',
        icon: 'images/icon_computer.png',
        title: '主机'
    }, {
        name: 'firewall',
        icon: 'images/icon_firewall.png',
        title: '防火墙'
    }, {
        name: 'computer',
        icon: 'images/icon_computer.png',
        title: '主机'
    }, {
        name: 'firewall',
        icon: 'images/icon_firewall.png',
        title: '防火墙'
    }, {
        name: 'computer',
        icon: 'images/icon_computer.png',
        title: '主机'
    }, {
        name: 'firewall',
        icon: 'images/icon_firewall.png',
        title: '防火墙'
    }]
    var Ctrl = {
        init: function(svg) {
            var w, h;
            w = svg.attr('width');
            h = svg.attr('height');
            Ctrl.svg = svg;
            Ctrl.startX = svg.attr('width') - 212;
            Ctrl.startY = 10;
            Ctrl.box = svg.append('g')
                .attr('id', 'libbody')
                .attr('transform', "translate(" + Ctrl.startX + ','+ Ctrl.startY +')');
            
            Ctrl.renderIcons();
            //Ctrl.$el.find('img').tooltip();
            var drag = d3.behavior.drag()
                .on("dragstart", function(d, i) {
                    //console.log(d, i);
                    SM.dragSer.setDragStatus(true);
                    d.x = 0;//Number(d3.select(this).attr("x"));
                    d.y = 0;//Number(d3.select(this).attr("y"));
                    //do some drag start stuff...
                })
                .on("drag", function(d) {
                    //only if its new country
                    //if(d3.select('#b'+d.id).attr("class") == "country"){
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                    //console.log([d.x,d.y]);
                    d3.select(this).attr("transform", function(d, i) {
                        return "translate(" + [d.x, d.y] + ")"
                    });
                    //}
                })
                .on("dragend", function(d, i) {
                    //we're done, end some stuff
                    console.log(SM.dragSer.getHoverNode());//(Ctrl.startX + d.x, d.y + 10);
                    SM.dragSer.setDragStatus(false);
                    d3.select(this).attr("transform", function(d, i) {
                        return "translate(" + [0, 0] + ")"
                    });
                });
            d3.selectAll(".icon").call(drag);
        },
        getDropNode :function(){
            var nodes  = d3.selectAll('.node');

        },
        getPosition: function(i, type) {
            var w = h = 64;
            var space = 10;
            if (type == 'x') {
                return i % 3 * (w + space) 
            } else {
                return Math.floor(i / 3) * (h + space)
            }

        },
        renderIcons: function() {
            
            
            Ctrl.box.selectAll('img')
            .data(libs)
            .enter()
            .append("image")
            .attr("class", 'icon')
            .attr("xlink:href", function(d,i){
                return d.icon
            })
            .attr("x", function(d,i){
                return Ctrl.getPosition(i,'x')
            })
            .attr("y", function(d,i){
                return Ctrl.getPosition(i,'y')
            })
            .attr("width", "64px")
            .attr("height", "64px");
            //var html = '';
            // $.each(libs, function(i, item) {
            //     html += "<img class='icon img-rounded' data-toggle='tooltip'  src='" + item.icon + "' data-name= '" + item.name + "' title='" + item.title + "'/>"
            // });
            // Ctrl.$el.html(html);
        }
    };

    return Ctrl

});