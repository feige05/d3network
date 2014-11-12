/**
 *
 * @authors feige (feige_hu@foxmail.com)
 * @date    2014-11-10 14:26:54
 * @version $Id$
 */

define(['d3', './typeSer', './dragSer'], function(d3, typeSer, dragSer) {

    var findNode = function(id) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return nodes[i]
        };
    }

    var findNodeIndex = function(id) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return i
        };
    }


    var link, node;
    var isDrag;
    var nodetype = typeSer.libs;
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

    var G = {
        i: 0,
        init: function(svg) {
            G.w = svg.attr('width');
            G.h = svg.attr('height');
            G.nodes = [{
                id: 'Collaboration',
                type: 0,
                text: 'Collaboration',
                l: 0,
                x: 0,
                y: G.h / 4,
                w: 128,
                h: 128,
                icon: 'images/icon_cloud.png'
            }, {
                id: 'Internet',
                type: 0,
                l: 0,
                text: 'Internet',
                x: 0,
                y: G.h * 3 / 4,
                w: 128,
                h: 128,
                icon: 'images/icon_cloud.png'
            }];
            G.svg = svg;
            G.links = [];

            G.update();
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
                x: source.x + 128,
                y: source.y + 128,
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
            while (i < links.length) {
                if ((links[i]['source'] === n) || (links[i]['target'] == n)) links.splice(i, 1);
                else i++;
            }
            var index = findNodeIndex(id);
            if (index !== undefined) {
                nodes.splice(index, 1);
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
        }


    }
    return G
});