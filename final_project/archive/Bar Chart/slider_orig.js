

  formatDate = d3.time.format("%Y");

  // parameters
  var sliderMargin = {
      top: 0,
      right: 50,
      bottom: 0,
      left: 50
    },
    sliderWidth = 960 - sliderMargin.left - sliderMargin.right,
    sliderHeight = 120 - sliderMargin.bottom - sliderMargin.top;


  // scale function
  var timeScale = d3.time.scale()
    .domain([new Date('1950'), new Date('2014')])
    .range([0, width])
    .clamp(true);


  // initial value
  var startValue = timeScale(new Date('1950'));
  startingValue = new Date('1950');

  //////////

  // defines brush
  var brush = d3.svg.brush()
    .x(timeScale)
    .extent([startingValue, startingValue])
    .on("brush", brushed);

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    // classic transform to position g
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var sliderAxis = svg.append("g")
    .attr("class", "sliderAxis")
    // .attr("class", "x axis")
  // put in middle of screen
  .attr("transform", "translate(0," + height / 2 + ")")
  // inroduce axis
  .call(d3.svg.axis()
    .scale(timeScale)
    .orient("bottom")
    .tickFormat(function(d) {
      return formatDate(d);
    })
    .tickSize(0)
    .tickPadding(12)
    .tickValues([timeScale.domain()[0], timeScale.domain()[1]]))
    .select(".domain")
    .select(function() {
      console.log(this);
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "halo");

  var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

  slider.selectAll(".extent,.resize")
    .remove();

  slider.select(".background")
    .attr("height", height);

  var handle = slider.append("g")
    .attr("class", "handle")

  handle.append("path")
    .attr("transform", "translate(0," + height / 2 + ")")
    .attr("d", "M 0 -10 V 10")

  handle.append('text')
    .text(startingValue)
    .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");

  slider
    .call(brush.event)

  function brushed() {
    var value = brush.extent()[0];

    if (d3.event.sourceEvent) { // not a programmatic event
      value = timeScale.invert(d3.mouse(this)[0]);
      brush.extent([value, value]);
    }

    handle.attr("transform", "translate(" + timeScale(value) + ",0)");
    handle.select('text').text(formatDate(value));
  };


