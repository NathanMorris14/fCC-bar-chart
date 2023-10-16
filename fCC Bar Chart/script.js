let url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest()

let data 
let values

let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    info = data.description
    console.log(values)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()

let drawCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([0, height - (2 * padding)])
    
    xScale = d3.scaleLinear()
                    .domain([0, values.length -1])
                    .range([padding, width - padding])
    
                    let datesArray = values.map((item) => {
        return new Date(item[0])
    })
    
    xAxisScale = d3.scaleTime()
                .domain([d3.min(datesArray), d3.max(datesArray)])
                .range([padding, width - padding])

    yAxisScale =d3.scaleLinear()
                .domain([0, d3.max(values, (item) => {
                    return item[1]
                })])
                .range([height - padding, padding])
    
}

let drawBars = () => {
    
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('width', 'auto')
                    .style('height', 'auto')
                    .style('visibility', 'hidden')

    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / values.length)
        .attr('data-date', (item) => {
            return item[0]
        })
        .attr('data-gdp', (item) => {
            return item[1]
        })
        .attr('height', (item) => {
            return heightScale(item[1])
        })
        .attr('x', (item, index) => {
            return xScale(index)
        })
        .attr('y', (item) => {
            return (height - padding) - heightScale(item[1])
        })
        .attr("fill","navy")
        .attr("stroke","navy")
        .on("mouseover", function(item) {
                d3.select(this)
                .attr("fill", "cyan")
                .attr("stroke","cyan");
                d3.select("#tooltip")
                  .style("left", d3.event.pageX+10 + "px")
                  .style("top", d3.event.pageY-60 + "px")
                  
                  
                   //tooltip.text(data)
                //   document.querySelector('#tooltip').setAttribute('data-date', item[0])
                d3.select("#tooltip")
                  .style('visibility', 'visible')
                  .text('Date: ' + item[0] + 'GDP (Billion $): ' + item[1])
                    document.querySelector('#tooltip').setAttribute('data-date', item[0]);
                  
                  
              })
              .on("mouseout", function(d) {
                d3.select(this)
                .attr("fill", "navy")
                .attr("stroke","navy");
                d3.select("#tooltip")
                  .style('visibility', 'hidden');
              });
        
    }


let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale)
    svg.append('g')
       .call(xAxis)
       .attr('id','x-axis')
       .attr('transform', 'translate(0, ' + (height - padding) + ')' )
    let yAxis = d3.axisLeft(yAxisScale)
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + (padding) + ', 0)')


}   


// var dataURL="https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
//     dataset,
//     desc;
// $.getJSON(dataURL, function(d){
//   dataset=d["data"];
//   desc=d["description"];
//   makePlot(dataset,desc);
// });

// function makePlot(dataArr,desc){
//   var w = 1000,
//       h = 600,
//       plotPadding = 40,
//       svg = d3.select("#container")
//               .append("svg")
//               .attr("width", w)
//               .attr("height", h),
//       data=dataSelect(dataArr,1),
//       dataLabels=dataSelect(dataArr,0),
//       scaleY = d3.scaleLinear()
            // .domain([d3.min(data), d3.max(data)])
            // .range([h-2*plotPadding,0]).nice(),
//       //xScale = d3.scaleBand().domain([0,data.length]).range([0,Math.floor(w / data.length)*data.length]),
//       scaleX = d3.scaleTime().domain([new Date(dataLabels[0]),new Date(dataLabels[dataLabels.length-1])]).rangeRound([0,data.length* Math.floor(w / data.length)]);
//       //xScale = d3.scaleTime().domain(["1947-01-01","2015-07-01"]).range([0,data.length* Math.floor(w / data.length)]);
//       //xScale.tickFormat(10,"%Y");
//       var xAxis = d3.axisBottom(scaleX).ticks(10),
//           yAxis = d3.axisLeft(scaleY);
  
//     svg.selectAll("rect").data(data).enter().append("rect")
//   .attr("x", function(d, i) {return plotPadding + i * (Math.floor(w / data.length));})
//   .attr("y", function(d){return scaleY(d)+plotPadding;})
//   .attr("width", Math.floor(w / data.length))
//   .attr("height", function(d) {return scaleY(0)-scaleY(d);})
//   .attr("fill","blue")
//   .attr("stroke","blue")
//   .on("mouseover", function(d,i) {
//     d3.select(this)
//     .attr("fill", "cyan")
//     .attr("stroke","cyan");
//     d3.select("#tooltip")
//       .style("left", d3.event.pageX+10 + "px")
//       .style("top", d3.event.pageY-60 + "px")
//       .select("#value")
//       .text(d);
//     d3.select("#date")
//       .text(labelTransform(dataLabels[i]));
//     d3.select("#tooltip").classed("hidden", false);
//   })
//   .on("mouseout", function(d) {
//     d3.select(this)
//     .attr("fill", "blue")
//     .attr("stroke","blue");
//     d3.select("#tooltip").classed("hidden", true);
//   });
//   svg.append("g").attr("class", "axis")
//   .attr("transform", "translate(" + plotPadding + "," + (h-plotPadding) + ")")
//   .call(xAxis);
//   svg.append("g").attr("class", "axis")
//   .attr("transform", "translate(" + plotPadding + "," + (plotPadding) + ")")
//   .call(yAxis);
//   svg.append("text")
//   .attr("text-anchor", "middle")
//   .attr("transform", "translate("+ (plotPadding+20) +","+(3*plotPadding+20)+")rotate(-90)")  
//   .text("Gross Domestic Product, USA");
//   d3.select("#description").text(desc);
// } 

// function dataSelect(arr,el){
//   var arrNew =[];
//   for(var i=0; i<arr.length;i++){
//     arrNew.push(arr[i][el]);
//   }
//   return arrNew;
// }

// function labelTransform(str){
//   var strArr=str.split("-"),
//       month="";
//   switch(strArr[1]){
//     case "01":
//       month="January";
//       break;
//     case "04":
//       month="April";
//       break;
//     case "07":
//       month="July";
//       break;
//     case "10":
//       month="October"
//       break;
//     default:
//       break;
//                   }
//   return strArr[0]+" - "+month;
// }