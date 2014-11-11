/**
 *
 * @authors feige (feige_hu@foxmail.com)
 * @date    2014-11-10 14:26:54
 * @version $Id$
 */

define(['d3'], function (d3) {
    function myGraph(el) {

        // Add and remove elements on the graph object
        this.addNode = function (id, type) {
            if (!type) type = "PC";
            nodes.push({"id": id, type: type});
            update();
        }

        this.removeNode = function (id) {
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

        this.addLink = function (sourceId, targetId, type, text) {
            if (!!type) type = "normal";
            var sourceNode = findNode(sourceId);
            var targetNode = findNode(targetId);

            if ((sourceNode !== undefined) && (targetNode !== undefined)) {
                links.push({"source": sourceNode, "target": targetNode, "type": type, text: text});
                update();
            }
        }

        this.removeLink = function (sourceId, targetId) {
            //TODO 删除待完善
            //links.
        }

        this.getLinks = function () {
            return force.links();
        }

        this.getNodes = function () {
            return force.nodes();
        }

        var findNode = function (id) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id === id)
                    return nodes[i]
            }
            ;
        }

        var findNodeIndex = function (id) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id === id)
                    return i
            }
            ;
        }

        // set up the D3 visualisation in the specified element
        var w = $(el).innerWidth(),
            h = $(el).innerHeight();

        var vis = this.vis = d3.select(el).append("svg:svg")
            .attr("width", w)
            .attr("height", h);

        var force = d3.layout.force()
            .gravity(.05)
            //.chargeDistance(100)
            .charge(-400)
            .linkDistance(40)
            .size([w, h]);

        var nodes = force.nodes(),
            links = force.links();

        var update = function () {

            var link = vis.selectAll("line.link")
                .data(links, function (d) {
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

            var node = vis.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id;
                });

            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .call(force.drag);

            nodeEnter.append("image")
                .attr("class", "circle")
                .attr("xlink:href", function (d) {
                    return "./images/" + nodetype[d.type]
                })
                .attr("x", "-32px")
                .attr("y", "-32px")
                .attr("width", "64px")
                .attr("height", "64px");

            nodeEnter.append("text")
                .attr("class", "nodetext")
                .attr("dx", 12)
                .attr("dy", ".35em")
                .text(function (d) {
                    return d.id
                });

            node.exit().remove();

            force.on("tick", function () {
                link.attr("x1",function (d) {
                    return d.source.x;
                }).attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            });

            force.drag().on("dragend",function(d)
            {
                console.debug(d);
            });
            force.drag()
                .on("dragstart", function (d) {
                    d3.select(this).classed("fixed", d.fixed = true);
                });

            // Restart the force layout.
            force.start();
        }

        // Make it all go
        update();

        nodetype = ["AS5100.png",
            "atm.png",
            "Catalyst.png",
            "Concentrator.png",
            "Crescendo.png",
            "hub.png",
            "Interface.png",
            "my_computer.png",
            "PC.png",
            "protocol.png",
            "Router.png",
            "server.png",
            "Silicon.png",
            "Workgroup.png",
            "works.png"]

    }

    return {
        init: function () {

            graph = new myGraph("#graph");

            // You can do this from the console as much as you like...
//		graph.addNode("001");
//        graph.addNode("002");
//		graph.addLink("001", "002");
//		graph.addNode("A");
//		graph.addNode("B");
//		graph.addLink("A", "B");


            graph.addNode("PC-001", "2");
            graph.addNode("PC-002", "2");

            graph.addNode("R-001", "3");
            graph.addNode("R-002", "3");
            graph.addNode("R-101", "3");
            graph.addNode("R-102", "3");

            graph.addLink("PC-001", "R-001", "2", "100.100.100.222");
            graph.addLink("R-001", "R-002", "2", "100.100.100.222");
            graph.addLink("R-101", "R-002", "2", "100.100.100.222");
            graph.addLink("R-101", "R-102", "2", "100.100.100.222");
            graph.addLink("R-102", "PC-102", "2", "100.100.100.222");
        }


    }

});


