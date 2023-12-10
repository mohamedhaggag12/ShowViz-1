let areaChart;
//load the data in the file broadway.json here and store it in a variable called data
d3.json("data/broadway.json").then(function(data) {
    let barChart = new BarChart("PLAYING_WEEKS", data);
    areaChart = new AreaChart("area-chart", data, "Gross");

        
    });
    
    
