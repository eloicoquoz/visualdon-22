import * as d3 from 'd3'
import dataIncome from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'
import dataLifeExpectancy from '../data/life_expectancy_years.csv'
import dataPopulation from '../data/population_total.csv'

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

//Animation with years
const animationGraph = d3.select('body').append('div').attr('class', 'animationDiv').append('svg').attr('class', 'graph').attr('id', 'animation');
const slider = d3.select('.animationDiv').append('input').attr('id', 'slider').attr('type', 'range').attr('min', '1800').attr('max', '2050').attr('value', '2021').attr('step', '1').attr('orient', 'vertical');
const pickedYear = d3.select('.animationDiv').append('span').attr('id', 'range-value').text('2021');

//Add slider
document.getElementById('slider').addEventListener('input', ()=>{
  const selectedYear = document.getElementById('slider').value;
  console.log(pickedYear)
  document.getElementById('range-value').innerHTML = selectedYear
  getGraph(selectedYear);
});
const yearByDefault = 2021
getGraph(yearByDefault);

//Get data for each year
function getGraph(year) {
  const maxGDPforYear = d3.max(dataIncome, function (d) {
    return cleanData(d[year]);
  });
  const minGDPforYear = d3.min(dataIncome, function (d) {
    return cleanData(d[year]);
  });
  const maxExpectancyforYear = d3.max(dataLifeExpectancy, function (d) {
    return cleanData(d[year]);
  })
  const minExpectancyforYear = d3.min(dataLifeExpectancy, function (d) {
    return cleanData(d[year]);
  })
  const maxPopforYear = d3.max(dataPopulation, function (d) {
    return cleanData(d[year]);
  })
  const minPopforYear = d3.min(dataPopulation, function (d) {
    return cleanData(d[year]);
  })

  document.getElementById('animation').replaceChildren();

  animationGraph.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xAxis = d3.scalePow()
    .domain([minGDPforYear, maxGDPforYear])
    .range([10, width]).exponent(0.5);

  animationGraph.append('g')
    .attr("transform", "translate(5," + height + ")")
    .call(d3.axisTop(xAxis).ticks(35).tickSize(10)).selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.6em")
    .attr("dy", "2.4em")
    .attr("transform", "rotate(-65)");

  //Pow pour avoir une échelle exponentielle qui se concentre vers 0
  const yAxis = d3.scalePow()
    .domain([0, maxExpectancyforYear])
    .range([height, 0])
    .exponent(5);

  animationGraph.append('g')
    .call(d3.axisRight(yAxis).ticks(10));

  //Sqrt pour équilibrer les tailles des cercles 
  const r2 = d3.scaleSqrt()
    .domain([minPopforYear, maxPopforYear])
    .range([5, 35]);
  
  for (let index = 0; index < dataPopulation.length-1; index++) {
    if (dataIncome[index][year] && dataLifeExpectancy[index][year] && dataPopulation[index][year] && dataLifeExpectancy[index][year] > 0) {
      animationGraph.append("circle")
        .attr("cx", xAxis(cleanData(dataIncome[index][year]))).attr("cy", yAxis(dataLifeExpectancy[index][year])).attr("r", r2(cleanData(dataPopulation[index][year]))).attr('data-life', dataLifeExpectancy[index][year]).attr('data-country', dataLifeExpectancy[index]['country']).style("fill", "blue");
    }  
  }
}
