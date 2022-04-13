
## Installation
* Rentrez dans le dossier *05-web-scraping* ``cd 05-web-scraping/``
* Installez les packages nécessaires et qui sont dans le package.json ```npm install```
* Démarrez le serveur ```npm start```

:rocket: Vous devriez avoir accès à votre serveur local sur [localhost:8080](http:localhost:8080) :rocket:

Comme toutes les semaines, le fichier html se trouve dans ```public/index.html``` et l'exercice se déroulera dans le fichier ```src/ìndex.js```, où vous allez mettre en pratique le web scraping.  

## Screenshot
Faire une capture d'écran de la page des cantons [Wikipédia](https://fr.wikipedia.org/wiki/Canton_(Suisse)#Donn%C3%A9es_cantonales)

>L'utilisation de `puppeteer` est recommandée


## Récupération des données
>Pour les exercices suivants, vous pouvez choisir n'importe quelle libraries que l'on a vues en cours ! 


### Webscraper Wikipedia
Imprimez dans la console tous les noms de cantons et les populations respectives, à partir de la page Wikipedia citée ci-dessus. 

### Webscraper un site e-commerce
Allez à ce [lien](https://www.webscraper.io/test-sites/e-commerce/allinone/computers/laptops) et construisez la liste d'objets suivante : 
```js
[
  {
    "produit": "Asus VivoBook X441NA-GA190"
    "prix": "$295.99",
    "etoiles": 3,
  },
  {
    "produit": "Prestigio SmartBook 133S Dark Grey"
    "prix": "$299.00",
    "etoiles": 2,
  },
  ...
]
```

