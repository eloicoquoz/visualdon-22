import { JSDOM } from 'jsdom';
import fetch from "isomorphic-fetch"
import puppeteer from "puppeteer"
 
// --------------Faire une capture d'écran de la page des cantons Wikipédia-----------------------
(async () => {
// Lancement browser
  const browser = await puppeteer.launch();
//Ouvrir une nouvelle page
  const page = await browser.newPage();
//Aller au lien wikipedia
  await page.goto('https://fr.wikipedia.org/wiki/Canton_(Suisse)#Donn%C3%A9es_cantonales');
 
//Faire un screenshot
await page.screenshot({ path: 'cantonsSuisseFullPage.png', fullPage: true });
 
// Fermer les browser
await browser.close();
})();


// --------------Récupération des données - Wikipédia-----------------------
(async () => {
    const response = await fetch('https://fr.wikipedia.org/wiki/Canton_(Suisse)#Donn%C3%A9es_cantonales');
    const content = await response.text();
    const domWikipedia = new JSDOM(content);
    const cantons = domWikipedia.window.document.querySelectorAll("table.wikitable tr");

    for (const canton of cantons) {
        try {
            const nomCanton = canton.querySelector("td a").textContent;
            const populationCanton = canton.querySelector("td bdi").textContent;
            console.log(populationCanton);
            let populationNumber = populationCanton.substring(1, populationCanton.length - 1);
            console.log(nomCanton + " : " + populationNumber + " habitants");

        } catch (error) {
            //console.log("Erreur : " + error);
        }
    }
})();


// --------------Récupération des données - e-commerce -----------------------
(async () => {
    const response = await fetch('https://www.webscraper.io/test-sites/e-commerce/allinone/computers/laptops');
    const content = await response.text();
    const domEcom = new JSDOM(content);
    const listeProduits = domEcom.window.document.querySelectorAll("div.thumbnail ");
    for (const produit of listeProduits) {
        try {
            const objet = {
                "produit" : produit.querySelector("div.caption h4 a").textContent,
                "prix" : produit.querySelector("div.caption h4").textContent,
                "etoiles" : produit.querySelectorAll("div.ratings p span").length
            }
            console.log(objet);
        } catch (error) {
            //console.log("Erreur : " + error);
        }   
    }
})()