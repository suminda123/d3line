/**
 * Created by earl.suminda on 20/12/2016.
 */
let margin = {top:10, right: 20, bottom: 100, left: 40};
let width = 1200 - margin.left - margin.right;
let height = 240 - margin.top - margin.bottom;

let svg = d3.select('.chart')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

svg.append('rect')
	.attr('width', width)
	.attr('height', height)
	.style('fill', 'lightblue')
	.style('stroke', 'green');

let yScale = d3.scaleLinear()
	.domain([0,4])
	.range ([height, 0]);

let yAxis = d3.axisLeft(yScale)
	.ticks(4);
	
svg.call(yAxis);

let xScale = d3.scaleTime()
	.domain([new Date(2016,0,1), new Date(2016,0,2)])
	.range([0, width]);

let xAxis = d3.axisBottom(xScale)
	.ticks(24)
	.tickArguments([d3.timeMinute.every(30)])
	.tickSizeInner(10)
	.tickSizeOuter(20)
	.tickPadding(5);


svg
	.append('g')
	.attr('transform', 'translate(0, ' + height + ')')
	.call(xAxis)
	.selectAll("text")
	.style("text-anchor", "end")
	.attr("dx", "-.8em")
	.attr("dy", ".15em")
	.attr("transform", "rotate(-65)");

d3.json('./data.json', function(err, data){
	
	if(err) {
		console.log(err);
		return;
	}
	
	//console.log(data);
	data.data.forEach(d=>  d.date = new Date(d.date));
	//var chartData =  data.data.map(function(d){
		
		//return {status : d.status, date : new Date(d.date)}
	//}); //
	
	//console.log(chartData);
	let line = d3.line()
		.x(function (d) {
			return d.date;
		})
		.y(function(d){
			 return d.status
		});
	
	svg
		.append('path')
		.datum(data)
		.attr('class', 'line')
		.attr('d', function() {
			return line(data.data);
		})
		.style('stroke', function(d,i) {
			return ['#FF9900'][i];
		});
	
});