/**
 *
 * @authors feige (feige_hu@foxmail.com)
 * @date    2014-11-10 14:26:54
 * @version $Id$
 */

define(['d3', 'SM'], function(d3, SM) {
	function myGraph(el) {

		// Add and remove elements on the graph object
		this.addNode = function(id) {
			nodes.push({
				"id": id
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
				links.push({
					"source": sourceNode,
					"target": targetNode
				});
				update();
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

		// set up the D3 visualisation in the specified element
		var w = el.attr('width'),
			h = el.attr('height');

		var vis = this.vis = el;
		var force = d3.layout.force()
			.gravity(.05)
			.distance(100)
			.charge(-100)
			.size([w, h]);
		var node, link;
		var nodes = force.nodes(),
			links = force.links();
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

			link = vis.selectAll("line.link")
				.data(links, function(d) {
					return d.source.id + "-" + d.target.id;
				});

			link.enter().insert("line")
				.attr("class", "link");

			link.exit().remove();

			node = vis.selectAll("g.node")
				.data(nodes, function(d) {
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
				.attr("xlink:href", "./images/icon_computer.png")
				.attr("x", "-32px")
				.attr("y", "-32px")
				.attr("width", "64px")
				.attr("height", "64px");

			nodeEnter.append("text")
				.attr("class", "nodetext")
				.attr("dx", 12)
				.attr("dy", ".35em")
				.text(function(d) {
					return d.id
				});

			node.exit().remove();

			force.on("tick", tick);

			// Restart the force layout.force
			force.start();
		}

		// Make it all go
		update();
	}
	var graph;
	return {
		init: function(svg) {
			graph = new myGraph(svg);

			// You can do this from the console as much as you like...
			this.addNode("001");
			this.addNode("002");
			this.addLink("001", "002");
			this.addNode("A");
			this.addNode("B");
			this.addLink("A", "B");
			this.addNode('C');
			this.addLink('B', 'C');
		},
		addNode: function(node, source) {
			graph.addNode(node);
			if (source) {
				graph.addLink(node, source);
			}
		},
		addLink : function(target, source){
			graph.addLink(target, source);
		},
		update : function(){
			graph.upate();
		}
	}

});