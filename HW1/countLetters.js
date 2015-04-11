
var searchTerms = decodeURI(window.location.search)
var letters = new Object()

searchTerms = searchTerms.replace(/[^a-zA-Z0-9]/g,"").toLowerCase();

for(i = 0; i < searchTerms.length; i++){
   if(searchTerms[i] in letters){
      letters[searchTerms[i]] ++
   } else {
      letters[searchTerms[i]] = 1
   }
}


console.log(letters)

// var letterNames = Object.keys(letters)
var letterCounts = d3.values(letters)
var dataset = d3.entries(letters)

//Sizing variables
var maxVal = Math.max.apply(Math, d3.values(letters));
var yPadding = 25;
var xPadding = 40;
var numTicks = 5;
var scaleRange = maxVal;
var format = 'absolute'
var sumLetters = 0
var sortBy = 'frequency'
var letterNames = []

function compare(a,b) {
if (a.value > b.value)
   return -1;
if (a.value < b.value)
  return 1;
return 0;
}

function add(a, b) {
    return a + b;}
var sumLetters = letterCounts.reduce(add, 0);

if (sortBy === 'frequency'){
  dataset.sort(compare);
  for (var i = 0; i < dataset.length; i++){
    letterNames.push(dataset[i].key)
  }
} else {
    for (var i = 0; i < dataset.length; i++){
    letterNames.push(dataset[i].key)
  }
}

if (format === 'absolute'){
  if (maxVal > 10){
    var tickDelta = Math.ceil(maxVal / 10);
    numTicks = Math.ceil(maxVal / tickDelta);
    scaleRange = tickDelta * numTicks;
  } else {
    numTicks = maxVal;
    scaleRange = maxVal;
  }
} else {
    numTicks = 5
    scaleRange = maxVal / sumLetters
}

if (format === 'relative'){
  for (var i = 0; i < dataset.length; i++){
    dataset[i].value = dataset[i].value / sumLetters;
  }
}


if(format === 'absolute'){
  var precision = ',f';
  var yTitle = 'Absolute Frequency'
  var decimals = 0
} else{
  var precision = ',.2f';
  var yTitle = 'Relative Frequency'
  var decimals = 2
}

var w = window.innerWidth * .8;
var h = window.innerHeight * .6;

var mag = (h - yPadding) / maxVal;

//Create SVG element
document.body.innerHTML += '<div class="div.myDiv"></div>';


var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            ;

var xScale = d3.scale.ordinal()
                  .domain(letterNames)
                  .rangeRoundBands([2 * xPadding, w - xPadding], .1)
                  ;

var yScale = d3.scale.linear()
                  .domain([0, scaleRange])
                  .range([h - yPadding , yPadding])
                  ;

var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .ticks(dataset.length)
                  .orient("bottom")
                  ;

//Create bars of bar chart
svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", function(d) {return xScale(d.key);})
   .attr("y", function(d){return yScale(d.value);})
   .attr("width", xScale.rangeBand())
   .attr("height", function(d){return yScale(0) - yScale(d.value);})
   .attr("fill", "blue")
   ;

// Add labels to bar chart
svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {return d.value.toFixed(decimals);})
   .attr("x", function(d) {return xScale(d.key) + xScale.rangeBand() / 2;})
   .attr("y", function(d) {return yScale(d.value) + 15;})
   .attr("fill", "white")
   .attr("font-family", "Arial")
   .attr("font-size", "16px")
   .attr("text-anchor", "middle")
   ;

svg.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0," + (h - yPadding) + ")")
   .call(xAxis);

var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(numTicks)
                  .tickFormat(d3.format(precision));

//Create Y axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (2*xPadding) + ",0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(h/2))
    .attr("y", -1.4 * xPadding)
    .style("text-anchor", "middle")
    .style("font-size", "18px")
    .text(yTitle)
    .selectAll("line.horizontalGrid")
    .data(yScale.ticks(numTicks)).enter()
    .append("line")
        .attr(
        {
            "class":"horizontalGrid",
            "x1" : xPadding,
            "x2" : w,
            "y1" : function(d){ return yScale(d);},
            "y2" : function(d){ return yScale(d);},
            "fill" : "none",
            "shape-rendering" : "crispEdges",
            "stroke" : "black",
            "stroke-width" : "1px"
        });
