$( document ).ready(function() {
		
		var width = 1200;
        var height = 1000;
		var mleft = 0;
		var top_level = 1;
		var betw = 0;
		var graph;
		var table;
		var node_w = 120;
		var node_h = 90;
		var text_margin = 10;
		var r_circle = 5;
		var dash_hight = 800;
		var fontsize = 12;
		
		$.ajax({ 
			type: 'GET', 
			url: 'http://private-9f3c8-angstrom.apiary-mock.com/system', 
			success: function (data) {
				graph = data;			
				start();
			}
		});
		var resizeId;
			$(window).resize(function() {
				clearTimeout(resizeId);
			resizeId = setTimeout(doneResizing, 500);
		});
		 
		 
		function doneResizing(){
			width = window.innerWidth;
			var h = window.innerHeight;
			location.reload(true);
			start();
		}
			
		var width = window.innerWidth;
		mleft = Math.floor(width/12);
	
	function start(){
		console.log("changed event");
		graph['Components'].forEach(function(data) {
		  if(top_level<data["Level"])
			  top_level = data["Level"];
		});
		var length = Math.floor(top_level + top_level * 0.5);
		if(width < length * 120)
		{
			r_circle = 3;
			text_margin = 0;
			mleft = Math.floor(width/40);
			node_w = Math.floor((width - 2 * (mleft + 5)) / length);
			node_h = Math.floor((node_w * 9) / 12);
			dash_hight = width;
			fontsize = 10;
			if(width < 400)
				fontsize = 7;
		}
		else {
			r_circle = 5;
			node_w = 120;
			node_h = 90;
			text_margin = 10;
			dash_hight = 800;
			fontsize = 12;
		}
		console.log(node_w);
		betw = Math.floor((width - top_level * node_w - 2 * (mleft + 3))/ (top_level - 1));
		console.log(width);
		draw_diagram(graph);
	}
		
	function draw_diagram(data){	
		graph = data;

        var svg = d3.select("#canvas").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");
				
		var lines = svg.attr("class", "line")
				.selectAll("line").data(graph.Connections)
				.enter().append("line")
				.attr("x1", function (d) {
					return (graph["Components"][d.From-1].Level-1) * (betw + node_w) + mleft + node_w;
				})
				.attr("y1", function (d) {
					return findFrom(d.From);
				})
				.attr("x2", function (d) {
					return (graph["Components"][d.To-1].Level-1) * (betw + node_w) + mleft;
				})
				.attr("y2", function (d) {
					return findFrom(d.To);
				});

		for (i = 1; i < top_level; i++) { 
			var dashs = svg.attr("class", "dash")
				.append("line")
				.style("stroke", "#8f8f8f")
				.attr("x1", function () {
					return (betw + node_w) * (i - 1) + betw/2 + node_w + mleft;
				})
				.attr("y1", 0)
				.attr("x2", function () {
					return (betw + node_w) * (i - 1) + betw/2 + node_w + mleft;
				})
				.attr("y2", dash_hight);
		}		

		var right_circles = svg.selectAll("circle")
	            .data(graph.Components)
                .enter().append("circle")
                .attr("r", r_circle)
                .attr("cx", function (d, i) {
                    return (graph["Components"][d.ID-1].Level-1) * (betw + node_w) + mleft + node_w;
                })
                .attr("cy", function (d, i) {
                    return findFrom(d.ID);
                });

		var left_circles = svg.selectAll("lcircle")
	            .data(graph.Components)
                .enter().append("circle")
                .attr("r", r_circle)
                .attr("cx", function (d, i) {
                    return (graph["Components"][d.ID-1].Level-1) * (betw + node_w) + mleft;
                })
                .attr("cy", function (d, i) {
                    return findFrom(d.ID);
                });				
		
		var rects = svg.selectAll("rect")
                .data(graph.Components)
                .enter().append("rect")
				.attr("rx", 8)
				.attr("ry", 6)
                .attr("width", node_w)
				.attr("height", node_h)
                .attr("x", function (d, i) {
                    return (d.Level-1) * (betw + node_w) + mleft;
                })
                .attr("y", function (d, i) {
                    return findYpos(d.Level, d.ID);
                });
				
		var texts = svg.selectAll("texts")
				.data(graph.Components)
				.enter().append("text")
				.attr('font-size',fontsize)
				.attr("x", function (d, i) {
					return (d.Level-1) * (betw + node_w) + mleft + text_margin;
				})
				.attr("y", function (d, i) {
					return findYpos(d.Level, d.ID) + Math.floor(node_h / 2);
				})
				.attr("dy", ".20em")
				.text(function(d) { return d.Name; });

	}
	
    function findAttribute(name) {
        for (var i = 0, len = graph.nodes.length; i < len; i++) {
            if (graph.nodes[i].name === name)
                return graph.nodes[i]; // Return as soon as the object is found
        }
        return null; // The object was not found
    }
	
	function findYpos(level, index){
		var count = 0;
		var temp;
		for(var i=0, len = graph.Components.length; i < len; i++){
			if(graph["Components"][i].Level == level)
			{
				count++;
				if(graph["Components"][i].ID == index)
					temp = count;
			}
		}
		return temp * node_w;
	}
	
	function findFrom(index){
		var count = 0;
		var temp;
		for(var i=0, len = graph.Components.length; i < len; i++){
			if(graph["Components"][i].Level == graph["Components"][index-1].Level)
			{
				count++;
				if(graph["Components"][i].ID == index)
					temp = count;
			}
		}
		return temp * node_w + node_h / 2;
	}
});
	