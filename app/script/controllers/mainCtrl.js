/**
 *
 * @authors feige (feige_hu@foxmail.com)
 * @date    2014-11-10 14:26:54
 * @version $Id$
 */

define(['d3', 'SM'], function(d3, SM) {
	function myGraph(el) {

		// Add and remove elements on the graph object
		this.addNode = function(id, type) {
            if(!type) type = 0;
			nodes.push({
				"id": id,
				"type": type
			});
			update();
		}

		this.removeNode = function(id) {
			var i = 0;
			var n = findNode(id);
			while (i < links.length) {
				if ((links[i]['source'] === n) || (links[i]['target'] == n)) links.splice(i, 1);
				else i++;
			}
			var index = findNodeIndex(id);
			if (index !== undefined) {
				nodes.splice(index, 1);
				update();
			}
		}

		this.addLink = function(sourceId, targetId) {
			var sourceNode = findNode(sourceId);
			var targetNode = findNode(targetId);

			if ((sourceNode !== undefined) && (targetNode !== undefined)) {
				force.stop();
				links.push({
					"source": sourceNode,
					"target": targetNode
				});
				setTimeout(update,300);
				//update();

			}
		}

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


        var findLink = function (sourceId, targetId) {
            for (var i = 0; i < links.length; i++) {
                if ((links[i].source.id === sourceId && links[i].target.id === targetId)
                    || (links[i].source.id === targetId && links[i].target.id === sourceId))
                    return links[i];
            }
        }
         var findSelectNode= function (nodes, node) {
                for (var i = 0; i < nodes.length; i++) {
                    if ((nodes[i].t === node.t && nodes[i].d === node.d))
                        return nodes[i];
                }
            }

		
		this.getLinks = function () {
		    return force.links();
		    }

		this.getNodes = function () {
		    return force.nodes();
		    }

        var nodetype = [
            "AS5100.png",
            "atm.png",
            "Catalyst.png",
            "Concentrator.png",
            "Crescendo.png",
            "hub.png",
            "icon_computer.png",
            "icon_firewall.png",
            "icon_router.png",
            "Interface.png",
            "PC.png",
            "protocol.png",
            "Router.png",
            "server.png",
            "Silicon.png",
            "Workgroup.png",
            "works.png"
        ];
        
		// set up the D3 visualisation in the specified element
		var w = el.attr('width'),
			h = el.attr('height');
		//var timer, self = this;
		var vis = this.vis = el;
		var force = d3.layout.force()
			.gravity(.05)
			//.distance(100)
            .charge(-400)
            .linkDistance(40)
			.size([w, h]);

		var nodes = force.nodes(),
			links = force.links();

		var link, node;

		var node_drag = d3.behavior.drag()
			.on("dragstart", dragstart)
			.on("drag", dragmove)
			.on("dragend", dragend);

		function dragstart(d, i) {
			force.stop(); // stops the force auto positioning before you start dragging
		}

		function dragmove(d, i) {
			d.px += d3.event.dx;
			d.py += d3.event.dy;
			d.x += d3.event.dx;
			d.y += d3.event.dy;
			tick();
		}

		function dragend(d, i) {
			d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
			tick();
			force.resume();
		}

		function tick() {
			// body...
			link.attr("x1", function(d) {
					return d.source.x;
				})
				.attr("y1", function(d) {
					return d.source.y;
				})
				.attr("x2", function(d) {
					return d.target.x;
				})
				.attr("y2", function(d) {
					return d.target.y;
				});

			node.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
		}
		
		var update = this.update = function() {

			link = vis.selectAll("line.link").data(links, function(d) {
					return d.source.id + "-" + d.target.id;
				});


            var linkG = link.enter().append("g");
	            linkG.append("line")
	                .attr("class", "link");


	            linkG.append("text")
	                .attr("dx", 12)
	                .attr("dy", ".35em")
	                .attr("class", "nodetext")
	                .attr("fill", "red")
	                .text(function (d) {
	                    return d.text
	                });

			link.exit().remove();

			node = vis.selectAll("g.node").data(nodes, function(d) {
					return d.id;
				});

			var nodeEnter = node.enter().append("g")
				.attr("class", "node")
				.on('mouseover', function(d, i) {
					if (SM.dragSer.isDrag) {
						SM.dragSer.setHoverNode(d);
						//console.log(d,i);
					}
				})
				.call(node_drag);

			//.call(force.drag);

			nodeEnter.append("image")
				.attr("class", "circle")
				.attr("xlink:href", function(d){return "./images/"+ nodetype[d.type];})
				.attr("x", "-32px")
				.attr("y", "-32px")
				.attr("width", "64px")
				.attr("height", "64px");

			nodeEnter.append("text")
				.attr("class", "nodetext")
				.attr("dx", "-1em")
				.attr("dy", "2.5em")
				.text(function(d) {
					return d.id
				});

			node.exit().remove();

            // Restart the force layout.force
            force.start();
        }
		force.on("tick", tick);
		//force.start();
        // Make it all go
        update();


	}

	var graph;

    $("#btnGetInfo").on("click",function(){
        console.debug("btnGetInfo click");
        console.debug({nodes:SM.graphSer.nodes,links:SM.graphSer.links});
        console.debug(JSON.stringify({nodes:SM.graphSer.nodes,links:SM.graphSer.links}));
        $.ajax("/update",{method:"POST",data:{nodes:SM.graphSer.nodes,links:SM.graphSer.links}
        });
    });

    $("#btnGetData1").on("click",function(){
        $.getJSON("data/data1.json",function(json){
            SM.graphSer.init(SM.graphSer.svg,json);
        });
    });

    $("#btnGetData2").on("click",function(){
        $.getJSON("data/data2.json",function(json){
            SM.graphSer.init(SM.graphSer.svg,json);
        });
    });

    $("#btnClean").on("click",function(){
         SM.graphSer.init(SM.graphSer.svg);
    });

	return {
		init: function(svg) {

//            SM.graphSer.init(svg);

           $.getJSON("data/data1.json",function(json){
               SM.graphSer.init(svg,json);
           });


//            graph = new myGraph(svg);
//			SM.graphSer.setGraph(graph);
//
			return false;
            graph.addNode("PC-001", "2");
            graph.addNode("PC-002", "2");

            graph.addNode("R-001", "3");
            graph.addNode("R-002", "4");
            graph.addNode("R-101", "3");
            graph.addNode("R-102", "4");

            //FIXME 这里的顺序不管怎么调整，最后一根线始终会消失
            graph.addLink("PC-001", "R-001", "2", "100.100.100.222");
            graph.addLink("PC-002", "R-101", "2", "100.100.100.222");
            graph.addLink("R-001", "R-002", "2", "100.100.100.222");
            graph.addLink("R-102", "R-002", "2", "100.100.100.222");
            graph.addLink("R-102", "R-101", "2", "100.100.100.222");

		}
	}

});