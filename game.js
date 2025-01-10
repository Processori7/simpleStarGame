const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 4; // Вычитаем 4 для учета границы
canvas.height = window.innerHeight - 4;

const spaceship = {
    x: 50, // Начальная позиция корабля по оси X
    y: canvas.height / 2, // Начальная позиция корабля по оси Y
    width: 30, // Ширина корабля
    height: 30, // Высота корабля
    color: '#FFFF00', // Цвет корабля
    dy: 0, // Скорость по оси Y
    gravity: 0.5, // Ускорение свободного падения
    jumpStrength: -10, // Сила прыжка
    maxJumpHeight: 1000 // Максимальная высота прыжка
};

const asteroids = []; // Массив астероидов
let score = 0; // Счет игрока
const stars = []; // Массив звезд
let gameStarted = false; // Флаг начала игры
let gameOver = false; // Флаг окончания игры

// Создаем звезды
for (let i = 0; i < 200; i++) {
    stars.push({
        x: Math.random() * canvas.width, // Случайная позиция по оси X
        y: Math.random() * canvas.height, // Случайная позиция по оси Y
        radius: Math.random() * 2 + 1, // Радиус звезды
        color: '#fff' // Цвет звезды
    });
}

// Функция для рисования корабля
function drawSpaceship() {
    ctx.save(); // Сохраняем текущее состояние контекста
    ctx.translate(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2); // Перемещаем центр координат в центр корабля
    ctx.fillStyle = '#FFFF00'; // Устанавливаем цвет заливки
    ctx.beginPath(); // Начинаем новый путь
    ctx.moveTo(-spaceship.width / 2, -spaceship.height / 2); // Перемещаем курсор к верхнему левому углу
    ctx.lineTo(spaceship.width / 2, 0); // Рисуем линию к верхнему правому углу
    ctx.lineTo(-spaceship.width / 2, spaceship.height / 2); // Рисуем линию к нижнему левому углу
    ctx.closePath(); // Закрываем путь
    ctx.fill(); // Заливаем фигуру
    ctx.restore(); // Восстанавливаем предыдущее состояние контекста
}

// Функция для рисования астероидов
function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.fillStyle = '#D52029'; // Устанавливаем цвет заливки
        ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height); // Рисуем прямоугольник астероида
    });
}

// Функция для рисования звезд
function drawStars() {
    stars.forEach(star => {
        ctx.beginPath(); // Начинаем новый путь
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); // Рисуем окружность звезды
        ctx.fillStyle = star.color; // Устанавливаем цвет заливки
        ctx.fill(); // Заливаем фигуру
    });
}

// Функция для обновления состояния корабля
function updateSpaceship() {
    spaceship.dy += spaceship.gravity; // Применяем гравитацию
    spaceship.y += spaceship.dy; // Обновляем позицию корабля по оси Y

    // Ограничиваем нижний предел экрана
    if (spaceship.y + spaceship.height > canvas.height) {
        spaceship.y = canvas.height - spaceship.height; // Корабль остается на нижней границе
        spaceship.dy = 0; // Сбрасываем скорость по оси Y
        endGame(); // Завершаем игру при касании низа
    }

    // Ограничиваем верхний предел экрана
    if (spaceship.y < 0) {
        spaceship.y = 0; // Корабль остается на верхней границе
        spaceship.dy = 0; // Сбрасываем скорость по оси Y
		endGame(); // Завершаем игру при касании верха
    }
}

// Функция для обновления состояния астероидов
function updateAsteroids() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        asteroid.x -= 5; // Перемещаем астероид влево

        if (asteroid.x + asteroid.width < 0) {
            asteroids.splice(i, 1); // Удаляем астероид, если он выходит за пределы экрана
            score++; // Увеличиваем счет
        }

        if (detectCollision(spaceship, asteroid)) {
            endGame(); // Завершаем игру при столкновении
        }
    }
}

// Функция для определения столкновения двух объектов
function detectCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Функция для создания нового астероида
function createAsteroid() {
    const size = Math.random() * 30 + 20; // Случайный размер астероида
    const y = Math.random() * (canvas.height - size); // Случайная позиция по оси Y
    asteroids.push({
        x: canvas.width, // Начальная позиция по оси X
        y: y, // Позиция по оси Y
        width: size, // Ширина астероида
        height: size // Высота астероида
    });
}

// Функция для завершения игры
function endGame() {
    gameOver = true; // Устанавливаем флаг окончания игры
}

// Функция для рисования счета
function drawScore() {
    ctx.fillStyle = '#fff'; // Устанавливаем цвет текста
    ctx.font = '20px Arial'; // Устанавливаем шрифт
    ctx.fillText(`              Счет: ${score}`, 10, 30); // Рисуем текст счета
}

// Функция для рисования начального сообщения
function drawStartMessage() {
    ctx.fillStyle = '#fff'; // Устанавливаем цвет текста
    ctx.font = '30px Arial'; // Устанавливаем шрифт
    ctx.textAlign = 'center'; // Выравниваем текст по центру
    ctx.fillText('Для начала игры нажмите на пробел', canvas.width / 2, canvas.height / 2); // Рисуем текст сообщения
}

// Функция для рисования сообщения об окончании игры
function drawGameOverMessage() {
    ctx.fillStyle = '#fff'; // Устанавливаем цвет текста
    ctx.font = '30px Arial'; // Устанавливаем шрифт
    ctx.textAlign = 'center'; // Выравниваем текст по центру
    ctx.fillText(`Игра окончена! Ваш счет: ${score}`, canvas.width / 2, canvas.height / 2); // Рисуем текст сообщения
    ctx.fillText('Нажмите пробел, чтобы начать заново', canvas.width / 2, canvas.height / 2 + 40); // Рисуем текст сообщения
}

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
    drawStars(); // Рисуем звезды

    if (!gameStarted) {
        drawStartMessage(); // Рисуем начальное сообщение, если игра не началась
    } else if (gameOver) {
        drawGameOverMessage(); // Рисуем сообщение об окончании игры
    } else {
        drawSpaceship(); // Рисуем корабль
        drawAsteroids(); // Рисуем астероиды
        drawScore(); // Рисуем счет
        updateSpaceship(); // Обновляем состояние корабля
        updateAsteroids(); // Обновляем состояние астероидов
    }

    requestAnimationFrame(gameLoop); // Запускаем следующий кадр
}

// Обработчик события нажатия клавиши
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true; // Устанавливаем флаг начала игры
        } else if (gameOver) {
            document.location.reload(); // Перезагружаем страницу для начала новой игры
        } else {
            spaceship.dy = spaceship.jumpStrength; // Применяем силу прыжка
        }
    }
});

// Создаем новые астероиды каждые 1500 миллисекунд (2 раза чаще)
setInterval(createAsteroid, 500);

// Запускаем главный игровой цикл
gameLoop();