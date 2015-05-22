function plot1(){

var margin = {top: 20, right: 80, bottom: 50, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var x2 = d3.scale.linear()
    .range([0, width]);


var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// var numTicks = Math.ceil(d3.max(countrySpend, function(c) { return d3.max(c.values, function(v) { return v.spend; }); }));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".0%"));

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.spend); });


var svg = d3.select("#myPlot1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("display", "block")
    .attr("left-margin", "auto")
    .attr("right-margin", "auto")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("natoSpendingPctMelted.csv", function(error, melted){

d3.csv("natoSpendingPct.csv", function(error, data) {

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Year: </strong> <span style='color:white'>" + d.date + "</span><br>" +
           "<strong>Country: </strong> <span style='color:white'>" + d.name + "</span><br>" + 
           "<strong>Spending: </strong> <span style='color:white'>" + (+d.spend * 100).toFixed(2) + "%</span>"
            ;
  })

svg.call(tip);

  countries = d3.keys(data[0]).filter(function(key) { return key !== "date"; });

  color.domain(countries);

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });
  
  var countrySpend = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, spend: +d[name]};
      })
    };
  });


  x2.domain([1950, 2014]);

  x.domain(d3.extent(data, function(d) { return d.date; }));
  
  y.domain([
    d3.min(countrySpend, function(c) { return d3.min(c.values, function(v) { return v.spend; }); }),
    d3.max(countrySpend, function(c) { return d3.max(c.values, function(v) { return v.spend; }); })
  ]);

  // console.log(function(c) { return function(v){return c.values.spend;};})

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("dy", ".71em")
      .attr("x", -80)
      .style("text-anchor", "end")
      .style("font-size", "16px")
      .text("Defense Spending as Pct of GDP");



  svg.selectAll("circle")
     .data(melted)
     .enter()
     .append("circle")
     .attr("cx", function(d) {return x2(+d.date);})
     .attr("cy", function(d){return y(+d.spend);})
     .attr("r", function(d){return 10;})
     .style("opacity", 0)
     .on('mouseover', tip.show)
     .on('mouseout', tip.hide) 
     ;


  svg.append("text")
     .attr("x", (width - 2 * margin.left) / 2 + margin.left)
     .attr("y", margin.top * .5)
     .style("text-anchor", "middle")
     .style("font-size", "24px")
     .style("font-weight", "bold")
     .text("Relative Defense Spending on the Decline");

  var seat = svg.selectAll(".countrySpend")
      .data(countrySpend)
      .enter()
    .append("g")
      .attr("class", "countrySpend")
      .append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); })
;

  // seat.append("text")
  //     .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
  //     .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.spend) + ")"; })
  //     .attr("x", 3)
  //     .attr("dy", ".35em")
  //     .text(function(d) { return d.name; });
});
});
}
plot1()