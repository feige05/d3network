/**
 *
 * @authors feige (feige_hu@foxmail.com)
 * @date    2014-11-10 14:26:54
 * @version $Id$
 */

define(['d3', './typeSer', './dragSer'], function(d3, typeSer, dragSer) {

    var findNode = function(id) {
        for (var i = 0; i < G.nodes.length; i++) {
            if (G.nodes[i].id === id)
                return G.nodes[i]
        };
    }

    var findNodeIndex = function(id) {
        for (var i = 0; i < G.nodes.length; i++) {
            if (G.nodes[i].id === id)
                return i
        };
    }


    var link, node;
    var isDrag;
    var nodetype = typeSer.libs;

    var selectedNode = [];
    var selectedNode2 = [];
//
//    var force = d3.layout.force()
//        .gravity(.05)
//        //.distance(100)
//        .charge(-400)
//        .linkDistance(40)
//        .size([w, h]);
//
//    var nodes = force.nodes(),
//        links = force.links();

    var node_drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);

    function dragstart(d, i) {
        if (d.l === 0) {
            return false
        }
        isDrag = true;
        //force.stop(); // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
        if (!isDrag) {
            return false;
        }
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        tick();
    }

    function dragend(d, i) {
        if (!isDrag) {
            return false;
        }
        isDrag = false;
        d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        tick();
        //force.resume();
    }

    function tick() {
            // body...
            link.attr("x1", function(d) {
                        return d.source.x + d.source.w/2;
                    })
                    .attr("y1", function(d) {
                        return d.source.y + d.source.h/2;
                    })
                    .attr("x2", function(d) {
                        return d.target.x+ d.target.w/2;
                    })
                    .attr("y2", function(d) {
                        return d.target.y + d.target.h/2;
                    });

            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }
        //var cloud = "M26.8828633,15.3655101 C28.7132907,16.1085075 30,17.9035809 30,20 C30,22.7558048 27.7616745,25 25.0005601,25 L7.99943992,25 C5.23249418,25 3,22.7614237 3,20 C3,17.9491311 4.23965876,16.1816085 6.01189661,15.4115388 L6.01189661,15.4115388 C6.00400207,15.275367 6,15.1381509 6,15 C6,11.1340066 9.13400656,8 13,8 C15.6127573,8 17.8911816,9.43144875 19.0938083,11.5528817 C19.8206159,11.1987158 20.6371017,11 21.5,11 C24.1486546,11 26.3600217,12.8722494 26.8828633,15.3655101 Z"

    function findDataNode(_nodes,id) {
        for (var i = 0; i < _nodes.length; i++) {
            if (_nodes[i].id === id)
                return _nodes[i];
        }
    }

    function buildData(json) {

        var _links = [];
        for (var _i = 0; _i < json.links.length; _i++) {
            _links.push({
                source: findDataNode(json.nodes, json.links[_i].source.id),
                target: findDataNode(json.nodes, json.links[_i].target.id)
            });
        }
        return {
            nodes: json.nodes,
            links: _links
        };
    }

    var G = {
        i: 0,
        init: function(svg,json) {
            G.w = svg.attr('width');
            G.h = svg.attr('height');

            if (!!json) {
                var _data = buildData(json);
                G.nodes = _data.nodes;
                G.links = _data.links;
                G.i = G.nodes.length-2;
            }
            else {
                G.nodes = [
                    {
                        id: 'Collaboration',
                        type: 0,
                        text: 'Collaboration',
                        l: 0,
                        x: 0,
                        y: G.h / 4,
                        w: 128,
                        h: 128,
                        icon: 'images/icon_cloud.png'
                    },
                    {
                        id: 'Internet',
                        type: 0,
                        l: 0,
                        text: 'Internet',
                        x: 0,
                        y: G.h * 3 / 4,
                        w: 128,
                        h: 128,
                        icon: 'images/icon_cloud.png'
                    }
                ];
                G.links = [];
            }
            G.svg = svg;
            G.update();

            //FIXME 这里调用两次后，关联才被建立完善，否则出现连线不能跟着变动、新增元素失败等问题
            setTimeout(G.update, 300);
        },
        update: function() {

            link = G.svg.selectAll("line.link")
                    .data(G.links, function(d) {
                        return d.source.id + "-" + d.target.id;
                    });


            var linkG = link.enter().append("g");
                linkG.append("line")
                    .attr("class", "link")
                    .attr("x1", function(d) {
                        return d.source.x + d.source.w/2;
                    })
                    .attr("y1", function(d) {
                        return d.source.y + d.source.h/2;
                    })
                    .attr("x2", function(d) {
                        return d.target.x+ d.target.w/2;
                    })
                    .attr("y2", function(d) {
                        return d.target.y + d.target.h/2;
                    });

            /*linkG.append("text")
                .attr("dx", 12)
                .attr("dy", ".35em")
                .attr("class", "nodetext")
                .attr("fill", "red")
                .text(function(d) {
                    return d.text
                });*/

            link.exit().remove();

            node = G.svg.selectAll("g.node").data(G.nodes, function(d) {
                return d.id;
            });

            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr('transform', function(d) {
                    return "translate(" + d.x + ',' + d.y + ')'
                })
                .on('mouseover', function(d, i) {
                    if (dragSer.isDrag) {
                        dragSer.setHoverNode(d);
                        //console.log(d,i);
                    }
                }).on("click",function(d) {
                    if (key == 1) {

                        if (!!G.findSelectNode(selectedNode, {d: d, t: this})) {
                            console.debug("取消选中状态");
                            //取消选中状态
                            d3.select(this).attr("fill", null);
                            selectedNode.splice(selectedNode.indexOf(G.findSelectNode(selectedNode, {d: d, t: this})), 1);
                        }
                        else {
                            //设置选中
                            d3.select(this).attr("fill", "red");
                            selectedNode.push({d: d, t: this});
                            //当两个被选中，则添加链接
                            if (selectedNode.length == 2) {
                                //未连线方起作用
                                if (!G.findLink(selectedNode[0].d.id, selectedNode[1].d.id)) {
                                    G.links.push({
                                        "source": selectedNode[0].d,
                                        "target": selectedNode[1].d
                                    });
                                    G.update();
                                    setTimeout(G.update(), 300);
                                }
                                d3.select(selectedNode[0].t).attr("fill", null);
                                d3.select(selectedNode[1].t).attr("fill", null);
                                selectedNode = [];
                            }
                        }
                    } else if (key == 2) {
                        if (!!G.findSelectNode(selectedNode2, {d: d, t: this})) {
                            console.debug("取消选中状态");
                            //取消选中状态
                            d3.select(this).attr("fill", null);
                            selectedNode2.splice(selectedNode2.indexOf(G.findSelectNode(selectedNode2, {d: d, t: this})), 1);
                        }
                        else {
                            //设置选中
                            d3.select(this).attr("fill", "red");
                            selectedNode2.push({d: d, t: this});
                            //当两个被选中，则移除链接
                            if (selectedNode2.length == 2) {
                                if (!!G.findLink(selectedNode2[0].d.id, selectedNode2[1].d.id)) {
                                    console.debug("find1");
                                    G.links.splice(G.links.indexOf(G.findLink(selectedNode2[0].d.id, selectedNode2[1].d.id)), 1);
                                }

                               setTimeout(G.update(), 300);
                                d3.select(selectedNode2[0].t).attr("fill", null);
                                d3.select(selectedNode2[1].t).attr("fill", null);
                                selectedNode2 = [];
                            }
                        }
                    }else if (key == 3) {
                        G.removeNode(d.id);
                        console.log("remove");
                    }
                    console.log(d);
                    console.log(key);
                })
                .call(node_drag);

            //.call(force.drag);

            nodeEnter.append("image")
                .attr("class", "circle")
                .attr("xlink:href", function(d) {
                    return d.icon;
                })
                .attr("width", function(d) {
                    return d.w;
                })
                .attr("height", function(d) {
                    return d.h;
                });

            nodeEnter.append("text")
                .attr("class", "nodetext")
                .attr("y", function(d) {
                    return d.h;
                })
                .attr("width", function(d) {
                    return d.w;
                })
                .text(function(d) {
                    return d.text
                });



            node.exit().remove();

        },
        setGraph: function(g) {
            G = g;
        },
        getNewId: function() {
            return G.i++
        },
        getIcon : function(type){
            return nodeType[type].icon
        },

        addNode: function(tpl, source) {
            var node = {
                "id": G.getNewId(),
                "type": tpl.type,
                "icon": tpl.icon,
                 l: source.l + 1,
                x: source.x +200 + 128*Math.random(),
                y: source.y + (source.id=='Internet'?-1:1) *(128)*Math.random(),
                w: 64,
                h: 64,
                text:tpl.title
            };
            //if (!tpl.type) type = 1;
            G.nodes.push(node);
            G.links.push({
                "source": source,
                 "target": node
            });
            console.log(source,node);
            G.update();
            setTimeout(G.update, 300);
        },
        removeNode: function(id) {
            var i = 0;
            var n = findNode(id);
            while (i < G.links.length) {
                if ((G.links[i]['source'] === n) || (G.links[i]['target'] == n)) G.links.splice(i, 1);
                else i++;
            }
            var index = findNodeIndex(id);
            if (index !== undefined) {
                G.nodes.splice(index, 1);
                G.update();
            }
        },
        addLink: function(sourceId, targetId) {
            var sourceNode = findNode(sourceId);
            var targetNode = findNode(targetId);

            if ((sourceNode !== undefined) && (targetNode !== undefined)) {
                //force.stop();
                links.push({
                    "source": sourceNode,
                    "target": targetNode
                });
                setTimeout(G.update, 300);
                //update();

            }
        },
        removeLink: function(sourceId, targetId) {
            //TODO 删除待完善
            //links.
        },
        findLink: function (sourceId, targetId) {
            for (var i = 0; i < G.links.length; i++) {
                if ((G.links[i].source.id === sourceId && G.links[i].target.id === targetId)
                    || (G.links[i].source.id === targetId && G.links[i].target.id === sourceId))
                    return G.links[i];
            }
        }, findSelectNode: function (nodes, node) {
            for (var i = 0; i < nodes.length; i++) {
                if ((nodes[i].t === node.t && nodes[i].d === node.d))
                    return nodes[i];
            }
        }
    }
    return G
});