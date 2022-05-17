import * as d3 from 'd3'
import dataIncome from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'
import dataLifeExpectancy from '../data/life_expectancy_years.csv'
import dataPopulation from '../data/population_total.csv'

//Exo a with scale
/*
for (var i = 0; i < dataIncome.length; i++) {
        console.log(dataIncome[i].country);
}
for (var i = 0; i < dataLifeExpectancy.length; i++) {
    console.log(dataLifeExpectancy[i].country);
}
*/
for (var i = 0; i < dataPopulation.length; i++) {
    console.log(cleanData(dataPopulation[i]["2021"]));
}

//Scale
const maxGDP = d3.max(dataIncome, function(d) { return cleanData(d[2021]); });
const minGDP = d3.min(dataIncome, function(d) { return cleanData(d[2021]); });
const maxExpectancy = d3.max(dataLifeExpectancy, function(d) { return cleanData(d[2021]); })
const minExpectancy = d3.min(dataLifeExpectancy, function(d){return cleanData(d[2021]); })
const maxPop = d3.max(dataPopulation, function(d) { return cleanData(d[2021]); })
const minPop = d3.min(dataPopulation, function(d){return cleanData(d[2021]); })

console.log(minExpectancy)

const margin = {
        top: 50,
        right: 10,
        bottom: 0,
        left: 100
    },
    width = window.innerWidth * 0.7 - margin.left - margin.right,
    height = window.innerHeight * 0.9 - margin.top - margin.bottom;

const svgGraph = d3.select('body').append('svg').attr('class', 'graph');

svgGraph.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scaleLinear()
    .domain([minGDP, maxGDP])
    .range([10, width]);

svgGraph.append('g')
    .attr("transform", "translate(5," + height + ")")
    .call(d3.axisTop(x).ticks(35).tickSize(10)).selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.6em")
    .attr("dy", "2.4em")
    .attr("transform", "rotate(-65)");

//Pow pour avoir une échelle exponentielle qui se concentre vers 0
const y = d3.scalePow()
    .domain([0, maxExpectancy])
    .range([height, 0])
    .exponent(3);

svgGraph.append('g')
    .call(d3.axisRight(y).ticks(10)); 
    
//Sqrt pour équilibrer les tailles des cercles 
const r = d3.scaleSqrt()
    .domain([minPop, maxPop])
    .range([0, 30]);

//Circles
for (var i = 0; i < dataPopulation.length; i++) {
    svgGraph.append("circle")
    .attr("cx", x(cleanData(dataIncome[i]["2021"]))).attr("cy", y(dataLifeExpectancy[i]["2021"])).attr("r", r(cleanData(dataPopulation[i]["2021"]))).style("fill", "blue");
}

//Clean Data
function cleanData(data) {
    if (isNaN(data)) {
        if (data.includes("k")) {
            const n = data.split("k")[0];
            return Number.parseFloat(n) * 1000;
        } else if (data.includes("M")) {
            const n = data.split("M")[0];
            return Number.parseFloat(n) * 1000000;

        } else if (data.includes("B")) {
            const n = data.split("B")[0];
            return Number.parseFloat(n) * 1000000000;
        }
    }
    return data;
}
