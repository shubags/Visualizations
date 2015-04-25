function plot2(){

var format = d3.time.format("%Y-%m-%d");

var margin = {top: 80, right: 30, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var z = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    // .ticks(d3.time.days);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var stack = d3.layout.stack()
    .offset("zero")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; });

var nest = d3.nest()
    .key(function(d) { return d.key; });

var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var svg = d3.select("#myPlot2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("display", "block") 
    .attr("left-margin", "auto")
    .attr("right-margin", "auto")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("carDeaths1.csv", function(data) {
  data.forEach(function(d) {
    d.date = format.parse(d.date);
    d.value = +d.value;
  });

  var layers = stack(nest.entries(data));
  
  var seatCol = ['driver','front','rear'].map(function(d,i){return {
                      "seat": d,
                      "color": z(i)};
                    });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

  svg.append("text")
     .attr("x", (width - 2 * margin.left) / 2 + margin.left)
     .attr("y", "0px")
     .style("text-anchor", "middle")
     .style("font-size", "24px")
     .style("font-weight", "bold")
     .text("Deaths and Injuries Based on Location in Car")

  svg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) { return z(i); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -80)
        .attr("dy", ".71em")
        .attr("x", -80)
        .style("text-anchor", "end")
        .text("Deaths or Serious Injuries");

  var legendCol = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 50) + "," + (0) + ")")
        .selectAll("g")
        .data(seatCol)
        .enter().append("g")
        ;
    legendCol.append("text")
        .attr("y", 30)
        .attr("dy", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Car Seat Location")

    legendCol.append("rect")
        .attr("y", function(d, i) {return (-i + 4) * 20; })
        .attr("x", -40)
        .attr("width", 80)
        .attr("height", 20)
        .attr("fill", function(d){return d.color})
        ;

    legendCol.append("text")
        .attr("y", function(d, i) {return 15 + (-i + 4) * 20; })
        .attr("x", 0)
        .attr("text-anchor", "middle")
        .text(function(d){return d.seat;})
        .style("fill", "black")
        .style("font-weight", "bold")
        ;
});
}
plot2()