import * as d3 from 'd3';

// C'est ici que vous allez écrire les premières lignes en d3!

//------- Manipuler les DOM -------
d3.select("body").append("div").attr("class","mon-svg");

const WIDTH = 1000
const HEIGHT = 1000

const circle1 = d3.select(".mon-svg")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .append("circle")
    .attr("cx", "50")
    .attr("cy", "50")
    .attr("r", "40")

    const circle2 = d3.select("svg")
    .append("circle")
    .attr("cx", "150")
    .attr("cy", "150")
    .attr("r", "40")

const circle3 = d3.select("svg")
    .append("circle")
    .attr("cx", "250")
    .attr("cy", "250")
    .attr("r", "40")

//------- Attributs -------
circle2.attr("fill", "#E92528");
circle1.attr("cx", "100")
circle2.attr("cx", "200")

//------- Append -------
d3.select("svg").append("text").text("circle1").attr("x", "80").attr("y", "110")
d3.select("svg").append("text").text("circle2").attr("x", "180").attr("y", "210")
d3.select("svg").append("text").text("circle3").attr("x", "230").attr("y", "310")

//------- Evenements -------
circle3.on("click", () => {
    circle1.attr("cx", "450")
    circle2.attr("cx", "450")
    circle3.attr("cx", "450")
    } )

//------- Données -------
const widthRect = 20;
const data2 = [20, 5, 25, 8, 15];

const myDiv2 = d3.select("svg")
  
myDiv2.selectAll("rect")
  .data(data2)
  .enter()
  .append("rect")
  .attr('x', (d,i) => (i*23+50))
  .attr('y', d => 500-d)
  .attr('width', widthRect)
  .attr('height', d => d)
  .attr('stroke', 'black')
  .attr('fill', '#69a3b2');
