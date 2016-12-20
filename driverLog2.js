/**
 * Created by earl.suminda on 20/12/2016.
 */
let margin = {top:10, right: 20, bottom: 100, left: 40};
let width = 1200 - margin.left - margin.right;
let height = 640 - margin.top - margin.bottom;

let fullWidth = 1200 + margin.left + margin.right;
let fullHeight = 240 + margin.top + margin.bottom;

let svg = d3.select('.chart')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.call(responsivefy)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');


d3.json('./data.json', function(err, data) {
	
	if (err) {
		console.log(err);
		return;
	}
	
	data.forEach(c => {
		c.values.forEach(d =>{
			d.date =  new Date(d.date);
			d.status = +d.status;
		});
	});
	
	//TODO date hardcoded for domain
	console.log(new Date(2016,0,1));
	
	let xScale = d3.scaleTime()
		.domain([new Date(2016,0,1), new Date(2016,0,2)])
		.range([0, width]);
	
	svg
		.append('g')
			.attr('transform', 'translate(0, ' + height + ')')
		.call(d3.axisBottom(xScale).ticks(24));
	
	let yScale = d3.scaleLinear()
		.domain([0,4])
		.range ([height, 0]);
	
	let yAxis = d3.axisLeft(yScale)
		.ticks(4);
	
	svg
		.append('g')
		.call(yAxis);
	
	let line = d3.line()
		.x(function (d) {
			console.log(d, "date");
			return xScale(d.date);
			
		})
		.y(function(d){
			console.log(d, "status");
			return yScale(d.status);
		});
	
	
	svg
		.selectAll('.line')
		.data(data)
		.enter()
		.append('path')
		.attr('class', 'line')
		.attr('d', function(d) {
			console.log(d.values);
				return line(d.values);
		})
		.style('stroke', function(d,i) {
			console.log(i, 'index');
			return ['#FF9900'][i];
		})
		.style('stroke-width', 2)
		.style('fill', 'none');
	
	
});

function responsivefy(svg) {
	// get container + svg aspect ratio
	var container = d3.select(svg.node().parentNode),
		width = parseInt(svg.style("width")),
		height = parseInt(svg.style("height")),
		aspect = width / height;
	
	// add viewBox and preserveAspectRatio properties,
	// and call resize so that svg resizes on inital page load
	svg.attr("viewBox", "0 0 " + width + " " + height)
		.attr("perserveAspectRatio", "xMinYMid")
		.call(resize);
	
	// to register multiple listeners for same event type,
	// you need to add namespace, i.e., 'click.foo'
	// necessary if you call invoke this function for multiple svgs
	// api docs: https://github.com/mbostock/d3/wiki/Selections#on
	d3.select(window).on("resize." + container.attr("id"), resize);
	
	// get width of container and resize svg to fit it
	function resize() {
		var targetWidth = parseInt(container.style("width"));
		svg.attr("width", targetWidth);
		svg.attr("height", Math.round(targetWidth / aspect));
	}
}