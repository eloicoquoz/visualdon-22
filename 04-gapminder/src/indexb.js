import * as d3 from "d3";
import pop from "../data/population_total.csv";

import dataIncome from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'
import dataLifeExpectancy from '../data/life_expectancy_years.csv'
import dataPopulation from '../data/population_total.csv'

//Exo b with map
const life2021 = dataLifeExpectancy.map((year) => {
	return { country: year["country"], dataLifeExpectancy: year["2021"] };
});
const pop2021 = dataPopulation.map((year) => {
	return { country: year["country"], dataPopulation: year["2021"] };
});
const income2021 = dataIncome.map((year) => {
	return { country: year["country"], dataIncome: year["2021"] };
});

let data = [];
for (let i = 0; i < income2021.length; i++) {
	data.push({
		country: income2021[i].country,
		dataPopulation: cleanData(pop2021[i].dataPopulation),
		dataLifeExpectancy: cleanData(life2021[i].dataLifeExpectancy),
		dataIncome: cleanData(income2021[i].dataIncome),
	});
}

function cleanData(data) {
	if (isNaN(data)) {
		if (data.includes("k")) {
			const n = data.split("k")[0];
			data = Number.parseFloat(n) * 1000;
		} else if (data.includes("M")) {
			const n = data.split("M")[0];
			data = Number.parseFloat(n) * 1000000;
		} else if (data.includes("B")) {
			const n = data.split("B")[0];
			data = Number.parseFloat(n) * 1000000000;
		}
	}
	if (data == "") {
		data = 0;
	}
	return data;
}

const yMax = data.reduce((previous, current) => {
	return current.dataLifeExpectancy > previous.dataLifeExpectancy ? current : previous;
}).dataLifeExpectancy;

const legendWrapper = d3
	.select("body")
	.append("div")
	.style("display", "flex")
	.style("flex-direction", "column")
	.style("align-items", "center")
	.attr("class", "map");
const legend = legendWrapper
	.append("div")
	.attr("class", "legend")
	.style("display", "flex")
	.style("flex-direction", "row");
// set data
const countries = new Map();
data.forEach((d) => {
	countries.set(d.country, d);
});
// create svg
const width2 = 800;
const height2 = 600;
const svgMap = legendWrapper
	.append("svg")
	.attr("width", width2)
	.attr("height", height2);
// Map and projection
const projection = d3
	.geoNaturalEarth1()
	.scale(width2 / 1.3 / Math.PI - 50)
	.translate([width2 / 2, height2 / 2]);
// color interval
const intervalsCount = 9; // max value is 9
const domainInterval = yMax / intervalsCount;
const intervals = [];
for (let i = 0; i <= intervalsCount; i++) {
	if (i != 0) {
		intervals.push(i * domainInterval);
	}
}
// color scale
const colorScale = d3
	.scaleThreshold()
	.domain([...intervals])
	.range(d3.schemeBlues[intervalsCount]);
// Load external data and boot
d3.json(
	"https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
).then(function (topo) {
	// Draw the map
	svgMap
		.append("g")
		.selectAll("path")
		.data(topo.features)
		.join("path")
		.attr("fill", function (d) {
			return colorScale(countries.get(d.properties.name)?.dataLifeExpectancy);
		})
		.attr("d", d3.geoPath().projection(projection))
		.style("stroke", "#fff");
});
// Draw the legend
let i = 0;
intervals.forEach((d) => {
	legend
		.append("div")
		.style("background-color", colorScale(d))
		.style("width", "50px")
		.style("height", "30px")
		.style("display", "flex")
		.style("justify-content", "center")
		.style("align-items", "center")
		.append("text")
		.text(intervals[i].toFixed(1))
		.style("color", "white");
	i++;
});
legend
	.append("div")
	.style("width", "50px")
	.style("background-color", "black")
	.style("height", "30px")
	.style("display", "flex")
	.style("justify-content", "center")
	.style("align-items", "center")
	.append("text")
	.text("no data")
	.style("color", "white");
