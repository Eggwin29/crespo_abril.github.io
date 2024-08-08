const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const gameMusic = document.getElementById('game-music');
const lyricsMusic = document.getElementById('lyrics');


// Ajusta el canvas al tamaño de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const peoplewidth = canvas.width * 0.02;
const peopleheight = canvas.height * 0.075;


const changeVolume = (increase) => {    
    let interval;
    let interval2;
    interval = setInterval(() => {
        if (gameMusic.volume > 0) {
            gameMusic.volume = Math.max(gameMusic.volume - 0.1, 0);
        } else {
            clearInterval(interval);
        }
    }, 500); // Disminuye el volumen cada 200 ms

    interval2 = setInterval(() => {
        if (lyricsMusic.volume < 1) {
            lyricsMusic.volume = Math.min(lyricsMusic.volume + 0.1, 1);
        } else {
            clearInterval(interval);
        }
    }, 500); // Aumenta el volumen cada 200 ms
};



const rabbit = new Image();
rabbit.src = 'images/rabbit.png';

const lab = new Image();
lab.src = 'images/lab2.png'

const woman = new Image();
woman.src = 'images/lab_woman2.png';

const lab2 = new Image();
lab2.src = 'images/lab3.png'

const lab3 = new Image();
lab3.src = 'images/lab4.png';

const lab4 = new Image();
lab4.src = 'images/lab5.png'

const lab5 = new Image();
lab5.src = 'images/idehacker.png';

const table = new Image();
table.src = 'images/table.png'

const computer = new Image();
computer.src = 'images/computer.gif';

const bookshelf = new Image();
bookshelf.src = 'images/lib2.png';

const cirno = new Image();
cirno.src = 'images/x/cirnoback.png';

const panel = new Image();
panel.src = 'images/panel.png'


rabbit.onerror = () => {
    console.error('Error loading the image. Please check the image path.');
};

// Función para ajustar el tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Llama a la función para ajustar el tamaño del canvas al cargar la página
resizeCanvas();

// Asegúrate de ajustar el tamaño del canvas si el usuario cambia el tamaño de la ventana
window.addEventListener('resize', resizeCanvas);

// Aquí puedes agregar el resto de tu código para el juego



class Player {
    constructor() {
        this.position = { x: (canvas.width * 0.05), y: (canvas.width * 0.225) };
        this.velocity = { x: 0, y: 0 };
        this.width = peoplewidth;
        this.height = peopleheight;
        this.speed = this.width/10; // Velocidad del jugador
        this.interactionRange = 60; // Distancia para interactuar con NPCs
        this.canMove = false; // Controla si el jugador puede moverse
        this.nearNpc = null; // Referencia al NPC cercano
        this.image = lab;
    }

    // Dibuja al jugador en el canvas
    draw() {
       // c.fillStyle = 'red';
       // c.fillRect(this.position.x, this.position.y, this.width, this.height);

        if (this.image.complete && this.image.naturalHeight !== 0) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        } else {
            console.error('Image not loaded properly.');
        }
    }

    // Actualiza la posición del jugador y lo dibuja
    update() {
        if (this.canMove) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
        this.draw();
    }

    // Establece la velocidad del jugador según las teclas presionadas
    setVelocity() {
        if (this.canMove) {
            this.velocity.x = (keys.right.pressed - keys.left.pressed) * this.speed;
            this.velocity.y = (keys.down.pressed - keys.up.pressed) * this.speed;
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }

    // Verifica las colisiones con las paredes y NPCs
    checkCollision(walls, npcs) {
        const initialPosition = { ...this.position };

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        for (const wall of walls) {
            if (this.position.x < wall.position.x + wall.width &&
                this.position.x + this.width > wall.position.x &&
                this.position.y < wall.position.y + wall.height &&
                this.position.y + this.height > wall.position.y) {

                if (this.velocity.x > 0) { // Movimiento hacia la derecha
                    this.position.x = wall.position.x - this.width;
                } else if (this.velocity.x < 0) { // Movimiento hacia la izquierda
                    this.position.x = wall.position.x + wall.width;
                }

                if (this.velocity.y > 0) { // Movimiento hacia abajo
                    this.position.y = wall.position.y - this.height;
                } else if (this.velocity.y < 0) { // Movimiento hacia arriba
                    this.position.y = wall.position.y + wall.height;
                }

                this.velocity.x = 0;
                this.velocity.y = 0;
            }
        }

        for (const npc of npcs) {
            if (this.position.x < npc.position.x + npc.width &&
                this.position.x + this.width > npc.position.x &&
                this.position.y < npc.position.y + npc.height &&
                this.position.y + this.height > npc.position.y) {

                if (this.velocity.x > 0) { // Movimiento hacia la derecha
                    this.position.x = npc.position.x - this.width;
                } else if (this.velocity.x < 0) { // Movimiento hacia la izquierda
                    this.position.x = npc.position.x + npc.width;
                }

                if (this.velocity.y > 0) { // Movimiento hacia abajo
                    this.position.y = npc.position.y - this.height;
                } else if (this.velocity.y < 0) { // Movimiento hacia arriba
                    this.position.y = npc.position.y + npc.height;
                }

                this.velocity.x = 0;
                this.velocity.y = 0;
            }
        }

        if (this.position.x !== initialPosition.x || this.position.y !== initialPosition.y) {
            this.position.x = initialPosition.x;
            this.position.y = initialPosition.y;
        }
    }

    // Verifica si el jugador está cerca de un NPC
    checkProximity(npcs) {
        this.nearNpc = null;
        for (const npc of npcs) {
            const dx = (this.position.x + this.width / 2) - (npc.position.x + npc.width / 2);
            const dy = (this.position.y + this.height / 2) - (npc.position.y + npc.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const adjustedInteractionRange = this.interactionRange + Math.max(npc.width, npc.height) / 2;
    
            if (distance < adjustedInteractionRange) {
                this.nearNpc = npc;
                break;
            }
        }
    }
    
}

class Npc {
    constructor({ x, y, h, w, image, dialog }) {
        this.position = { x, y };
        this.width = w;
        this.height = h;
        this.dialog = dialog; // Texto del cuadro de diálogo del NPC
        this.dialogIndex = 0; // Índice del texto en el cuadro de diálogo del NPC
        this.image =  image;
    }

    // Dibuja el NPC en el canvas
    draw() {
        
        if (this.image.complete && this.image.naturalHeight !== 0) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        } else {
            console.error('Image not loaded properly.');
        }
    }
}

// Función para dibujar un rectángulo con esquinas redondeadas
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}


function drawWoodPattern(ctx, x, y, width, height) {
    // Draw wood base
    ctx.fillStyle = '#8B4513'; // Brown color for wood
    ctx.fillRect(x, y, width, height);

    // Draw vertical wood planks
    const plankWidth = 10; // Width of each wood plank
    for (let i = x; i < x + width; i += plankWidth) {
        // Ensure planks fit within the width
        let currentPlankWidth = (i + plankWidth > x + width) ? x + width - i : plankWidth;
        ctx.fillStyle = '#A0522D'; // Slightly lighter brown for the planks
        ctx.fillRect(i, y, currentPlankWidth - 2, height); // Slightly thinner planks for separation
    }

    // Draw border
    ctx.lineWidth = 3; // Set border thickness
    ctx.strokeStyle = '#000000'; // Black color for border
    ctx.strokeRect(x, y, width, height); // Draw the border around the wood pattern
}

function Metal(ctx, x, y, width, height, scale) {
    // Draw border
    ctx.fillStyle = '#444444'; // Black color for border
    ctx.fillRect(x - 4, y - 4, width + 8, height + 8); // Slightly larger rectangle for border

    // Create a gradient for the base metal color
    let gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, '#dcdcdc'); // Gainsboro color
    gradient.addColorStop(0.5, '#f5f5f5'); // White Smoke color
    gradient.addColorStop(1, '#a9a9a9'); // Dark Gray color

    // Draw base metal color with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    // Draw horizontal lines for metal panels
    ctx.strokeStyle = '#708090'; // Slate Gray color for lines
    ctx.lineWidth = 1;
    for (let i = y; i <= y + height; i += 20 * scale) {
        ctx.beginPath();
        ctx.moveTo(x, i);
        ctx.lineTo(x + width, i);
        ctx.stroke();
    }

    // Draw vertical lines for metal panels
    for (let i = x; i <= x + width; i += 20 * scale) {
        ctx.beginPath();
        ctx.moveTo(i, y);
        ctx.lineTo(i, y + height);
        ctx.stroke();
    }

    // Add some rivets for more texture
    for (let i = x + 10 * scale; i <= x + width; i += 20 * scale) {
        for (let j = y + 10 * scale; j <= y + height; j += 20 * scale) {
            ctx.fillStyle = '#696969'; // Dim Gray color for rivets
            ctx.beginPath();
            ctx.arc(i, j, 2 * scale, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Add highlights to create a shiny effect
    for (let i = y; i <= y + height; i += 40 * scale) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Semi-transparent white for highlights
        ctx.beginPath();
        ctx.moveTo(x, i);
        ctx.lineTo(x + width, i);
        ctx.stroke();
    }

    for (let i = x; i <= x + width; i += 40 * scale) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Semi-transparent white for highlights
        ctx.beginPath();
        ctx.moveTo(i, y);
        ctx.lineTo(i, y + height);
        ctx.stroke();
    }

    // Add shadows to create depth
    for (let i = y + 10 * scale; i <= y + height; i += 40 * scale) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; // Semi-transparent black for shadows
        ctx.beginPath();
        ctx.moveTo(x, i);
        ctx.lineTo(x + width, i);
        ctx.stroke();
    }

    for (let i = x + 10 * scale; i <= x + width; i += 40 * scale) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; // Semi-transparent black for shadows
        ctx.beginPath();
        ctx.moveTo(i, y);
        ctx.lineTo(i, y + height);
        ctx.stroke();
    }
}







class Wall {
    constructor({ x, y, width, height, image }) {
        this.position = { x, y };
        this.width = width;
        this.height = height;
        this.image = image;
    }

    
    draw() {

        if (this.image.complete && this.image.naturalHeight !==  null) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        } else{
            Metal(c, this.position.x, this.position.y, this.width, this.height);
        }


        
    }
}

class Ground {
    constructor({ x, y, width, height, image, col }) {
        this.position = { x, y };
        this.width = width;
        this.height = height;
        this.image = image;
        this.col = col;
    }

    draw() {
        if (this.image.complete && this.image.naturalHeight !== null) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        } else {
            if (this.col == 'wood') {
                drawWoodPattern(c, this.position.x, this.position.y, this.width, this.height);
            } else{
                // Establece el color de relleno a rojo
                c.fillStyle = this.col;
                // Dibuja un rectángulo de color rojo
                c.fillRect(this.position.x, this.position.y, this.width, this.height);
            }
        }
    }
}




const player = new Player();
const npcs = [
    //Bunny
    new Npc({ x: (canvas.width * 0.8), y: (canvas.height * 0.5), h: (canvas.width * 0.023), w: (canvas.width * 0.023), image: rabbit, dialog: ["*Bunny*: Hi there! Did you know that new research methods can save animals like me?", "*You*: Really? How?", "*Bunny*: With advanced technologies, we can replace animal testing. This means a safer and kinder world for all of us. Your support can make a big difference!"] }),
    //People
    new Npc({x: (canvas.width * 0.15), y: (canvas.width * 0.225), h: peopleheight, w: peoplewidth, image: lab3, dialog: ["*Woman 1*: Welcome, to the Lawrence Livermore National Laboratory!", "*Woman 1*: Did you know that many scientific experiments are still conducted on animals? It's a tough issue because it involves ethical concerns and the well-being of animals.", "*You*: That's terrible! Is there anything being done to change this?", "*Woman 1*: Indeed, researchers are actively seeking alternatives. At Lawrence Livermore National Laboratory, scientists are pioneering methods to reduce and replace animal testing. Let's find out more!"] }),
    new Npc({ x: (canvas.width * 0.17), y: (canvas.height * 0.1), h: peopleheight, w:peoplewidth, image: lab4, dialog: ["*Woman 2*: Greetings my friend!", "*You*: Hello!", "*Woman 2*: Are you here to learn about the amazing work being done at Lawrence Livermore National Laboratory?", "*You*: Yes, tell me more!", "*Woman 2*: LLNL is at the forefront of developing computational models and advanced imaging technologies. These methods can simulate how substances affect human cells, reducing the need for animal testing."] }),
    new Npc({ x: (canvas.width * 0.35), y: (canvas.height * 0.22), h: peopleheight, w: peoplewidth, image: lab5, dialog: ["*Man 1*: Hello there! Let me tell you about some of the technologies we use to replace animal testing.", "*You*: I'm all ears!", "*Man 1*: We use computer simulations to predict how chemicals will behave in the human body. These models can be incredibly accurate and don't require any animal subjects. Isn't that amazing?", "*You*: Wow, Yes!, is really amazing"] }),
    new Npc({ x: (canvas.width * 0.69), y: (canvas.height * 0.17), h: peopleheight, w: peoplewidth, image: woman, dialog: ["*Woman 3*: Good day! Did you know that alternatives to animal testing offer numerous benefits?", "*You*: Really? What kind of benefits?", "*Woman 3*: Well, using methods like in vitro testing and computational models can be faster, cheaper, and more ethical.", "*Woman 3*: Plus, they often provide results that are more relevant to humans!"] }),
    new Npc({ x: (canvas.width * 0.80), y: canvas.height * 0.1, h: peopleheight, w: peoplewidth, image: lab2, dialog: ["*Man 2*: Hey there! Are you excited about the future of scientific research?", "*You*: I am! What does the future hold?", "*Man 2*: With continued advancements in technology, we hope to completely eliminate the need for animal testing.", "*Man 2*: This would be a huge win for both science and animal welfare. Together, we can support these efforts and make a difference!"] }),
    
];

// Crear muros en el canvas
const walls = [
    //Computers
    new Wall({ x: (canvas.width * 0.73), y: 0, width: (canvas.width * 0.04), height: (canvas.width * 0.04), image: computer }),
    new Wall({ x: ((canvas.width * 0.73) + (canvas.width * 0.04)), y: 0, width: (canvas.width * 0.04), height: (canvas.width * 0.04), image: computer }),
    new Wall({ x: ((canvas.width * 0.73) + (canvas.width * 0.04 * 2)), y: 0, width: (canvas.width * 0.04), height: (canvas.width * 0.04), image: computer }),
    new Wall({ x: ((canvas.width * 0.73) + (canvas.width * 0.04 * 3)), y: 0, width: (canvas.width * 0.04), height: (canvas.width * 0.04), image: computer }),
    new Wall({ x: ((canvas.width * 0.73) + (canvas.width * 0.04 * 4)), y: 0, width: (canvas.width * 0.04), height: (canvas.width * 0.04), image: computer }),
    //Walls
    new Wall({x: 0, y: canvas.height * 0.007, width: (canvas.width * 0.03), height: (canvas.height * 0.345), image: ''}),
    new Wall({x: 0, y: (canvas.height * 0.65), width: (canvas.width * 0.03), height: (canvas.height * 0.345), image: ''}),
    new Wall({x: (canvas.width * 0.32), y: (canvas.height * 0.65), width: (canvas.width * 0.37), height: (canvas.height * 0.172)*2, image: ''}),
    new Wall({x: canvas.width * 0.97, y: (canvas.height * 0.65), width: (canvas.width * 0.04), height: (canvas.height * 0.345), image: ''}),
    new Wall({x: canvas.width * 0.97, y: canvas.height * 0.007, width: (canvas.width * 0.04), height: (canvas.height * 0.345), image: ''}),

    //bordes
    new Wall({x: 0, y: -1, width: canvas.width * 2, height: 1, image: '  '}),
    new Wall({x: 0, y: canvas.height + 1, width: canvas.width * 2, height: 1, image: '  '}),
    new Wall({x: -1, y: 0, width: 1, height: canvas.height, image: '  '}),

    
    //tables
    new Wall({x: (canvas.width * 0.53), y: canvas.height * 0.01, width: (canvas.width * 0.15), height: canvas.height * 0.127, image: table}),
    new Wall({x: (canvas.width * 0.32), y: canvas.height * 0.01, width: (canvas.width * 0.15), height: canvas.height * 0.127, image: table}),
    new Wall({x: (canvas.width * 0.53), y: canvas.height * 0.01 + (canvas.height * 0.130), width: (canvas.width * 0.15), height: canvas.height * 0.127, image: table}),
    new Wall({x: (canvas.width * 0.32), y: canvas.height * 0.01 + (canvas.height * 0.130), width: (canvas.width * 0.15), height: canvas.height * 0.127, image: table}),
    //librerias:
    new Wall({x: (canvas.width * 0.031), y: 0, width: (canvas.width * 0.052), height: canvas.height * 0.13, image:bookshelf}),
    new Wall({x: (canvas.width * 0.031 + (canvas.width * 0.052)), y: 0, width: (canvas.width * 0.052), height: canvas.height * 0.132, image:bookshelf}),
    new Wall({x: (canvas.width * 0.031 + (canvas.width * 0.052)*2), y: 0, width: (canvas.width * 0.052), height: canvas.height * 0.132, image:bookshelf}),
    new Wall({x: (canvas.width * 0.031 + (canvas.width * 0.052)*3), y: 0, width: (canvas.width * 0.052), height: canvas.height * 0.132, image:bookshelf}),
    new Wall({x: (canvas.width * 0.031 + (canvas.width * 0.052)*4), y: 0, width: (canvas.width * 0.052), height: canvas.height * 0.132, image:bookshelf}),

    //Panels
    new Wall({x: (canvas.width * 0.055), y: canvas.height * 0.85 , width: canvas.width * 0.12, height: canvas.height*0.15, image: panel}),
    new Wall({x: (canvas.width * 0.055) + (canvas.width * 0.12), y: canvas.height * 0.85 , width: canvas.width * 0.12, height: canvas.height*0.15, image: panel}),
];

const grounds = [
    new Ground({ x: (canvas.width * 0.04), y: canvas.height * 0.13, width: canvas.width * 0.24, height: canvas.height *0.20, image: '', col: 'wood'  }), // Fondo completo con patrón de madera
    new Ground({ x: (canvas.width), y: 0, width: canvas.width, height: canvas.height, image: '', col: '#3f9b0b'}),
    new Ground({ x: (canvas.width), y: canvas.height*0.35, width: canvas.width, height: canvas.height*0.3, image: '', col: '#ecd795'}),
    // Puedes agregar más instancias de Ground aquí si es necesario
];

const keys = {
    right: { pressed: false },
    left: { pressed: false },
    up: { pressed: false },
    down: { pressed: false },
    interact: { pressed: false }, // Tecla de interacción
    advance: { pressed: false } // Tecla para avanzar diálogo
};

let dialogActive = false; // Controla si el diálogo está activo
let end = 0;

    // Función principal de animación
    function animate() {

        if(end == 2){
            endScreen.style.display = 'flex'; // Ocultar la pantalla de inicio
            player.canMove = false;
            showNextText();
            changeVolume();
        }else{
            requestAnimationFrame(animate);
        }
        
        
        c.clearRect(0, 0, canvas.width, canvas.height);

        // Verificar si el jugador ha cruzado el borde derecho de la pantalla
        if (player.position.x >= canvas.width) {
            // Mover todos los elementos hacia la izquierda
            grounds.forEach(ground => ground.position.x -= canvas.width);
            walls.forEach(wall => wall.position.x -= canvas.width);
            npcs.forEach(npc => npc.position.x -= canvas.width);
            
            // Ajustar la posición del jugador para que esté al inicio de la pantalla
            player.position.x = canvas.width * 0.05; // Ajusta esto según la lógica de tu juego
            end += 1;
        }

        if (player.position.x <= 0) {
            // Mover todos los elementos hacia la izquierda
            grounds.forEach(ground => ground.position.x += canvas.width);
            walls.forEach(wall => wall.position.x += canvas.width);
            npcs.forEach(npc => npc.position.x += canvas.width);
            
            // Ajustar la posición del jugador para que esté al inicio de la pantalla
            player.position.x = canvas.width * 0.95;
            end -= 1;
        }

        

        // Dibujar el fondo
        grounds.forEach(ground => ground.draw());

        // Dibujar muros
        walls.forEach(wall => wall.draw());

        // Dibujar NPCs
        npcs.forEach(npc => npc.draw());

        // Actualizar y dibujar el jugador
        player.setVelocity();
        player.checkCollision(walls, npcs);
        player.update();
        player.checkProximity(npcs);

        if (player.nearNpc && !dialogActive) {
            // Configura el estilo del texto
            c.font = '20px Arial';
            const text1 = 'Press "';
            const text2 = 'Enter';
            const text3 = '" to interact';
            
            // Obtén las medidas del texto
            const textWidth1 = c.measureText(text1).width;
            const textWidth2 = c.measureText(text2).width;
            const textWidth3 = c.measureText(text3).width;
            const textHeight = 20; // Altura aproximada del texto
            
            // Configura el fondo negro transparente con bordes redondeados
            const backgroundX = player.nearNpc.position.x;
            const backgroundY = player.nearNpc.position.y - 30; // Ajusta según la posición deseada
            const padding = 10; // Espacio alrededor del texto
            const radius = 10; // Radio de los bordes redondeados
            const totalWidth = textWidth1 + textWidth2 + textWidth3; // Ancho total del texto
            c.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Negro con 50% de transparencia
            drawRoundedRect(c, backgroundX - padding, backgroundY - padding, totalWidth + padding * 2, textHeight + padding * 2, radius);
            
            // Dibuja el texto
            c.fillStyle = 'white';
            c.fillText(text1, backgroundX, backgroundY + textHeight);
            c.fillStyle = 'red';
            c.fillText(text2, backgroundX + textWidth1, backgroundY + textHeight);
            c.fillStyle = 'white';
            c.fillText(text3, backgroundX + textWidth1 + textWidth2, backgroundY + textHeight);

            
        }

        if (dialogActive) {
            drawDialog(); // Dibuja el diálogo si está activo
        }
    }


function drawDialog() {
    const existingDialogBox = document.getElementById('dialogBox');
    if (existingDialogBox) {
        existingDialogBox.remove(); // Elimina el cuadro de diálogo existente
    }

    const npc = player.nearNpc; // NPC actual con el que se está interactuando
    const dialogBox = document.createElement('div');
    dialogBox.id = 'dialogBox';
    dialogBox.style.position = 'absolute';
    dialogBox.style.left = '50%'; // Centra horizontalmente el cuadro de diálogo
    dialogBox.style.transform = 'translateX(-50%)'; // Ajuste para centrar
    dialogBox.style.bottom = '20px'; // Posiciona el cuadro de diálogo en la parte inferior
    dialogBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    dialogBox.style.color = 'white';
    dialogBox.style.padding = '20px';
    dialogBox.style.borderRadius = '10px';
    dialogBox.style.zIndex = '1000';
    dialogBox.style.fontFamily = 'Arial, sans-serif';
    dialogBox.style.fontSize = '24px';
    dialogBox.style.width = '80%'; // Ocupa el 80% del ancho de la pantalla
    dialogBox.style.minHeight = '20%'; // Ocupa un máximo del 40% de la altura de la pantalla
    dialogBox.style.overflowY = 'auto';
    dialogBox.style.whiteSpace = 'pre-wrap'; // Permite saltos de línea automáticos
    dialogBox.style.wordWrap = 'break-word'; // Ajusta el texto para que no se desborde horizontalmente

    const textNode = document.createTextNode(npc.dialog[npc.dialogIndex]);
    dialogBox.appendChild(textNode);

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Enter';
    closeButton.style.position = 'absolute';
    closeButton.style.bottom = '10px';
    closeButton.style.right = '10px';
    closeButton.onclick = advanceDialog;
    dialogBox.appendChild(closeButton);

    document.body.appendChild(dialogBox);
}

function advanceDialog() {
    const npc = player.nearNpc; // NPC actual con el que se está interactuando
    if (npc.dialogIndex < npc.dialog.length - 1) {
        npc.dialogIndex++;
        drawDialog(); // Actualiza el diálogo
    } else {
        dialogActive = false;
        player.canMove = true; // Reactiva el movimiento del jugador
        npc.dialogIndex = 0; // Reinicia el índice del diálogo para el NPC
        const dialogBox = document.getElementById('dialogBox');
        if (dialogBox) {
            document.body.removeChild(dialogBox);
        }
    }
}

// Control de eventos de teclado
addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 37: // Tecla 'A' (izquierda)
            keys.left.pressed = true;
            break;
        case 39: // Tecla 'D' (derecha)
            keys.right.pressed = true;
            break;
        case 38: // Tecla 'W' (arriba)
            keys.up.pressed = true;
            break;
        case 40: // Tecla 'S' (abajo)
            keys.down.pressed = true;
            break;
        case 13: // Tecla 'Enter' (interactuar o avanzar diálogo)
            keys.interact.pressed = true;
            if (player.nearNpc && !dialogActive) {
                dialogActive = true;
                player.canMove = false; // Desactivar movimiento mientras el diálogo está activo
                drawDialog(); // Muestra el primer diálogo del NPC
            } else if (dialogActive) {
                advanceDialog(); // Avanza el diálogo si está activo
            }
            break;
    }
});

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 37: // Tecla 'A' (izquierda)
            keys.left.pressed = false;
            break;
        case 39: // Tecla 'D' (derecha)
            keys.right.pressed = false;
            break;
        case 38: // Tecla 'W' (arriba)
            keys.up.pressed = false;
            break;
        case 40: // Tecla 'S' (abajo)
            keys.down.pressed = false;
            break;
        case 13: // Tecla 'Enter' (interactuar o avanzar diálogo)
            keys.interact.pressed = false;
            break;
    }
});

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none'; // Ocultar la pantalla de inicio
    gameMusic.play(); // Reproducir la canción
    lyricsMusic.play();
    lyricsMusic.volume = 0;
    player.canMove = true
    animate(); // Iniciar la animación del juego
});


animate(); // Inicia la animación