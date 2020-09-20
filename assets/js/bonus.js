// @TODO: YOUR CODE HERE!
// D3 Challenge
// Written by Jason Gabunilas

// Initialize the variables for the svg canvas width, height, and margins

var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Set the width and height of the actual chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select the scatterplot element, append and SVG group that will contain the chart, and modify the width and height of the chart based on the attributes that we set above
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//   Append an SVG group ("g") to the above selection and assign as a new variable called "scatterGroup". Translate the location based on margin attributes assigned in the SVG variable
var scatterGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Chose the parameters to initialize the chart to. You can choose multiple axes for x- and y-
var selectedXAxis = "poverty";
var selectedYAxis = "healthcare";

// Move the x- and y- linear scale functions out of the data call and into their own separate functions that can be called later
function xScale(censusData, selectedXAxis) {
        // console.log('function call is working')
        // console.log(selectedXAxis)
        // console.log(censusData)

        var xLinearScale = d3.scaleLinear()
                .domain([d3.min(censusData, datum => datum[selectedXAxis]) * 0.95,
                d3.max(censusData, datum => datum[selectedXAxis]) * 1.05
                ])
                .range([0, width]);
        // console.log(xLinearScale)
        return xLinearScale;
}

function yScale(censusData, selectedYAxis) {
        var yLinearScale = d3.scaleLinear()
                .domain([0, d3.max(censusData, function(datum) {
                        // console.log(datum.healthcare)
                        return datum[selectedYAxis]
                })])
                .range([height, 0]);
        return yLinearScale
}

// These functions will update the x- and y-axis upon clicking of the axis labels
function renderXAxis(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
      
        xAxis.transition()
          .duration(1000)
          .call(bottomAxis);
      
        return xAxis;
}

function renderYAxis(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
      
        xAxis.transition()
          .duration(1000)
          .call(leftAxis);
      
        return yAxis;
}

// Function updates the circles group with a transition to new circles. This function must handle both x- and y-axes
function renderCircles(circlesGroup, newXScale, newYScale, selectedXAxis, selectedYAxis) {

        circlesGroup.transition()
          .duration(1000)
          .attr("cx", d => newXScale(d.selectedXAxis))
          .attr("cy", d => newYScale(d.selectedYAxis))
        return circlesGroup;
}


// Import the data from the CSV file
d3.csv('/assets/data/data.csv').then(function(censusData) {
        // // Confirm successful import
        console.log(censusData)
        // Parse the data for each row, converting all applicable numeric values to strings
        censusData.forEach(function(datum) {
                datum.poverty = +datum.poverty;
                datum.age = +datum.age;
                datum.income = +datum.income;
                datum.healthcare = +datum.healthcare;
                datum.obesity = +datum.obesity;
                datum.smokes = +datum.smokes;
        });

        // Call the xScale function to calculate and return the xLinearScale
        var xLinearScale = xScale(censusData, selectedXAxis)

        // Call the yScale function to calculate and return the yLinearScale
        var yLinearScale = yScale(censusData, selectedYAxis)

        // Create the initial axes (they will be called below)
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale).ticks(8)

        // append a new SVG group to scatterGroup to contain each axis, transform based on the chart dimensions, and call the x- and y-axis functions
        scatterGroup.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

        scatterGroup.append('g')
        .call(yAxis);

        // Create a selection for the scatterGroup and save as a new variable circlesData. This variable will be used to add circles and text to the scatterplot
        var circlesData = scatterGroup.selectAll()
        // bind the data to the group
        .data(censusData)
        // Create holding slots for unbound data 
        .enter()

        // Create a circlesGroup variable by selecting the circlesData group and appending circle elements for each unbound data point
        // Append a new circle element for each unbound data point  
        var circlesGroup = circlesData.append("circle")
        // set the centers of the circles
        .attr('cx', datum => xLinearScale(datum[selectedXAxis]))
        .attr('cy', datum => yLinearScale(datum[selectedYAxis]))
        // set the radii of the circles
        .attr('r', 10)
        // Set the circle appearance
        .attr('fill', '#ff99ff')

        // var circlesGroup = scatterGroup.selectAll()
        //         .data(censusData)
        //         .enter()
        //         .append("circle")
        //         .attr("cx", d => xLinearScale(d[selectedXAxis]))
        //         .attr("cy", d => yLinearScale(d[selectedYAxis]))
        //         .attr("r", 20)
        //         .attr("fill", "pink")
        //         .attr("opacity", ".5");

        // Set the text within the circles by selecting the circlesData group and appending text elements for each unbound data point
        var circlesText = circlesData.append('text')
        .attr('x', datum => xLinearScale(datum[selectedXAxis]) - 6)
        .attr('y', datum => yLinearScale(datum[selectedYAxis]) + 4)
        .attr('fill', 'black')
        .attr('font-size', '10px')
        .text(datum => datum.abbr)

        // Create the axis labels
        // y-axis
        scatterGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (height / 2) - 70)
                .attr("dy", "1em")
                .attr("class", "axisText")
                .attr("font-size", "18px")
                .attr("font-family", "sans-serif")
                .text("% Without Healthcare");
        // x-axis
        scatterGroup.append("text")
                .attr("transform", `translate(${(width / 2) - 55}, ${height + margin.top + 30})`)
                .attr("class", "axisText")
                .attr("font-family", "sans-serif")
                .text("% In Poverty");


})