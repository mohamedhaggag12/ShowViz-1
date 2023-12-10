
class AreaChart {

    constructor(parentElement, data, index) {
        this.parentElement = parentElement;
        this.data = data.SeasonsOverview;
        this.index = index;
        this.selectedYear = null;

        this.initVis();

    }

    getSeason() {
        return this.selectedYear;
    }


initVis() {

    let vis = this;

    vis.margin = {top: 20, right: 10, bottom: 20, left: 40};

    vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
    vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.left - vis.margin.right;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        console.log(vis.data.Season);
        
    // Scales and axes
    vis.x = d3.scaleBand()
        .domain(vis.data.Season)
        .range([0, vis.width])
    

    vis.y = d3.scaleLinear().range([this.height, 0]);


    vis.xAxis = d3.axisBottom()
        .scale(vis.x)

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "y-axis axis")
        .call(vis.yAxis);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis);

    // area generator
    vis.area = d3.area()
        .x((d, i) => vis.x(vis.data.Season[i]))
        .y0(vis.height)
        .y1(d => vis.y(d));

    // Append a path for the area function, so that it is later behind the brush overlay
    vis.Path = vis.svg.append("path")
        .attr("class", "area");

    // Update the visualization
    vis.updateVis(vis.index);
}

updateVis(selectedData) {

    let vis = this;

    //check if the index is capacity then the domain is [0,100] otherwise it is [0, max]
    if (selectedData == "Capacity") {
        vis.y.domain([0, 100]);
    } else {
    vis.y.domain([0, d3.max(this.data[selectedData])]);
    }

    vis.svg.select('.y-axis')
        .call(vis.yAxis);


    vis.Path = vis.svg.selectAll('path')
        .data([vis.data[selectedData]]);

    vis.Path.enter()
        .append('path')
        .merge(vis.Path)
        .transition()
        .attr('d', vis.area)
        .attr('fill', 'steelblue')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        

    vis.circles = this.svg.selectAll('circle')
        .data(this.data[selectedData]);
    
    vis.circles.enter()
        .append('circle')
        .merge(vis.circles)
        .transition()
        .attr('cx', (d, i) => vis.x(vis.data.Season[i]))
        .attr('cy', d => vis.y(d))
        .attr('r', 5)
        .attr('fill', 'red')        

        

    // Remove extra circles if any
    vis.circles.exit().remove();
}

getSelectedOption() {
    var selectElement = document.getElementById("dataFilter");
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    var selectedValue = selectedOption.value;
    return selectedValue;
  }
  
}