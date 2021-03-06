function plot3(){
// create both margins for svg
var margin1 = {top: 20, right: 80, bottom: 170, left: 80},
    margin2 = {top: 460, right: 80, bottom: 50, left: 80}
    width1 = 960 - margin1.left - margin1.right,
    height1 = 600 - margin1.top - margin1.bottom,
    height2 = 600 - margin2.top - margin2.bottom;

// parse the date to time format
var parseDate = d3.time.format("%Y").parse;

// create scale for the colors
var colorScale1 = d3.scale.category20();

// create scale for hover colors
var colorScaleH = d3.scale.category20();


// create scale for x axis - murders
var xScale1 = d3.time.scale()
                .range([0, width1]),
    xScale2 = d3.time.scale()
                .range([0, width1]);

// create scale for y axis - life expectancy
var yScale1 = d3.scale.linear()
                .range([height1, 0]),
    yScale2 = d3.scale.linear()
                .range([height2, 0]);

// create x axis
var xAxis1 = d3.svg.axis()
               .scale(xScale1)
               .orient("bottom"),
    xAxis2 = d3.svg.axis()
               .scale(xScale2)
               .orient("bottom");

// create y axis
var yAxis1 = d3.svg.axis()
               .scale(yScale1)
               .orient("left");

// create brush
var brush = d3.svg.brush()
              .x(xScale2)
              .on("brush", brushed);

// create area for stacked chart
var area1 = d3.svg.area()
              .interpolate("monotone")
              .x(function(d) { return xScale1(d.date); })
              .y0(function(d) { return yScale1(d.y0); })
              .y1(function(d) { return yScale1(d.y0 + d.y); });

// create area for stacked chart
var area2 = d3.svg.area()
              .interpolate("monotone")
              .x(function(d) { return xScale2(d.date); })
              .y0(function(d) { return yScale2(d.y0); })
              .y1(function(d) { return yScale2(d.y0 + d.y); });

// create stack area
var stack = d3.layout.stack()
                     .values(function(d) { return d.values; });

// create svg for c level functionality
var svg2 = d3.select("#myPlot3")
             .append("svg")
             .attr("width", width1 + margin1.left + margin1.right)
             .attr("height", height1 + margin1.top + margin1.bottom)
             .attr("display", "block") 
            .attr("left-margin", "auto")
            .attr("right-margin", "auto");


svg2.append("text")
   .attr("x", (width1 / 2) + margin1.left)
   .attr("y", margin1.top)
   .style("text-anchor", "middle")
   .style("font-size", "16px")
   .style("font-weight", "bold")
   .text("NATO Country's Absolute Defense Spending");


// add clip range (so brushing/panning do go out of range)
svg2.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width1)
    .attr("height", height1);

// add chart for the focus (larger chart)
var focus = svg2.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

// add chart for context to use for panning and brushing
var context = svg2.append("g")
                  .attr("class", "context")
                  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// create a tooltip for hover
// var tooltip = d3.select("body").append("div")   
//     .attr("class", "tooltip")               
//     .style("opacity", 0.9);



// load in the data and add to svg
d3.csv("natoSpending.csv", function(error, data) {


    // add color into data  
    colorScale1.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    // add new date into data
    data.forEach(function(d) { d.date = parseDate(d.date); });

    var headerNames = d3.keys(data[0]);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) {
        return "<strong>Country: </strong> <span style='color:red'>" + d.name + "</span>"
        ;
      });


    // call tooltip
    svg2.call(tip);
    
    // create objects with data for each line
    var spending = stack(colorScale1.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {date: d.date, y: +d[name]};
            })
        };

    }));
    // add in the scales for each chart

    // var maxY = Math.max.apply(Math, d3.values(letters))
    xScale1.domain(d3.extent(data.map(function(d) { return d.date; })));
    yScale1.domain([0, 1100]);
    xScale2.domain(xScale1.domain());
    yScale2.domain(yScale1.domain());

    // add the path and area fill for the main chart
    focus.selectAll("path")
         .data(spending)
         .enter()
         .append("path")
         .attr('clip-path', 'url(#clip)')
         .attr("d", function(d) { return area1(d.values); })
         .attr('class', 'focus')
         .style("fill", function(d) { return colorScale1(d.name); });
         // .on('mouseover', tip.show)
         // .on('mouseout', tip.hide);

    // add in the x axis
    focus.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height1 + ")")
         .call(xAxis1);

    // add in the y axis
    focus.append("g")
         .attr("class", "y axis")
         .call(yAxis1);

    // add y axis label
    focus.append("text")
         .attr("transform", "rotate(-90) translate(-10, 0)")
         .attr("y", 0 - margin1.left + 10)
         .attr("x", 0 - height1/2)
         .attr("dy", "1em")
         .style("text-anchor", "middle")
         .text("Defense Spending (in billions of FY11 $US)")
         .style("font-size", "16px");

    // add in path and area for small chart
    context.selectAll("path")
           .data(spending)
           .enter()
           .append("path")
           .attr('class', 'context')
           .attr("d", function(d) { return area2(d.values); })
           .style("fill", function(d) { return colorScale1(d.name); });

    // add in the x axis
    context.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height2 + ")")
           .call(xAxis2);

    // add x axis label
    context.append("text")
           .attr("x", width1/2)
           .attr("y",  height2 + margin2.bottom - 5)
           .style("text-anchor", "middle")
           .text("Date");

    // add in the y axis
    context.append("g")
           .attr("class", "x brush")
           .call(brush)
           .selectAll("rect")
           .attr("y", -6)
           .attr("height", height2 + 7);

    // create objects with region and color
    var colors = d3.entries(create_colors(data))


    colorList = colorScale1.domain().reverse().map(function(d){
      return {'name': d, 'color': colorScale1(d)}
    });



    // create a legend for color and region
    var legend = svg2.selectAll('.legend')
                     .data(colorList)
                     .enter()
                     .append('g')
                     .attr('class', 'legend')
                     .attr('transform', function(d, i) { 
                        return 'translate(' + (margin1.left + 20) + ',' + (i * 20 + 20) + ')';
                      });

    // fill rectangles with colors
    legend.append('rect')
          .attr('height', 15)
          .attr("width", 15)
          .style('fill', function(d) { return d.color; })
          .style('opacity', .95)
          .style('stroke', 'black');

    // add the region name
    legend.append('text')
          .attr('x', 18)
          .attr('y', 10)
          .text(function(d) { return d.name; });


})

// function for brushing
function brushed() {
    xScale1.domain(brush.empty() ? xScale2.domain() : brush.extent());
    focus.selectAll("path.focus").attr("d", function(d) { return area1(d.values);});
    focus.select(".x.axis").call(xAxis1);
    // dots2.selectAll("point.dot").attr("cx", function(d) { return xScale1(d.date); }) 
    //                             .attr("cy", function(d) { return yScale1(d.y0 + d.y); }); 
}

// create object of colors and regions
function create_colors(headerNames) {
    colors = {}
    for(var i; i < headerNames.length; i++){
      colors[headerNames[i]] = colorScale1(headerNames[i]);

    return colors
  }
}


};
plot3()



