document.addEventListener('DOMContentLoaded', async function () {
    const containerChampion = document.getElementById('containerChampion');
    let championid;
    //Le container de l'assets du champion de la section "right"
    let championAssets = document.getElementById('championAssets');
    //le container des informations (lore et compétence ) de la section "right"
    let containerInfo = document.getElementById('containerInfo');

    function fetch(url, method, fun) {
        //Initialisation de XHR
        const request = new XMLHttpRequest();
        request.addEventListener('load', fun);
        //Spécifier le type d'appelle [ GET, POST, PUT, PATCH, DELETE ] et l'URL
        request.open(method, url);
        //Spécification que je veux du JSON en type de retour
        request.setRequestHeader('Accept', 'application/json');
        //Permet d'envoyer la requêtes
        request.send();
    }


    function fetchChampionList() {
        fetch(`http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json`, 'GET', printChampion);
    }

    function printChampion() {
        let result = JSON.parse(this.responseText);
        console.log(result);
        let championList = result.data;
        console.log(championList);

        // on trie les champions par clé (key)
        const sortedChampions = Object.values(championList).sort((a, b) => {
            let championIdA = parseInt(a.key);
            let championIdB = parseInt(b.key);
            return championIdA - championIdB;
        });

        console.log(sortedChampions);

        // Je boucle sur le tableau de résultats
        for (const champion in sortedChampions) {
            // Je crée un élément <div></div> pour le Champion
            let div = document.createElement('div');

            // J'affiche l'image du Champion
            let img = document.createElement('img');
            img.src = `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${sortedChampions[champion].image.full}`;
            div.appendChild(img);

            // J'affiche le nom du Champion
            p = document.createElement('p');
            p.innerHTML = sortedChampions[champion].name;
            div.appendChild(p);

            // Si l'image est cliqué, lancer la fonction fetchPokemonInfo
            img.addEventListener('click', function () {
                //vérifier si il y a des espaces et les supprimer
                championid = sortedChampions[champion].id;
                fetchChampionInfo();
            });

            containerChampion.appendChild(div);
        }

    };

    fetchChampionList();

    function fetchChampionInfo() {
        fetch(`http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion/${championid}.json`, 'GET', printChampionInfo);
    };

    //function pour afficher les informations du champion choisis
    function printChampionInfo() {
        let result = JSON.parse(this.responseText);
        let championInfo = result.data[championid];
        console.log(championInfo);

        //Je vide la div championAssets
        championAssets.innerHTML = "";
        //Je vide la div containerInfo
        containerInfo.innerHTML = "";
        // J'affiche l'image du Champion dans la div championAssets
        let img = document.createElement('img');
        img.src = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championid}_0.jpg`;
        championAssets.appendChild(img);

        // // Je crée un élément <div></div> pour le Champion
        //     let div = document.createElement('div');

        // J'affiche le nom du Champion
        let h3 = document.createElement('h3');
        h3.innerHTML = championInfo.name;
        containerInfo.appendChild(h3);

        //Balise <a> pour afficher le lore completement
        let a = document.createElement('a');
        a.innerHTML = 'voir plus'

        // J'affiche le lore du Champion
        let p = document.createElement('p');
        p.innerHTML = championInfo.blurb;
        containerInfo.appendChild(p);
        //Ajouter le 'voir plus ' à la fin du p
        p.appendChild(a);

        // Si le voir plus est cliqué, afficher le lore en entier
        a.addEventListener('click', function () {
            //vérifier si il y a des espaces et les supprimer
            p.innerHTML = championInfo.lore;
        });

        //     containerChampion.appendChild(div);


    }

});