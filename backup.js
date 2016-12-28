// add cicles for tooltip
console.log(data[0].values, 'draw circles');

var focus = svg.append("g")                                // **********
	.style("display", "none");                             // **********

focus.append("circle")                                 // **********
	.attr("class", "y")                                // **********
	.style("fill", "none")                             // **********
	.style("stroke", "blue")                           // **********
	.attr("r", 4);

var dots = svg.selectAll("circle")
	.data(data[0].values)
	.enter()
	.append("circle")
	.attr({
		cx: function (d) {
			console.log(d, 'circle');
			return xScale(d.date);
		},
		cy: function (d) {
			console.log(d, 'circle');
			return yScale(d.status);
		},
		r: 4,
		"fill" : "#666666"
	});

// append the rectangle to capture mouse               // **********
svg.append("rect")                                     // **********
	.attr("width", width)                              // **********
	.attr("height", height)                            // **********
	.style("fill", "none")                             // **********
	.style("pointer-events", "all")                    // **********
	.on("mouseover", function() { focus.style("display", null); })
	.on("mouseout", function() { focus.style("display", "none"); })
	.on("mousemove", mousemove);                       // **********

function mousemove() {                                 // **********
	var d1 = data[0].values;
	var x0 = xScale.invert(d3.mouse(this)[0]),              // **********
		i = bisectDate(d1, x0, 1),                   // **********
		d0 = d1[i - 1],                              // **********
		d1 = d1[i],                                  // **********
		d = x0 - d0.date > d1.date - x0 ? d1 : d0;     // **********
	
	focus.select("circle.y")                           // **********
		.attr("transform",                             // **********
			"translate(" + xScale(d.date) + "," +         // **********
			yScale(d.status) + ")");        // **********
}                                                      // **********/**
 * Created by earl.suminda on 28/12/2016.
 */
