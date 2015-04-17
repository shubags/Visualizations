var w = 900
var h = 400

var yPadding = 50;
var xPadding = 100;
var numTicks = 5;

var dataset = []


d3.csv("stateData.csv", function(data) {
  dataset = data
  
function compare(a,b) {
  if (a.illiteracy < b.illiteracy)
     return 1;
  if (a.illiteracy > b.illiteracy)
    return -1;
  return 0;
  }

  dataset = dataset.sort(compare);

  var minX = +d3.min(dataset, function(d){return d.illiteracy;})
  var maxX = +d3.max(dataset, function(d){return d.illiteracy;})
  var minY = +d3.min(dataset, function(d){return d.grad;})
  var maxY = +d3.max(dataset, function(d){return d.grad;})
  var minR = +d3.min(dataset, function(d){return d.murder;})
  var maxR = +d3.max(dataset, function(d){return d.murder;})


  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var report = "<strong>State: </strong> <span style='color:red'>" + d.state + "</span><br>" + 
                   "<strong>Region: </strong> <span style='color:red'>" + d.region + "</span><br>" +
                   "<strong>Grad Rate: </strong> <span style='color:red'>" + d.grad+"%" + "</span><br>" +
                   "<strong>Illiteracy Rate: </strong> <span style='color:red'>" + d.illiteracy+"%" + "</span><br>" +
                    "<strong>Murder Rate: </strong> <span style='color:red'>" + d.murder+" per 100,000" + "</span>"
      return report;
    })

  var svg = d3.select("#myPlot")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr("display", "block")
              .attr("left-margin", "auto")
              .attr("right-margin", "auto")
              ;

  svg.call(tip);

  var xScale = d3.scale.linear()
                    .domain([.2 , maxX+.2])
                    .range([xPadding, w - xPadding])
                    ;

  console.log(xScale(dataset[6].illiteracy));

  var yScale = d3.scale.linear()
                    .domain([minY - (minY % 5), maxY + 5 - (maxY % 5)])
                    .range([h - yPadding, yPadding])
                    ;

  var rScale = d3.scale.sqrt()
                  .domain([minR,maxR])
                  .range([1, Math.pow(h, 0.5)])
                  ;
  
  var categories = dataset.map(function(d) {return d.region;});
  var unique = categories.filter(function(item, i, ar)
                    { return ar.indexOf(item) === i; });
  
  var cScale = d3.scale.category10()
                  .domain(unique)

  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .ticks(10)
                    .orient("bottom")
                    ;

  //Create bars of bar chart
  svg.append("text")
     .attr("x", (w - 2 * xPadding) / 2 + xPadding)
     .attr("y", yPadding * .5)
     .style("text-anchor", "middle")
     .style("font-size", "24px")
     .style("font-weight", "bold")
     .text("Western States Smarter But Not Necessarily Safer")

  svg.selectAll("circle")
     .data(dataset)
     .enter()
     .append("circle")
     .attr("cx", function(d) {return xScale(+d.illiteracy);})
     .attr("cy", function(d){return yScale(+d.grad);})
     .attr("r", function(d){return rScale(+d.murder);})
     .attr("fill", function(d){return cScale(d.region);})
     .style("opacity", 0.5)
     .on('mouseover', tip.show)
     .on('mouseout', tip.hide) 
     ;

  //Create X axis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + (h - yPadding) + ")")
     .call(xAxis)
     .append("text")
     .attr("x", (w - 2 * xPadding) / 2 + xPadding)
     .attr("y", yPadding * .8)
     // .attr("y", h /2 )
     .style("text-anchor", "middle")
     .style("font-size", "18px")
     .text("Illiteracy Rate")
     // .selectAll("line.horizontalGrid")
     // .data(yScale.ticks(numTicks)).enter()
     ;

  var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(10)
                    // .tickFormat(d3.format(precision));

  //Create Y axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (xPadding) + ",0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(h/2))
      .attr("y", -50)
      .style("text-anchor", "middle")
      .style("font-size", "18px")
      .text("High School Graduation Rate")
      .selectAll("line.horizontalGrid")
      .data(yScale.ticks(numTicks)).enter()
      ;
});
