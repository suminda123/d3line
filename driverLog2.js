/**
 * Created by earl.suminda on 20/12/2016.
 */
var margin = {top:30, right: 20, bottom: 100, left: 150};
var width = 1200 - margin.left - margin.right;
var height = 240 - margin.top - margin.bottom;

var fullWidth = 1200 + margin.left + margin.right;
var fullHeight = 240 + margin.top + margin.bottom;

var svg = d3.select('.chart')
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
	
	//ie doesn't support array forEach so use basic for loop
	for (var i = 0; data.length > i ; i++){
		for (var j = 0; data[i].values.length > j ; j++){
					data[i].values[j].date =  new Date(data[i].values[j].date);
					data[i].values[j].status = + data[i].values[j].status;
				}
	}
	
	//data.forEach(c => {
	//	c.values.forEach(d =>{
	//		d.date =  new Date(d.date);
	//		d.status = +d.status;
	//	});
	//});
	
    data[0].values.sort(function(a, b){
        return (a.date - b.date);
    });

    var minDate = data[0].values[0].date;
    var maxDate = data[0].values[data[0].values.length - 1].date;

    console.log(minDate, 'datemin');
    console.log(maxDate, 'datemax');
	
	var xScale = d3.scaleTime()
		.domain([minDate, maxDate])
		.range([0, width]);

	var xAxis = d3.axisBottom(xScale)
		.ticks(24)
		.tickArguments([d3.timeMinute.every(15)])
		.tickFormat(function (d) {
			
			if(d.getMinutes()>0)
				return '';
			
			  var lbl = d3.timeFormat("%I%p")(d);
				if(lbl==='12AM' || lbl==='12PM')
					return lbl;
			
			return d3.timeFormat("%I")(d);
		})
		.tickPadding(10);
	

	svg
		.append('g')
			.attr("class", "xaxis1")
			.attr('transform', 'translate(0, ' + height + ')')
		.call(xAxis);
	
	var xAxis2 = d3.axisBottom(xScale)
		.ticks(24)
		.tickArguments([d3.timeMinute.every(15)])
		.tickFormat(function (d) {
			
			if(d.getMinutes()>0)
				return '';
			
			var lbl = d3.timeFormat("%I%p")(d);
			if(lbl==='12AM' || lbl==='12PM')
				return lbl;
			
			return d3.timeFormat("%I")(d);
		})
		.tickSizeInner(10)
		.tickSizeOuter(20)
		.tickPadding(-25);
	
	svg
		.append('g')
		.attr("class", "xaxis2")
		.attr('transform', 'translate(0, 0)')
		.call(xAxis2);
	
	var yScale = d3.scaleLinear()
		.domain([0,5])
		.range ([height, 0]);
	
	var yAxis = d3.axisLeft(yScale)
		.tickSize(-width)
		.ticks(4)
        .tickFormat(function (d) {
        	if (d===1)
        		return 'ON DUTY';

            if (d===2)
                return 'DRIVING';

            if (d===3)
                return 'SLEEPER BERTH';

            if (d===4)
                return 'OFF DUTY';

            return ''
        });
	
	svg
		.append('g')
		.attr("class", "yaxis")
		.call(yAxis);
	
	var line = d3.line()
		.x(function (d) {
			return xScale(d.date);
		})
		.y(function(d){
			return yScale(d.status);
		})
		.curve(d3.curveStepAfter);

    //line.interpolate('step-after');
	
	svg
		.selectAll('.line')
		.data(data)
		.enter()
		.append('path')
		.attr('class', 'line')
		.attr('d', function(d) {
					return line(d.values);
		})
		.style('stroke', function(d,i) {
			return ['#FF9900'][i];
		})
		.style('stroke-width', 2)
		.style('fill', 'none');
	
	
	//change x axis tick line
	d3.selectAll("g.xaxis1 g.tick line[x1]")
		.attr("x2", function(d){
			//d for the tick line is the value
			//of that tick
			console.log(d.getMinutes(), 'min1');
			
				
			if(d.getMinutes()===30) {
				d3.select(this).attr("y2", "-10");
				return;
			}
				
			if(d.getMinutes()===0) {
				d3.select(this).attr("y2", "-15");
				return;
			}
			
			if(d.getMinutes()>0)
				d3.select(this).attr("y2","-5");
			
		});
	
	d3.selectAll("g.xaxis2 g.tick line[x1]")
		.attr("x2", function(d){
			//d for the tick line is the value
			//of that tick
			console.log(d.getMinutes(), 'min2');
			
			if(d.getMinutes()===30) {
				d3.select(this).attr("y2", "10");
				return;
			}
			
			if(d.getMinutes()===0) {
				d3.select(this).attr("y2", "15");
				return;
			}
			
			if(d.getMinutes()>0)
				d3.select(this).attr("y2","5");
			
		});
	
});


//other functions
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