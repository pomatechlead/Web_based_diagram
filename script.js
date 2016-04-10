$( document ).ready(function() {
		
		var width = 2000;
        var height = 1000;
		var mleft = 120;
		var top_level = 1;
		var graph;
		var table;
		
		$.ajax({ 
			type: 'GET', 
			url: 'http://private-9f3c8-angstrom.apiary-mock.com/system', 
			success: function (data) { 
				draw_diagram(data);
			}
		});
		
	function draw_diagram(data){	
		graph = data;

		graph['Components'].forEach(function(data) {
		  if(top_level<data["Level"])
			  top_level = data["Level"];
		})

        var svg = d3.select("#canvas").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");
				
		var lines = svg.attr("class", "line")
				.selectAll("line").data(graph.Connections)
				.enter().append("line")
				.attr("x1", function (d) {
					return (graph["Components"][d.From-1].Level-1) * 300 + mleft + 120;
				})
				.attr("y1", function (d) {
					return findFrom(d.From);
				})
				.attr("x2", function (d) {
					return (graph["Components"][d.To-1].Level-1) * 300 + mleft;
				})
				.attr("y2", function (d) {
					return findFrom(d.To);
				});

		for (i = 1; i < top_level; i++) { 
			var dashs = svg.attr("class", "dash")
				.append("line")
				.style("stroke", "#8f8f8f")
				.attr("x1", function () {
					return 300 * (i - 1) + 210 + mleft;
				})
				.attr("y1", 0)
				.attr("x2", function () {
					return 300 * (i - 1) + 210 + mleft;
				})
				.attr("y2", 800);
		}		

		var right_circles = svg.selectAll("circle")
	            .data(graph.Components)
                .enter().append("circle")
                .attr("r", 5)
                .attr("cx", function (d, i) {
                    return (graph["Components"][d.ID-1].Level-1) * 300 + mleft + 120;
                })
                .attr("cy", function (d, i) {
                    return findFrom(d.ID);
                });

		var left_circles = svg.selectAll("lcircle")
	            .data(graph.Components)
                .enter().append("circle")
                .attr("r", 5)
                .attr("cx", function (d, i) {
                    return (graph["Components"][d.ID-1].Level-1) * 300 + mleft;
                })
                .attr("cy", function (d, i) {
                    return findFrom(d.ID);
                });				
		
		var rects = svg.selectAll("rect")
                .data(graph.Components)
                .enter().append("rect")
				.attr("rx", 8)
				.attr("ry", 6)
                .attr("width", 120)
				.attr("height", 90)
                .attr("x", function (d, i) {
                    return (d.Level-1)*300 + mleft;
                })
                .attr("y", function (d, i) {
                    return findYpos(d.Level, d.ID);
                });
		
		var texts = svg.selectAll("texts")
				.data(graph.Components)
				.enter().append("text")
				.attr("x", function (d, i) {
					return (d.Level-1)*300 + mleft + 10;
				})
				.attr("y", function (d, i) {
					return findYpos(d.Level, d.ID) + 45;
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
		return temp*120;
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
		return temp*120+45;
	}
});
	