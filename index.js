document.addEventListener('DOMContentLoaded', async function () {
    const containerChampion = document.getElementById('containerChampion');


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

            // J'affiche le numéro du Champion
            let p = document.createElement('p');
            p.innerHTML = 'Key: ' + sortedChampions[champion].key;
            div.appendChild(p);

            // J'affiche le nom du Champion
            p = document.createElement('p');
            p.innerHTML = sortedChampions[champion].name;
            div.appendChild(p);

            // Si l'image est cliqué, lancer la fonction fetchPokemonInfo
            img.addEventListener('click', function () {
                fetchPokemonInfo(pokemonId);
            });

            containerChampion.appendChild(div);
        }

    };

    fetchChampionList();

});