//Liste des noms des stats pour le graph
let statsList = [];
//Liste des valeurs des stats pour le graph
let statsValues = [];
document.addEventListener('DOMContentLoaded', async function () {
    const containerChampion = document.getElementById('containerChampion');
    let championid = 'Annie';
    //Le container de l'assets du champion de la section "right"
    let championAssets = document.getElementById('championAssets');
    //le container des informations (lore et compétence ) de la section "right"
    let containerInfo = document.getElementById('containerInfo');
    //div contenant les 5 spell du champion choisis
    let containerSpell = document.getElementById('containerSpell');
    //style des bordure des spells
    let borderStyle = 'solid var(--jaune-logo-lol) 3px';
    //Div contenant le nom , le type et la description des spells
    let spellDescription = document.getElementById('spellDescription');

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

    //Appelle de la fonction fetchChampionList()
    fetchChampionList();
    //Appelle la fonction fetchChampionInfo pour afficher les information de Annie par défault
    fetchChampionInfo()

    //Récuperer la liste des champion existant
    function fetchChampionList() {
        fetch(`http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json`, 'GET', printChampion);
    }

    //Afficher la liste des champion existant
    function printChampion() {
        let result = JSON.parse(this.responseText);
        let championList = result.data;

        // on trie les champions par clé (key)
        const sortedChampions = Object.values(championList).sort((a, b) => {
            let championIdA = parseInt(a.key);
            let championIdB = parseInt(b.key);
            return championIdA - championIdB;
        });

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

            // Si l'image est cliqué, lancer la fonction fetchChampionInfo
            img.addEventListener('click', function () {
                //vérifier si il y a des espaces et les supprimer
                championid = sortedChampions[champion].id;
                fetchChampionInfo();
            });

            //On ajoute la div dans le container containerChampion
            containerChampion.appendChild(div);
        }

    };

    //Récuperer les informations du champion choisis
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
        //Je vide la div containerSpell
        containerSpell.innerHTML = "";
        //Je vide la div spellDescription
        spellDescription.innerHTML = '';
        // J'affiche l'image du Champion dans la div championAssets
        let img = document.createElement('img');
        img.src = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championid}_0.jpg`;
        championAssets.appendChild(img);

        // J'affiche le nom du Champion
        let h2 = document.createElement('h2');
        h2.innerHTML = championInfo.name;
        containerInfo.appendChild(h2);

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


        // Je crée un élément <div></div> pour la compétence passive
        let div = document.createElement('div');

        // J'affiche l'image de la compétence passive
        img = document.createElement('img');
        img.src = `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/passive/${championInfo.passive.image.full}`;
        div.appendChild(img);
        //J'ajoute le border qui indique que le spell est sélectionner
        img.style.border = borderStyle

        //J'ajoute la div à mon container
        containerSpell.appendChild(div);

        //J'appelle la fonction printPassive pour afficher les détails de la comptétence passive
        printPassive();

        //Je parcoure les spells du champion
        championInfo.spells.forEach(spell => {

            // Je crée un élément <div></div> pour le spell
            let div = document.createElement('div');

            // J'affiche l'image du spell
            let img = document.createElement('img');
            img.src = `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/spell/${spell.id}.png`;
            div.appendChild(img);

            // Si l'image de la compétence passive est cliqué
            img.addEventListener('click', function () {

                //Je vide la div spellDescription
                spellDescription.innerHTML = '';

                //Retirer la bordure à tout les enfants de containerSpell
                for (var i = 0; i < containerSpell.childNodes.length; i++) {
                    containerSpell.childNodes[i].firstChild.style.border = "none"
                }
                // passer les bordure en jaune pour indiquer que le spell est sélectionner
                img.style.border = borderStyle

                //J'affiche de quelle compétence il s'agit (passive,A,Z,E,R)
                let span = document.createElement('span');
                //On récupere la longeur de l'id
                let strLength = spell.id.length;
                //On récupere la derniere lettre de l'id
                let spellType = spell.id.substring(strLength - 1, strLength);
                span.innerHTML = spellType;
                spellDescription.appendChild(span);
                //J'affiche le nom de la comptétence
                let h3 = document.createElement('h3');
                h3.innerHTML = spell.name;
                spellDescription.appendChild(h3);

                //J'affiche le desription de la compétence
                let p = document.createElement('p');
                p.innerHTML = spell.description;
                spellDescription.appendChild(p);

            });

            //J'ajoute la div à mon container
            containerSpell.appendChild(div);

        });

        // Si l'image de la compétence passive est cliqué
        img.addEventListener('click', function () {

            //Je vide la div spellDescription
            spellDescription.innerHTML = '';

            //Retirer la bordure à tout les enfants de containerSpell
            for (var i = 0; i < containerSpell.childNodes.length; i++) {
                containerSpell.childNodes[i].firstChild.style.border = "none"
            }
            // passer les bordure en jaune pour indiquer que le spell est sélectionner
            img.style.border = borderStyle
            printPassive();
        });

        function printPassive() {
            //J'affiche de quelle compétence il s'agit (passive,A,Z,E,R)
            let span = document.createElement('span');
            span.innerHTML = 'Compétence passive';
            spellDescription.appendChild(span);
            //J'affiche le nom de la comptétence
            let h3 = document.createElement('h3');
            h3.innerHTML = championInfo.passive.name;
            spellDescription.appendChild(h3);

            //J'affiche le desription de la compétence
            let p = document.createElement('p');
            p.innerHTML = championInfo.passive.description;
            spellDescription.appendChild(p);
        }

        statsList = Object.keys(championInfo.stats);
        statsValues = Object.values(championInfo.stats);
        updateChart1();
    }

});