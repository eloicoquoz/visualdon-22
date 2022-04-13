import * as d3 from "d3";
import { csvFormatBody } from "d3";
import income from "../data/income_per_person.csv";
import life from "../data/life_expectancy_years.csv";
import pop from "../data/population_total.csv";
// ==========================================================================
//   0. BASIC GRAPH
// ==========================================================================

const life2021 = life.map((year) => {
	return { country: year["country"], life: year["2021"] };
});
const pop2021 = pop.map((year) => {
	return { country: year["country"], pop: year["2021"] };
});
const income2021 = income.map((year) => {
	return { country: year["country"], income: year["2021"] };
});

let data = [];
for (let i = 0; i < income2021.length; i++) {
	data.push({
		country: income2021[i].country,
		pop: cleanData(pop2021[i].pop),
		life: cleanData(life2021[i].life),
		income: cleanData(income2021[i].income),
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

const xMax = data.reduce((previous, current) => {
	return current.income > previous.income ? current : previous;
}).income;
const yMax = data.reduce((previous, current) => {
	return current.life > previous.life ? current : previous;
}).life;
const rMax = data.reduce((previous, current) => {
	return current.pop > previous.pop ? current : previous;
}).pop;

const svg = d3.select("body").append("svg");
const margin = { top: 20, right: 20, bottom: 20, left: 40 },
	width = 800 - margin.left - margin.right,
	height = 800 - margin.top - margin.bottom;
const newHeight = height + 10;

const x = d3
	.scaleLinear()
	.domain([0, xMax / 100 + xMax])
	.range([0, width]);
const y = d3
	.scaleLinear()
	.domain([0, yMax / 100 + yMax])
	.range([height, 0]);
const r = d3.scaleSqrt().domain([0, rMax]).range([0, 40]);

svg
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.style("margin", "50px");

svg
	.append("g")
	.attr("transform", "translate(20," + newHeight + ")")
	.call(d3.axisBottom(x));

svg
	.append("g")
	.attr("transform", "translate(" + 20 + ",10)")
	.call(d3.axisLeft(y));

svg
	.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", (d) => x(d.income))
	.attr("cy", (d) => y(d.life))
	.attr("r", (d) => r(d.pop))
	.style("fill", "rgba(100, 0, 0, 0.4)")
	.attr("transform", "translate(100, 10)")
	.attr("class", (d) => `countryCircle ${d.country}`);
// ==========================================================================
//   1. Map
// ==========================================================================
const legendWrapper = d3
	.select("body")
	.append("div")
	.style("display", "flex")
	.style("flex-direction", "column")
	.style("align-items", "center")
	.attr("class", "map");
legendWrapper.append("h2").text("Life expectancy in year");
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
	.range(d3.schemeOranges[intervalsCount]);
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
			return colorScale(countries.get(d.properties.name)?.life);
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
