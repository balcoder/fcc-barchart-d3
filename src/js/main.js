// d3 barchart of   US GDP  from 1947 to 2015


// url for the json data
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"

// set up our margins
var margin = {top: 20, right: 20, bottom: 90, left: 80},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
var	parseDate = d3.isoParse

// set up the svg on the page
var svg = d3.select("#container").append("svg")
    .attr("width", width + margin.left + margin.right) //900
    .attr("height", height + margin.top + margin.bottom)  //500
    // .attr("viewBox", "0 0 900 500")
    // .attr("preserveAspectRatio","xMidYMid meet" )
    .attr("id","mychart")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")"); // 80,20


// get the data from the json api url
d3.json(url, function(error, data) {
  if(error) console.log("Error loading json data :" +error);


  // set up the ranges of x and y
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // gridlines in x axis function
  function make_x_gridlines() {
      return d3.axisBottom(x)
          .ticks(5)
  }
  // gridlines in y axis function
  function make_y_gridlines() {
      return d3.axisLeft(y)
          .ticks(5)
  }

  // add the X gridlines
  svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      );

  // add the Y gridlines
  svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      );

  //get the min and max dates for the domain
  var max = d3.max(data.data, (d) => { return new Date(Date.parse(d[0])); });
  var min = d3.min(data.data, (d) => { return new Date(Date.parse(d[0])); });

  // set up the domains
  x.domain([min, max]);
  //  x.domain([new Date(Date.parse("1947-01-01")), new Date(Date.parse("2015-07-01"))]);
  y.domain(d3.extent(data.data, function(d) { return +d[1]; }));

  // create axis
  var xAxis = d3.axisBottom()
      .scale(x)
      .tickFormat(d3.timeFormat("%Y-%m-%d"))
      .ticks(20);

  var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(10);

// add the axis to a group element and append to the svg
svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value");

  // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 60) + ")")
      .style("text-anchor", "middle")
      .text(data.source_name);


  // text label for the y axis
  svg.append("text")
      .attr("id", "ytext")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("GDP in Billions");

  //add the title
  svg.append("text")
      .attr("id","chart-title")
      .attr("x", width/2)
      .attr("y", margin.top +20)
      .attr("text-anchor", "middle")
      .text("USA Gross Domestic Product");


  // Define the div for the tooltip
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

var formatTime = d3.timeFormat("%Y %B");

  // add the bars
  svg.selectAll("bar")
        .data(data.data)
      .enter().append("rect")
        .style("fill", "steelblue")
        .attr("class", "bar")
        .attr("x", function(d) { return x(Date.parse(d[0])); })
        .attr("width", 2)
        .attr("y", function(d) { return y(+d[1]); })
        .attr("height", function(d) { return height - y(+d[1]); })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html("<span id = 'tipgdp'>" + formatTime(Date.parse(d[0])) +"</span>" + "<br/>"  + "GDP: $" +d[1])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

});
