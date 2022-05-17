import { json } from 'd3-fetch'
import * as d3 from 'd3';

//------- Manipuler les données -------
// -------- Add to DOM
d3.select("body").append("div").attr("class","container");
d3.select(".container").append("strong").text("Nombre de posts par utilisateur : ");

// Var
let post_filtered;
let maxBodyLength=0;
let userIdMaxBodyLength;
let tab=[];
let i=0;

// -------- Fetch data JSON
Promise.all([
  json('https://jsonplaceholder.typicode.com/posts'),
  json('https://jsonplaceholder.typicode.com/users')
])
.then(([posts, users]) =>  {
    console.log(posts);
    console.log(users);

// -------- Print user with their number of posts
    users.forEach(usr => {
      post_filtered = posts.filter(post=>post.userId === usr.id)
      //console.log(post_filtered)
      d3.select(".container").append("p").text(usr.name+" : "+post_filtered.length+" posts");
    })


// -------- Most long post
    posts.forEach(post_index => {
      //If for sorting the longest body and save who is the owner for this body
    if (post_index.body.length>maxBodyLength) {
      maxBodyLength = post_index.body.length;
      userIdMaxBodyLength = post_index.userId;
    }
      
    })
    d3.select(".container").append("strong").text("Plus long post : "); 
    d3.select(".container").append("p").text(users[userIdMaxBodyLength].name+", avec un post d'une longueur de "+maxBodyLength+" caractères");
    //console.log("🚀 ~ file: index.js ~ line 42 ~ .then ~ maxBodyLength", maxBodyLength)    
    //console.log("🚀 ~ file: index.js ~ line 45 ~ .then ~ userIdMaxBodyLength", userIdMaxBodyLength)


    //------- Dessiner avec les données -------
    const WIDTH = 500
    const HEIGHT = 500

    d3.select("body").append("div").attr("class","mon-svg");
    d3.select(".mon-svg").append("svg");
    const myDiv2 = d3.select("svg").attr("width", WIDTH).attr("height", HEIGHT)
  
    //Loop that create a tab with number of users as index and number of post as value
    users.forEach(usr => {
      post_filtered = posts.filter(post=>post.userId === usr.id)
      console.log("🚀 ~ file: index.js ~ line 25 ~ .then ~ post_filtered", post_filtered.length)
      tab[i]= post_filtered.length;
      i++;
    })

    //Create chart with precedent tab[]
    const widthRect = 30;
    myDiv2.selectAll("rect")
      .data(tab)
      .enter()
      .append("rect")
      .attr('x', (d,i) => (i*40+50))
      .attr('y', d => 300-d*10)
      .attr('width', widthRect)
      .attr('height', d => d*10)
      .attr('stroke', 'black')
      .attr('fill', '#69a3b2');

      //https://jsfiddle.net/xfksm08b/10/
      var texts = myDiv2.selectAll("text")
	      .data(tab)
	      .enter()
	      .append("text");

      texts
      .attr('x', (d,i) => (i*40+55))
      .attr('y', d => 300+20)
	    .text(function(d){ return d});

});


