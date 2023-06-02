//Liste des noms des stats pour le graph
let statsList = [];
//Liste des valeurs des stats pour le graph
let statsValues = [];
document.addEventListener('DOMContentLoaded', async function () {
    const containerChampion = document.getElementById('containerChampion');
    let championid = 'Annie';
    //Le container de l'assets du champion de la section "right"
    let championAssets = document.getElementById('championAssets');
    //Le container de l'assets de l'item de la section "right"
    let itemAssets = document.getElementById('itemAssets');
    //le container des informations (lore et compétence ) de la section "right"
    let containerInfo = document.getElementById('containerInfo');
    //div contenant les 5 spell du champion choisis
    let containerSpell = document.getElementById('containerSpell');
    //style des bordure des spells
    let borderStyle = 'solid var(--jaune-logo-lol) 3px';
    //Div contenant le nom , le type et la description des spells
    let spellDescription = document.getElementById('spellDescription');
    //Formulaire de recherche/filtre des champions
    let form = document.getElementById('form');
    //Formulaire de recherche/filtre des item
    let formItem = document.getElementById('formItem');
    //List trier des champions
    let sortedChampions;
    //List trier des items
    let itemList;
    //Select contenant les tags des champions
    let filter = document.getElementById('filter');
    //Select contenant les tags des items
    let filterItem = document.getElementById('filterItem');
    //input pour rechercher un champion
    let searchInput = document.getElementById('searchInput');
    //input pour rechercher un item
    let searchInputItem = document.getElementById('searchInputItem');
    //li du header pour afficher les items
    let itemLi = document.getElementById('itemLi');
    //Variable pour savoir sur quelle page nous nous situons
    let page = "champion";
    //li du header pour afficher le quizz des champions
    let quizz = document.getElementById('quizz');
    //li du header pour afficher le quizz des items
    let quizzItem = document.getElementById('quizz');
    //Formulaire de recherche/filtre des item
    let formQuizz = document.getElementById('formQuizz');
    //Champion choisis aléatoirement pour le quizz
    let randomChamp;
    //Le nombre d'essaie dans le quizz
    let nbrTry = 0;
    //Balise p qui affiche le nombre d'essaie restant
    let pTry;
    //Le temps restant sur le chrono
    let timeLeft;
    // Variable pour stocker le nombre de secondes écoulées
    let seconds = 60;
    // Identifiant du minuteur
    let timerId;

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
        sortedChampions = Object.values(championList).sort((a, b) => {
            let championIdA = parseInt(a.key);
            let championIdB = parseInt(b.key);
            return championIdA - championIdB;
        });

        //Appelle la fonction getUniqueTags pour recupere les tags disponibles
        let tagsList = getUniqueTags(sortedChampions);
        addTagsToSelect(tagsList, 'Role champion', filter);

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

        //Je vide la div championAssets
        championAssets.innerHTML = "";
        //Je vide la div containerInfo
        containerInfo.innerHTML = "";
        //Je vide la div containerSpell
        containerSpell.innerHTML = "";
        //Je vide la div spellDescription
        spellDescription.innerHTML = '';
        //Je vide la div itemAssets
        itemAssets.innerHTML = '';
        //J'affiche le graphique
        showChart();
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

    //A l'envoie du formulaire , appelle la fonction searchResult
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        searchResult(sortedChampions, filter, searchInput, `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/`);
    });
    //Au changement de choix du select, appelle la fonction searchResult
    filter.addEventListener('change', function (event) {
        event.preventDefault();
        searchResult(sortedChampions, filter, searchInput, `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/`);
    });


    function searchResult(list, filter, searchInput, lien) {
        event.preventDefault();

        //On vide la div containerChampion
        containerChampion.innerHTML = '';

        let tagSelected = filter.value;
        let search = searchInput.value.toLowerCase();

        const array = Object.values(list);


        for (let i = 0; i < array.length; i++) {
            const champ = array[i];
            let tag; // Déclaration de la variable tag ici

            //Si aucun tag n'est sélectionné
            if (tagSelected !== '') {
                for (let j = 0; j < champ.tags.length; j++) {
                    // Affectation de la valeur du tag à la variable tag
                    tag = champ.tags[j];
                    //Si la recherche et le tag correspondent à un champion
                    if (champ.name.toLowerCase().includes(search) && tag === tagSelected) {
                        printFilteredChamp(champ, lien);
                    }
                }
            } else {
                // Si la recherche correspond à un champion
                if (champ.name.toLowerCase().includes(search)) {
                    printFilteredChamp(champ, lien);
                }
            }
        }
    }

    //Fonction pour afficher les champion selon les champs de la recherche
    function printFilteredChamp(champ, lien) {
        // Je crée un élément <div></div> pour le Champion
        let div = document.createElement('div');

        // J'affiche l'image du Champion
        let img = document.createElement('img');
        img.src = `${lien}${champ.image.full}`;
        div.appendChild(img);

        // J'affiche le nom du Champion
        p = document.createElement('p');
        p.innerHTML = champ.name;
        div.appendChild(p);

        // Si l'image est cliqué, lancer la fonction fetchChampionInfo
        img.addEventListener('click', function () {
            if (page === 'champion') {
                championid = champ.id;
                fetchChampionInfo();
            } else {
                printItemInfo(champ);
            }

        });

        //On ajoute la div dans le container containerChampion
        containerChampion.appendChild(div);
    }

    function getUniqueTags(sortedChampions) {
        // Crée un set pour stocker les tags uniques
        const uniqueTags = new Set();

        // boucle sur les champion dans sortedChampions
        for (const champion in sortedChampions) {
            // Récupère les tags du champion actuel
            const tags = sortedChampions[champion].tags;
            tags.forEach(tag => {
                // Ajoute le tag à uniqueTags
                uniqueTags.add(tag);
            });
        }
        // Convertit uniqueTags en tableau
        const tagsList = Array.from(uniqueTags);
        return tagsList;
    }

    function addTagsToSelect(tagsList, message, filter) {
        // Créer une nouvelle option vide
        const option = document.createElement("option");
        // Définir la valeur de l'option vide
        option.value = '';
        option.text = message;
        // Ajouter l'option vide au select
        filter.appendChild(option);
        // Parcourir le tableau des tags
        tagsList.forEach(tag => {
            // Créer une nouvelle option
            const option = document.createElement("option");
            // Définir la valeur de l'option
            option.value = tag;
            option.text = tag;
            // Ajouter l'option au select
            filter.appendChild(option);
        });
    }

    itemLi.addEventListener('click', function () {
        fetchItemList(printItem);
    });


    //Récuperer la liste des champion existant
    function fetchItemList(fun) {
        fetch(`http://ddragon.leagueoflegends.com/cdn/13.11.1/data/fr_FR/item.json`, 'GET', fun);
    }

    //Afficher la liste des champion existant
    function printItem() {
        let result = JSON.parse(this.responseText);
        itemList = result.data;

        //J'indique que l'on se situe sur la page item
        page = 'item';

        printItemInfo(itemList[1001]);

        //Je vide la div containerChampion
        containerChampion.innerHTML = '';

        //J'affiche le form item et désaffiche le form des champions
        form.style.display = 'none';
        formItem.style.display = 'flex';


        let tagsList = getUniqueTags(itemList);
        addTagsToSelect(tagsList, `Type d'item`, filterItem);


        // Je boucle sur le tableau de résultats
        for (const item in itemList) {
            // Je crée un élément <div></div> pour l'item
            let div = document.createElement('div');

            // J'affiche l'image du item
            let img = document.createElement('img');
            img.src = `http://ddragon.leagueoflegends.com/cdn/13.11.1/img/item/${itemList[item].image.full}`;
            div.appendChild(img);

            // J'affiche le nom du Champion
            p = document.createElement('p');
            p.innerHTML = itemList[item].name;
            div.appendChild(p);

            // Si l'image est cliqué, lancer la fonction printItemInfo
            img.addEventListener('click', function () {
                printItemInfo(itemList[item]);
            });

            //On ajoute la div dans le container containerChampion
            containerChampion.appendChild(div);
        }

        //A l'envoie du formulaire , appelle la fonction searchResult
        formItem.addEventListener('submit', function (event) {
            event.preventDefault();
            // on trie les champions par clé (key)
            sortedItem = Object.values(itemList).sort((a, b) => {
                return parseInt(a.name) - parseInt(b.name)
            });
            searchResult(sortedItem, filterItem, searchInputItem, `http://ddragon.leagueoflegends.com/cdn/13.11.1/img/item/`);
        });
        //Au changement de choix du select, appelle la fonction searchResult
        filterItem.addEventListener('change', function (event) {
            event.preventDefault();
            searchResult(itemList, filterItem, searchInputItem, `http://ddragon.leagueoflegends.com/cdn/13.11.1/img/item/`);
        });
    };

    function printItemInfo(item) {

        //Je vide la div championAssets
        championAssets.innerHTML = "";
        //Je vide la div containerInfo
        containerInfo.innerHTML = "";
        //Je vide la div containerSpell
        containerSpell.innerHTML = "";
        //Je vide la div spellDescription
        spellDescription.innerHTML = '';
        //Je vide la div itemAssets
        itemAssets.innerHTML = '';
        //Je vide la div chart
        hideChart();

        // J'affiche l'image du item
        let img = document.createElement('img');
        img.src = `http://ddragon.leagueoflegends.com/cdn/13.11.1/img/item/${item.image.full}`;
        itemAssets.appendChild(img);

        // J'affiche le nom de l'item
        let h2 = document.createElement('h2');
        h2.innerHTML = item.name;
        containerInfo.appendChild(h2);

        // J'affiche la description de l'item
        let p = document.createElement('p');
        p.innerHTML = item.plaintext;
        containerInfo.appendChild(p);

        //Je verifie si l'item est achetable avec de l'or
        let purchasableValue;
        if (item.gold.purchasable) {
            purchasableValue = "Oui";
        } else {
            purchasableValue = "Non"
        }

        // J'affiche si l'item est achetable avec de l'or
        p = document.createElement('p');
        p.innerHTML = `Achetable avec de l’or : ${purchasableValue}`;
        containerInfo.appendChild(p);

        // J'affiche le prix d'achat de l'item
        p = document.createElement('p');
        p.innerHTML = `Prix d’achat : ${item.gold.base}`;
        containerInfo.appendChild(p);

        // J'affiche le prix de revente de l'item
        p = document.createElement('p');
        p.innerHTML = `Prix de revente : ${item.gold.sell}`;
        containerInfo.appendChild(p);

        //J'ajoute un hr pour faire une ligne
        let hr = document.createElement('hr');
        containerInfo.appendChild(hr);
    }

    quizz.addEventListener('click', fetchRandomChamp);

    function fetchRandomChamp() {
        //Récupere la longueur de la liste de champion
        lengthChamp = sortedChampions.length;
        // choisis un nombre entre 0 et lengthChamp
        let randomNumber = Math.floor(Math.random() * lengthChamp) + 1;
        //Récupere l'id de ce champion
        randomChampId = sortedChampions[randomNumber].id;
        //Je passe le nombre d'essaie restant à 0
        nbrTry = 0;

        fetch(`http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion/${randomChampId}.json`, 'GET', printRandomChamp);
    }

    function printRandomChamp() {
        let result = JSON.parse(this.responseText);
        randomChamp = result.data[randomChampId];

        //Je vide la div championAssets
        championAssets.innerHTML = "";
        //Je vide la div containerInfo
        containerInfo.innerHTML = "";
        //Je vide la div containerSpell
        containerSpell.innerHTML = "";
        //Je vide la div spellDescription
        spellDescription.innerHTML = '';
        //Je vide la div itemAssets
        itemAssets.innerHTML = '';
        //Je vide la div chart
        hideChart();
        //Je cache les formulaires form et formItem et  affiche le formulaire formQuizz
        form.style.display = 'none';
        formItem.style.display = 'none';
        formQuizz.style.display = 'flex';
        //Je vide la div containerChampion
        containerChampion.innerHTML = "";

        // Démarre le chronomètre
        startTimer();

        //J'affiche le nombre d'essaie restant dans la div containerInfo
        pTry = document.createElement('p');
        pTry.innerHTML = `essaie restant : ${7 - nbrTry}`;
        containerInfo.appendChild(pTry);

        // J'affiche l'image du Champion dans la div championAssets
        let img = document.createElement('img');
        img.src = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${randomChamp.id}_0.jpg`;
        championAssets.appendChild(img);
    }

    formQuizz.addEventListener('submit', printQuizzResult);

    function printQuizzResult() {
        event.preventDefault();

        //Si le joueur a bien deviner le champion
        if (searchInputQuizz.value == randomChamp.name) {
            //Passer l'input en vert et relancer le jeu
            searchInputQuizz.style.border = 'solid green 4px';
            stopTimer();
            fetchRandomChamp();
            alert('GG!');
            return;
        }

        //On boucle dans la liste des champion
        for (let i = 0; i < sortedChampions.length; i++) {
            //Si la reponse correspond à un champion existant
            if (sortedChampions[i].name == searchInputQuizz.value) {
                //On vérifie si ils ont des tags en commun
                if (randomChamp.tags.some(item => sortedChampions[i].tags.includes(item))) {
                    //Si oui -> input en orange
                    searchInputQuizz.style.border = 'solid orange 4px';
                    break;
                } else {
                    //Si non -> input en rouge
                    searchInputQuizz.style.border = 'solid red 4px';
                    break;
                }
            } else {
                // Si la reponse ne correspond à aucun champion -> input en rouge
                searchInputQuizz.style.border = 'solid blue 4px';
            }
        }
        nbrTry++;
        printQuizzHint();
    }

    function printQuizzHint() {
        switch (nbrTry) {
            case 1:
                //J'affiche le titre du champion dans la div containerChampion
                let p1 = document.createElement('p');
                p1.innerHTML = `1re Indice : ${randomChamp.title}`;
                containerChampion.appendChild(p1);
                break;
            case 2:
                //J'affiche les tags du champion dans la div containerChampion
                let p2 = document.createElement('p');
                p2.innerHTML = `2e Indice : ${randomChamp.tags}`;
                containerChampion.appendChild(p2);
                break;
            case 3:
                //J'affiche le partype du champion dans la div containerChampion
                let p3 = document.createElement('p');
                p3.innerHTML = `3e Indice : ${randomChamp.partype}`;
                containerChampion.appendChild(p3);
                break;
            case 4:
                //J'affiche le nom de la compétence passive du champion dans la div containerChampion
                let p4 = document.createElement('p');
                p4.innerHTML = `4e Indice : ${randomChamp.passive.name}`;
                containerChampion.appendChild(p4);
                break;
            case 5:
                //Je remplace le nom du champion dans son lore
                let lore = randomChamp.lore;
                let newLore = lore.replace(randomChamp.name, "Champion");

                //J'affiche le lore du champion dans la div containerChampion
                let p5 = document.createElement('p');
                p5.innerHTML = `4e Indice : ${newLore}`;
                containerChampion.appendChild(p5);
                break;
            case 7:
                alert('perdu');
                nbrTry = 0;
                stopTimer();
                fetchRandomChamp();
                break;
        }

        pTry.innerHTML = `essaie restant : ${7 - nbrTry}`;
    };


    function startTimer() {
        // Démarre le minuteur en appelant la fonction updateTimer toutes les 1000 millisecondes (1 seconde)
        timerId = setTimeout(updateTimer, 1000);

        //J'affiche le nombre de secondes restantes dans la div containerInfo
        timeLeft = document.createElement('p');
        timeLeft.innerHTML = `Il vous reste ${seconds} secondes`;
        containerInfo.appendChild(timeLeft);
    }

    function updateTimer() {
        // Incrémente le nombre de secondes écoulées
        seconds--;
        // Affiche le nombre de secondes restant
        timeLeft.innerHTML = `Il vous reste ${seconds} secondes`;

        if (seconds < 1) {
            alert('Perdu, temps écoulé');
            stopTimer()
            fetchRandomChamp();
        }
        else {
            // Relance le minuteur pour la prochaine seconde
            timerId = setTimeout(updateTimer, 1000);
        }

    }

    function stopTimer() {
        // Arrête le minuteur en utilisant l'identifiant stocké
        clearTimeout(timerId);
        // Réinitialise le nombre de secondes à zéro
        seconds = 60;
    }



});