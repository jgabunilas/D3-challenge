// @TODO: YOUR CODE HERE!
// D3 Challenge - Bonus Assignment
// Written by Jason Gabunilas

// Initialize the variables for the svg canvas width, height, and margins

var svgWidth = 700;
var svgHeight = 500;

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

// Move the x- and y- linear scale functions out of the data call and into their own separate functions that can be called later. Add "padding" to both axes so that datapoints are not plotted exactly on the axis lines.
function xScale(censusData, selectedXAxis) {

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
                .domain([d3.min(censusData, datum => datum[selectedYAxis]) * 0.85, d3.max(censusData, function(datum) {
                        // console.log(datum.healthcare)
                        return datum[selectedYAxis] * 1.10
                })])
                .range([height, 0]);
        return yLinearScale
}

// These functions will update the x- and y-axis upon clicking of the axis labels
function renderXAxis(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
      
        xAxis.transition()
                .duration(750)
                .call(bottomAxis);
      
        return xAxis;
}

function renderYAxis(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
      
        yAxis.transition()
                .duration(750)
                .call(leftAxis);
      
        return yAxis;
}


// Function updates the circles group with a transition to new circles. This function must handle both x- and y-axes.
function renderCircles(circlesGroup, newXScale, newYScale, selectedXAxis, selectedYAxis) {

        circlesGroup.transition()
          .duration(750)
          .attr("cx", d => newXScale(d[selectedXAxis]))
          .attr("cy", d => newYScale(d[selectedYAxis]))
        return circlesGroup;
}

// The circle text must also be transitioned when a new axis is selected. Be sure to preserve the offsets that were incorporated 
function renderCircleText(circlesText, newXScale, newYScale, selectedXAxis, selectedYAxis) {
        circlesText.transition()
                .duration(750)
                .attr("x", d => newXScale(d[selectedXAxis]) - 6)
                .attr("y", d => newYScale(d[selectedYAxis]) + 4)
        return circlesText;  
}

// Create an updateToolTip function that changes the values reported by the ToolTip when a new axis is chosen. This function must account for both axes
function updateToolTip(selectedXAxis, selectedYAxis, circlesGroup, circlesText) {

        // Handle tooltip labels pertaining to the x-axis
        var xlabel;
        if (selectedXAxis === "poverty") {
                xlabel = "Poverty(%):";
        }
        else if (selectedXAxis === "age") {
                xlabel = "Age(yrs):";
        }
        else if (selectedXAxis === "income") {
                xlabel = "Income($):"
        }

        // Handle the tooltip labels pertaining to the y-axis
        var ylabel;
        if (selectedYAxis === "obesity") {
                ylabel = "Obesity(%):";
        }
        else if (selectedYAxis === "smokes") {
                ylabel = "Smokers(%):";
        }
        else if (selectedYAxis === "healthcare") {
                ylabel = "Without Healthcare(%):"
        }
      
        var toolTip = d3.tip()
        // Ensure the class of the tooltip matches the d3Style stylesheet
          .attr("class", "d3-tip")
          .offset([-5, 0])
          .html(function(d) {
                return (`${d.state}<br>${xlabel} ${d[selectedXAxis]}<br>${ylabel} ${d[selectedYAxis]}`);
          });
      
        circlesGroup.call(toolTip);
      
        // We want to have to data display regardless of whether we are mousing over the circle or the state abbreviation text. Thus, we must create two mousover handlers, one for the circle and one for the circle text.
        circlesGroup.on("mouseover", function(data) {
                toolTip.show(data);
                // This event listener fills in a border when the circle is hovered over
                d3.select(this)
                        .attr('stroke', '#3333ff')
                        .attr('stroke-width', '4');
        })
                .on("mouseout", function(data, index) {
                toolTip.hide(data);
                // likewise, this event listener removes the border when the circle is no longer hovered over
                d3.select(this).attr('stroke', null)
                });
  
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
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // append a new SVG group to scatterGroup to contain each axis, transform based on the chart dimensions, and call the x- and y-axis functions
        var xAxis = scatterGroup.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        var yAxis = scatterGroup.append('g')
        .call(leftAxis);

        // Create a selection for the scatterGroup and save as a new variable circlesData. This variable will be used to add circles and text to the scatterplot
        var circlesData = scatterGroup.selectAll()
                // bind the data to the group
                .data(censusData)
                // Create holding slots for unbound data 
                .enter()

        // Set the text within the circles by selecting the circlesData group and appending text elements for each unbound data point. By rendering the text before the actual circles, the circles will be placed "in front" of the text, ensuring that mousing over will always select the circle. We can ensure that the text will still be visibe by lowering the opacity for the cicles (see below)
        var circlesText = circlesData.append('text')
                .attr('x', datum => xLinearScale(datum[selectedXAxis]) - 6)
                .attr('y', datum => yLinearScale(datum[selectedYAxis]) + 4)
                .attr('fill', 'black')
                .attr('font-size', '9px')
                .attr('font-weight', 'bold')
                .text(datum => datum.abbr)

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
                .attr('opacity', '0.4')
                // .attr("stroke", "#3333ff")


        // Create label groups for multiple x-axis and y-axis labels

        // x-axis labels group
        var xlabelsGroup = scatterGroup.append('g')
        .attr("transform", `translate(${(width / 2)}, ${height + margin.top})`)

        // Create variables for each x-axis category
        var povertyLabel = xlabelsGroup.append('text')
                .attr("x", 0)
                .attr("y", 20)
                .attr("value", "poverty") // value to grab for event listener
                .classed("active", true)
                .text("% In Poverty");

        var ageLabel = xlabelsGroup.append('text')
                .attr("x", 0)
                .attr("y", 40)
                .attr("value", "age") // value to grab for event listener upon click
                .classed("inactive", true)
                .text("Median Age");
        var incomeLabel = xlabelsGroup.append('text')
                .attr("x", 0)
                .attr("y", 60)
                .attr("value", "income") // value to grab for event listener upon click
                .classed("inactive", true)
                .text("Median Household Income");

        // y-axis labels group
        var ylabelsGroup = scatterGroup.append('g')
        .attr("transform", "rotate(-90)")

        var obesityLabel = ylabelsGroup.append('text')
        .attr("x", -height/2)
        .attr("y", -80)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("% Obese");

        var smokerLabel = ylabelsGroup.append('text')
                .attr("x", -height/2)
                .attr("y", -60)
                .attr("value", "smokes") // value to grab for event listener
                .classed("inactive", true)
                .text("% Smokers");
        
        var healthcareLabel = ylabelsGroup.append('text')
                .attr("x", -height/2)
                .attr("y", -40)
                .attr("value", "healthcare") // value to grab for event listener
                .classed("active", true)
                .text("% Without Healthcare");

        // call updateToolTip to update the tooltip information
        var circlesGroup = updateToolTip(selectedXAxis, selectedYAxis, circlesGroup, circlesText)

        // Create the x-axis labels event listener, which will fire off whenever we click on a different axis label
        xlabelsGroup.selectAll("text")
                .on("click", function() {
                // retrieve the value of the axis label selection
                var value = d3.select(this).attr("value");
                console.log(`selected x-axis: ${value}`)
                // Check whether the selected axis label is the same as the current selectedXAxis
                if (value !== selectedXAxis) {
                        
                        // If it is not, then replace the value
                        selectedXAxis = value;
        
       
                        // functions here found above csv import
                        // updates x scale for new data
                        xLinearScale = xScale(censusData, selectedXAxis);
                
                        // updates x axis with transition
                        xAxis = renderXAxis(xLinearScale, xAxis);
                
                        // updates circles with new x values
                        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, selectedXAxis, selectedYAxis);

                        // Update abbreviation text location with new x values
                        circlesText = renderCircleText(circlesText, xLinearScale, yLinearScale, selectedXAxis, selectedYAxis)
                
                        // updates tooltips with new info
                        circlesGroup = updateToolTip(selectedXAxis, selectedYAxis, circlesGroup, circlesText);
                
                        // changes classes to change bold text for x-axis labels
                        if (selectedXAxis === "age") {
                        ageLabel
                                .classed("active", true)
                                .classed("inactive", false);
                        povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        incomeLabel
                                .classed("active", false)
                                .classed("inactive", true)
                        }
                        else if (selectedXAxis === "income") {
                        ageLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        incomeLabel
                                .classed("active", true)
                                .classed("inactive", false)
                        }
                        else {
                        ageLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        povertyLabel
                                .classed("active", true)
                                .classed("inactive", false);
                        incomeLabel
                                .classed("active", false)
                                .classed("inactive", true)
                        }
                }
        });

        // Create the y-axis labels event listener, which will fire off whenever we click on a different y-axis label

        ylabelsGroup.selectAll("text")
                .on("click", function() {
                // retrieve the value of the axis label selection
                var value = d3.select(this).attr("value");
                console.log(value)
                // Check whether the selected axis label is the same as the current selectedXAxis
                if (value !== selectedYAxis) {
                        console.log(`Selected y-axis: ${value}`)
                        // If it is not, then replace the value
                        selectedYAxis = value;


                        // functions here found above csv import
                        // updates y scale for new data
                        yLinearScale = yScale(censusData, selectedYAxis);
                
                        // updates y axis with transition
                        yAxis = renderYAxis(yLinearScale, yAxis);
                
                        // updates circles with new y values
                        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, selectedXAxis, selectedYAxis);

                        // Update state abbreviation text location with new y values
                        circlesText = renderCircleText(circlesText, xLinearScale, yLinearScale, selectedXAxis, selectedYAxis)
                
                        // updates tooltips with new info
                        circlesGroup = updateToolTip(selectedXAxis, selectedYAxis, circlesGroup, circlesText);
                
                        // changes classes to change bold text for the y-axis labels
                        if (selectedYAxis === "obesity") {
                                obesityLabel
                                        .classed("active", true)
                                        .classed("inactive", false);
                                smokerLabel
                                        .classed("active", false)
                                        .classed("inactive", true);
                                healthcareLabel
                                        .classed("active", false)
                                        .classed("inactive", true)
                        }
                        else if (selectedYAxis === "smokes") {
                                obesityLabel
                                        .classed("active", false)
                                        .classed("inactive", true);
                                smokerLabel
                                        .classed("active", true)
                                        .classed("inactive", false);
                                healthcareLabel
                                        .classed("active", false)
                                        .classed("inactive", true)
                        }
                        else {
                                obesityLabel
                                        .classed("active", false)
                                        .classed("inactive", true);
                                smokerLabel
                                        .classed("active", false)
                                        .classed("inactive", true);
                                healthcareLabel
                                        .classed("active", true)
                                        .classed("inactive", false)
                        }
                }
        });

})

