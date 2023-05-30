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

        // Je boucle sur le tableau de résultats
        for (const champion in championList) {
            const championValues = championList[champion];
            console.log(championValues);

            // Je crée un élément <div></div> pour le Champion
            let div = document.createElement('div');

            // J'affiche l'image du Champion
            let img = document.createElement('img');
            img.src = `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${championValues.image.full}`;
            div.appendChild(img);

            // J'affiche le numéro du Champion
            let p = document.createElement('p');
            p.innerHTML = 'Key: ' + championValues.key;
            div.appendChild(p);

            // J'affiche le nom du Champion
            p = document.createElement('p');
            p.innerHTML = championValues.name;
            div.appendChild(p);

            containerChampion.appendChild(div);
        }





        // // Si l'image est cliqué, lancer la fonction fetchPokemonInfo
        // img.addEventListener('click', function () {
        //     fetchPokemonInfo(pokemonId);
        // });

        // 
        // for (let i = 0; i < championList.length; i++) {
        //     // Je crée mon <li></li>
        //     let li = document.createElement('li');
        //     // J'affiche le numéro et le nom du pokemon
        //     li.innerHTML = pokemonId + " : " + championList[i].name;
        //     //Si le li est cliqué , lancer la fonction fetchPokemonDetails
        //     li.addEventListener('click', function () {
        //         fetchPokemonDetails(pokemonId);
        //     });
        //     // Je pousse mon li dans mon Ul qui a pour id 'championList'
        //    (li);
        // };

    };

    fetchChampionList();

});