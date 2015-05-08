// create both margins for svg
var margin1 = {top: 20, right: 80, bottom: 170, left: 100},
    margin2 = {top: 460, right: 80, bottom: 50, left: 100}
    width1 = 1100 - margin1.left - margin1.right,
    height1 = 600 - margin1.top - margin1.bottom,
    height2 = 600 - margin2.top - margin2.bottom;

// parse the date to time format
var parseDate = d3.time.format("%b-%y").parse;

// create scale for the colors using colorbrewer
var colorScale1 = d3.scale.ordinal()
                   .range(colorbrewer.Set2[3]);

// create scale for hover colors
var colorScaleH = d3.scale.ordinal()
                    .range(colorbrewer.Dark2[3]);

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
var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0.9);

// load in the data and add to svg
d3.csv("seatbelt_chart1.csv", function(error, data) {

    // add color into data  
    colorScale1.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    // add new date into data
    data.forEach(function(d) { d.date = parseDate(d.date); });

    // create objects with data for each line
    var seatbelts = stack(colorScale1.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {date: d.date, y: +d[name]};
            })
        };
    }));
    console.log(seatbelts)
    // add in the scales for each chart
    xScale1.domain(d3.extent(data.map(function(d) { return d.date; })));
    yScale1.domain([0, 4500]);
    xScale2.domain(xScale1.domain());
    yScale2.domain(yScale1.domain());

    // add the path and area fill for the main chart
    focus.selectAll("path")
         .data(seatbelts)
         .enter()
         .append("path")
         .attr('clip-path', 'url(#clip)')
         .attr("d", function(d) { return area1(d.values); })
         .attr('class', 'focus')
         .style("fill", function(d) { return colorScale1(d.name); });

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
         .attr("y", 0 - margin1.left + 5)
         .attr("x", 0 - height1/2)
         .attr("dy", "1em")
         .style("text-anchor", "middle")
         .text("Number of Deaths/Injuries");

    // add in path and area for small chart
    context.selectAll("path")
           .data(seatbelts)
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

    // create a legend for color and region
    var legend = svg2.selectAll('.legend')
                     .data(colors)
                     .enter()
                     .append('g')
                     .attr('class', 'legend')
                     .attr('transform', function(d, i) { 
                        return 'translate(' + (width + margin1.right) + ',' + (i * 20) + ')';
                      });

    // fill rectangles with colors
    legend.append('rect')
          .attr('height', 15)
          .attr("width", 15)
          .style('fill', function(d) { return d.value; })
          .style('opacity', .95)
          .style('stroke', 'black');

    // add the region name
    legend.append('text')
          .attr('x', 18)
          .attr('y', 10)
          .text(function(d) { return d.key; });

    // // add dots for each point for the hover
    // dots2 = svg2.selectAll(".dots")
    //             .data(seatbelts)
    //             .enter()
    //             .append("g")
    //             .style("fill", function(d) { return colorScaleH(d.name);})
    //             .attr("class", "points")
    //             .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");;

    // // show the points on a mouseover
    // dots2.selectAll("point")
    //      .data(function(d) {return d.values; })
    //      .enter()
    //      .append("circle")
    //      .attr("class", "dot")
    //      .attr("cx", function(d) { return xScale1(d.date); }) 
    //      .attr("cy", function(d) { return yScale1(d.y0 + d.y); }) 
    //      .attr("r", 5)
    //      .style("opacity", 1)
    //      .on("mouseover", function(d) {
    //          tooltip.transition()
    //                 .style("opacity",1);
    //          tooltip.html("<span><b>Killed or seriously injured</b>: " + format(d.y) +" </span><br>" +
    //                       "<span><b>Month</b>: " + monthName(d.date) + "</span><br>" +
    //                       "<span><b>Year</b>: " + d.date.getFullYear() + "</span><br>")
    //                .style("left", (event.pageX + 15) + "px")     
    //                .style("top", (event.pageY - 20) + "px"); 
    //         d3.select(this).style("opacity", 0.9); 
    //       })
    //      .on("mouseout", function(d){
    //         tooltip.transition()
    //                .style("opacity", 0);
    //         d3.select(this).style("opacity", 0); });
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
function create_colors(data) {
    colors = {}
    colors["Drivers"] = colorScale1("drivers");
    colors["Front Passengers"] = colorScale1("front");
    colors["Rear Passengers"] = colorScale1("rear");
    return colors
}






