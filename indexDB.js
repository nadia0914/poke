document.addEventListener('DOMContentLoaded', (event) => {
            const dbName = 'PokemonDB';
            const request = window.indexedDB.open(dbName);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const objectStore = db.createObjectStore('pokemons', { keyPath: 'id' });
                objectStore.createIndex('name', 'name', { unique: false });
            };

            request.onsuccess = (event) => {
                const db = event.target.result;

                // Realizar la solicitud a la API de Pokémon para obtener los primeros 20
                fetch('https://pokeapi.co/api/v2/pokemon/?limit=20')
                    .then(response => response.json())
                    .then(data => {
                        const pokemons = data.results;

                        // Almacenar los datos en IndexedDB
                        const transaction = db.transaction('pokemons', 'readwrite');
                        const objectStore = transaction.objectStore('pokemons');

                        pokemons.forEach((pokemon, index) => {
                            // Puedes personalizar qué datos almacenar aquí
                            const pokemonId = index + 1; // La API utiliza índices basados en 1
                            objectStore.add({ id: pokemonId, name: pokemon.name });
                        });

                        transaction.oncomplete = () => {
                            console.log('Datos almacenados en IndexedDB');
                        };

                        transaction.onerror = (error) => {
                            console.error('Error al almacenar datos: ', error);
                        };
                    });
            };

            request.onerror = (event) => {
                console.error('Error al abrir la base de datos: ', event.target.error);
            };
        });