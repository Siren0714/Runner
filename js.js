var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var gameTime = 0; 

//Игрок
var player = {x: 50, y: canvas.height - 130, height: 80, width: 80, xSpeed: 0, ySpeed: 0}

//Функция для блока
function Block(x, y, width, height, xSpeed){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xSpeed = xSpeed;
}

//Платформа
function Platform(x, y, width, height, xSpeed){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xSpeed = xSpeed;
}

//Облако
function Cloud(x, y, width, height, xSpeed){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xSpeed = xSpeed;
}

//Отрисовка блока
function drawBlock(block){
    plat = new Image();
    plat.src = "скала_2.png";
    context.drawImage(plat, block.x, block.y, block.width, block.height);
}

//Отрисовка облака
function drawCloud(block){
    c = new Image();
    c.src = "cload.png";
    context.drawImage(c, block.x, block.y, block.width, block.height);
}

//Отрисовка платформы
function drawPlatform(block){
    img = new Image();
    img.src = "phot.png";
    context.drawImage(img, block.x, block.y, block.width, block.height);
}

//Создание врага
var enemy = new Block(canvas.width, canvas.height - 150, 50, 100, -5);

//Создание двух платформ
var platform_1 = new Platform(0, canvas.height - 50, canvas.width, 50, -3);
var platform_2 = new Platform(canvas.width, canvas.height - 50, canvas.width, 50, -3);

//Создание облака
var cloud = new Cloud(canvas.width * 3, 50, 200, 100, -5);

//Отрисовка
function draw(){
    //Очистка предыдущих движений
    context.clearRect(0, 0, canvas.width, canvas.height)

    //Отрисовка врага
    drawBlock(enemy);

    //Отрисовка персонажа
    pic = new Image();
    pic.src = "Rem.png";
    context.drawImage(pic, player.x, player.y, player.width, player.height);

    //Отрисовка платформы
    drawPlatform(platform_1);
    drawPlatform(platform_2);

    //Отрисовка времени игры
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillText('Пройдено: ' + gameTime, 10, 30);

    //Отрисовка облака
    drawCloud(cloud);
}

//Движения в игре
function updateGame(){
    //Алгоритм движения персонажа
    player.x += player.xSpeed;
    player.y += player.ySpeed;

    //Персонаж не падает за платформой
    if (player.y >= canvas.height - player.height - 50){
        player.xSpeed = 0;
        player.ySpeed = 0;
    }

    //Цикличное поле
    if (player.x > canvas.width){
        player.x = player.height * -1;
    }
    if (player.x < player.height * -1){
        player.x = canvas.width;
    }

    //Движение врага
    enemy.x += enemy.xSpeed;

    //Телепорт врага
    if (enemy.x < 0 - enemy.width){
        enemy.x = canvas.width;

        //Присваиваем новые данные
        enemy.width = Math.floor(Math.random() * 100) + 50;
        enemy.height = Math.floor(Math.random() * 200) + 50;
        enemy.y = canvas.height - 50 - enemy.height;
        enemy.xSpeed = (Math.floor(Math.random() * 5) + 3) * -1;
    }

    //Движение платформы
    platform_1.x += platform_1.xSpeed;
    platform_2.x += platform_2.xSpeed;

    //Телепорт платформы
    if (platform_1.x < 0 - platform_1.width){
        platform_1.x = platform_2.width - 10
    }
    if (platform_2.x < 0 - platform_2.width){
        platform_2.x = platform_1.width - 10
    }

    cloud.x += cloud.xSpeed;

    gameTime ++;
}

//Отпускание кнопки
function onKeyRelease(event){
    const key = event.key.toLowerCase();
    if (key === 'a' || key === 'd'){
        player.xSpeed = 0;
    }
    if (key === ' '){
        player.ySpeed = 10;
    }
}

window.addEventListener('keyup', onKeyRelease)

//Проверка на касание между игроком и врагом
function checkColiision(){
    if (player.x + player.width > enemy.x && 
        player.x < enemy.x + enemy.width && 
        player.y + player.height > enemy.y && 
        player.y < enemy.y + enemy.height){
            //Запуск модального окна
            modal.style.display = "block";
            document.getElementById("message").innerHTML = "Игра окончена! <br/> Пройдено: " + gameTime * factor + " м";

            startTimer();
    }
}

var factor = 1;

//Проверка на касание между игроком и облаком
function checkColiisionCloud(){
    if (player.x + player.width > cloud.x && 
        player.x < cloud.x + cloud.width && 
        player.y + player.height > cloud.y && 
        player.y < cloud.y + cloud.height){
            factor = 2;
    }
}

var modal = document.getElementById("myModal");

//Функция, которая будет выводить окно, пока мы не закроем его
window.onclick = function(event){
    if (event.target === modal){
        modal.style.display = "none";
        location.reload();
    }
}

//Нажатие на кнопку
function onKeyPrees(event){
    const key = event.key.toLowerCase();
    if (key === 'a'){
        player.xSpeed = -10;
    }
    if (key === 'd'){
        player.xSpeed = 10;
    }
    if (key === ' '){
        player.ySpeed = -10;
    }
}

window.addEventListener('keydown', onKeyPrees)

function tick(){
    checkColiisionCloud();
    checkColiision();
    updateGame();
    draw();
    window.setTimeout("tick()", 1000/60);
}

tick();