// Define los textos que se mostrarán
const texts = [

    "Press 'Enter' to read the information",
    "Problem: The current method for developing new drugs and antidotes relies heavily on animal testing, which is costly, time-consuming, and often provides inaccurate data about human responses.",
    'Solution: LLNL is developing a "human-on-a-chip" technology called iCHIP to simulate various human biological systems. This miniature replica of the human body aims to replace animal testing by providing a more accurate and efficient platform for testing drugs, toxins, and other substances.',
    "Challenges: Despite promising initial results, there are still challenges to overcome. These include: Fully integrating different organ systems onto a single chip to create a complete human body model.",
    "Ensuring the long-term viability and functionality of the simulated tissues and organs. Gaining widespread acceptance and regulatory approval for the use of human-on-chip technology in drug development.",
];

let currentTextIndex = -1;

// Obtén el elemento del contenedor de texto en #end-screen
const textContainer = document.getElementById('text-container');

// Función para mostrar el siguiente texto
function showNextText() {
    if (document.getElementById('end-screen').style.display === 'flex') {
        // Muestra el siguiente texto
        if (currentTextIndex < texts.length) {
            textContainer.textContent = texts[currentTextIndex];
            currentTextIndex++;
        } else {
            // Resetea el índice si has mostrado todos los textos
            currentTextIndex = 0;
            textContainer.textContent = texts[currentTextIndex];
        }
    }
}

// Maneja el evento de presionar una tecla
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        showNextText();
    }
});

// Muestra el #end-screen cuando se hace clic en el botón de inicio

