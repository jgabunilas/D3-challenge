# D3-challenge: 2014 ACS Results

In this exercise, data from the [2014 American Community Survey](https://www.census.gov/acs/www/data/data-tables-and-tools/data-profiles/2014/) by the U.S. Census Bureau was used to construct an interactive data visualization using the JavaScript [D3 library](https://d3js.org/). The dataset contains multiple facets of information about each state from the 2014 survey, including:
- Poverty rates
- Median citizen age
- Median household income
- Obesity rates
- Percentage of the population that are smokers
- Percentage of the population that do not have healthcare coverage

In plotting these various arrays of data against one-another, the viewer is able to discern potential patterns and relationships between the different conditions.
![plot](/images/image1.PNG)


## About the Visualization
The D3-generated visualization includes the following features:
- Interactive x- and y-axes titles that respond to mouseclicks, transitioning the scale of the axis according to the pertinent data
- Animated data points that transition in response to the specific x- and y-axes data being compared. The datapoints are also responsive to mouseovers, generating a blue stroke for the circle that is moused over
- A responsive tooltip that responds to mouseovers on the graphic datapoints. The tooltip provides more granular information about the datapoint of interest.
![tooltip](/images/image2.png)

## About the Code
The functionality for the visualization is written in JavaScript, with extensive utilization of the D3 library for DOM manipulation. The script functions as follows:
1. The SVG canvas area is established as are the margins that will offset the plot visualization from the sides of the canvas.
2. The CSV file containing the census data is read in using `d3.json`. The numeric data for poverty, age, income, healthcare, obesity, and smoking rates are converted to strings
3. The scaled locations of the datapoints are set by calling the functions `xScale()` and `yScale()`. These functions take as arguments the census data and the selected x- and y-axes (respectively) that have been chosen for display. The returned data are stored as the variables `xLinearScale` and `yLinearScale`
4. The x- and y-axes are drawn based on the scaled axes by the `d3.axisBottom` and `d3.axisLeft` functions, respectively. These functions take as arguments the `xLinearScale` and `yLinearScale` values in (3) above.
5. The axes are appended the SVG chart group (`scatterGroup`) and called.
6. Circles are rendered for each datapoint onto the chart area. Locations of the circles are based on their corresponding datapoint values selected from the census data JSON object. Each circle is labeled with the abbreviation of the state corresponding to that circle.
7. The tooltip information is initialized based on the selected axes to be displayed by calling the function `updatedToolTip()`. In addition to assigning labels to the tooltip, this function also contains an event listener for mouseovers of the circles, creating a stroke for the circle when the mouse is positioned over a given circle.
8. Label groups (`xlabelsGroup` and `ylabelsGroup`) are created for the x- and y-axes, defining which labels will be displayed on the two axes. The positioning of the labels is set based on the dimensions of the chart area. 
9. Event listeners are created for the labels to respond to mouse clicks, changing the formatting of the labels when a new label is clicked. Additionally the following occurs when the event handler is triggered:
    - The linear scaling functions for the x- and y-axes are redefined based on the newly-selected axis
    The axes are re-rendered by calling the functions `renderXAxis()` and `renderYAxis()`. These functions control the transition of the rendered axes by utilizing the `.transition()` method
    - The circles and state abbreviation are updated by calling the functions `renderCircles()` and `renderCircleText()`. These functions control the transitions of the positioning of the circles and abbreviations that are rendered to the screen
    - The tooltip is updated by again calling `updateToolTip()` again, passing in the newly-selected x- or y-axis values and the updated datapoints and abbreviations

 