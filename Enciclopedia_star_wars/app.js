document.addEventListener('DOMContentLoaded', async () => {
    const characterListElement = document.getElementById('characterList');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const searchInput = document.getElementById('searchInput');
    const characterDetailElement = document.getElementById('characterDetail');
    const loadingSpinner = document.getElementById('loadingSpinner');
    let currentPage = 1;
    let characters = [];
    let currentSearchTerm = '';

    async function loadCharacters(page) {
        showLoadingSpinner();
        const data = await fetchCharacters(page);
        hideLoadingSpinner();
        characters = characters.concat(data.results);
        renderCharacterList();
    }

    function renderCharacterList() {
        characterListElement.innerHTML = '';
        const filteredCharacters = characters.filter(character =>
            character.name.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );

        filteredCharacters.forEach((character, index) => {
            const characterCard = document.createElement('div');
            characterCard.className = 'characterCard';
            
            const characterImage = document.createElement('img');
            characterImage.className = 'characterImage';
            characterImage.src = `https://starwars-visualguide.com/assets/img/characters/${getCharacterId(character.url)}.jpg`;
            characterImage.alt = character.name;
            
            const characterName = document.createElement('p');
            characterName.className = 'characterName';
            characterName.textContent = character.name;
            
            characterCard.appendChild(characterImage);
            characterCard.appendChild(characterName);
            characterCard.addEventListener('click', () => showCharacterDetail(character.url));
            characterListElement.appendChild(characterCard);

            // Adding delay for animation effect
            setTimeout(() => characterCard.classList.add('show'), index * 100);
        });
    }

    function getCharacterId(url) {
        const match = url.match(/\/people\/(\d+)\//);
        return match ? match[1] : null;
    }

    async function showCharacterDetail(url) {
        showLoadingSpinner();
        const character = await fetchCharacterDetail(url);
        hideLoadingSpinner();
        characterDetailElement.innerHTML = `
            <h2>${character.name}</h2>
            <p>Height: ${character.height}</p>
            <p>Mass: ${character.mass}</p>
            <p>Hair Color: ${character.hair_color}</p>
            <p>Skin Color: ${character.skin_color}</p>
            <p>Eye Color: ${character.eye_color}</p>
            <p>Birth Year: ${character.birth_year}</p>
            <p>Gender: ${character.gender}</p>
        `;
        characterDetailElement.classList.add('show');
    }

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        loadCharacters(currentPage);
    });

    searchInput.addEventListener('input', (event) => {
        currentSearchTerm = event.target.value;
        renderCharacterList();
    });

    await loadCharacters(currentPage);
});

async function fetchCharacters(page = 1) {
    const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
    return response.json();
}

async function fetchCharacterDetail(url) {
    const response = await fetch(url);
    return response.json();
}

function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}
