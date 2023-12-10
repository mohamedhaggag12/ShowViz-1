class BarChart {

    constructor(parentElement, data) {
      this.data = data.SeasonDetail;
      this.parentElement = parentElement;
      this.season = "2017-2018";
      this.categories = ["total", "musicals", "plays", "specials"];

      this.initVis();
    }

initVis() {

    let vis = this;
    
    vis.margin = { top: 60, right: 30, bottom: 60, left: 40 };
    vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
    vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");         
            
    vis.x = d3.scaleBand().range([0, vis.width]).padding(0.1);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    vis.updateVis(vis.parentElement);
}

updateVis(category) {

    let vis = this;

    let seasonIndex = vis.data.Season.indexOf(vis.season);

    vis.x.domain(vis.categories.map(category => category.toUpperCase()));
    vis.y.domain([0, vis.data[category]["total"][seasonIndex]]);

    vis.svg.selectAll("*").remove();

    vis.svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + vis.height + ")")
      .call(d3.axisBottom(vis.x));
    
    vis.svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(vis.y));

    vis.categories.forEach((type, index) => {
        let datapoint = vis.data[category][type][seasonIndex];
        vis.svg.selectAll(".bar-" + type)
            .data([datapoint])
            .enter()
            .append("rect")
            .attr("class", "bar bar-" + type)
            .attr("x", () => vis.x(type.toUpperCase())) // Check the x-coordinate scaling
            .attr("width", vis.x.bandwidth())
            .attr("y", () => vis.y(0)) // Start from the baseline
            .attr("height", 0) // Start with zero height
            .transition() // Add a transition
            .duration(1000) // Specify the transition duration in milliseconds
            .attr("y", () => vis.y(datapoint)) // Check the y-coordinate scaling
            .attr("height", () => vis.height - vis.y(datapoint))
        
        vis.svg.append("text")
            .attr("class", "label")
            .attr("x", () => vis.x(type.toUpperCase()) + vis.x.bandwidth() / 2)
            .attr("y", () => vis.y(datapoint) - 5) // Adjust the position based on your preference
            .attr("opacity", 0) // Start with zero opacity
            .transition() // Add a transition
            .duration(1500) // Specify the transition duration in milliseconds
            .attr("y", () => vis.y(datapoint) - 5)
            .attr("opacity", 1) // Transition to full opacity
            .attr("text-anchor", "middle")
            .text(datapoint);

        vis.svg.append("text")
            .attr("class", "legend")
            .attr("x", vis.width/2)
            .attr("y", vis.height + 50) // Adjust the position based on your preference
            .attr("text-anchor", "middle")
            .text(category.toLowerCase() + " " + vis.season);
      });
    }

}
