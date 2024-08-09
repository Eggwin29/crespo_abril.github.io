// Define los IDs de los divs que contienen los textos
const textDivs = [
    'text-one',
    'text-two',
    'text-three',
    'text-four',
    'text-five',
    'text-six'
];

let currentDivIndex = -2; // Inicializa en -2 para sincronizar con los primeros textos

// Obtén el contenedor de texto y los títulos en #end-screen
const textContainer = document.getElementById('text-container');
const titleOne = document.getElementById('title-one');
const subtitleOne = document.getElementById('subtitle-one');
const titleTwo = document.getElementById('title-two');
const subtitleTwo = document.getElementById('subtitle-two');

// Función para mostrar el siguiente texto junto con el título y subtítulo
function showNextText() {
    if (document.getElementById('end-screen').style.display === 'flex') {
        // Incrementa el índice para mostrar el siguiente div
        currentDivIndex = (currentDivIndex + 1) % textDivs.length;

        // Oculta todos los divs de texto
        textDivs.forEach(id => {
            const div = document.getElementById(id);
            if (div) div.style.display = 'none';
        });

        // Muestra el div de texto correspondiente
        const currentDiv = document.getElementById(textDivs[currentDivIndex]);
        if (currentDiv) {
            currentDiv.style.display = 'block';
        }

        // Actualiza el título y subtítulo en función del índice actual
        if (currentDivIndex < 3) {
            // Para los primeros 3 textos
            titleOne.style.display = 'block';
            subtitleOne.style.display = 'block';
            titleTwo.style.display = 'none';
            subtitleTwo.style.display = 'none';
        } else {
            // Para los siguientes textos
            titleOne.style.display = 'none';
            subtitleOne.style.display = 'none';
            titleTwo.style.display = 'block';
            subtitleTwo.style.display = 'block';
        }
    }
}

// Maneja el evento de presionar una tecla
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        showNextText();
    }
});
