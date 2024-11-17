let score = 0;
let isGameOver = false;
let timeLeft = 60; // 游戏时间设置为60秒
const surfer = document.getElementById('surfer');
const obstacle = document.getElementById('obstacle');
const shark = document.getElementById('shark');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameArea = document.getElementById('gameArea');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', startGame);

function moveSurfer(direction) {
    if (isGameOver) return;

    const surferPosition = parseInt(window.getComputedStyle(surfer).getPropertyValue('left'));
    if (direction === 'left' && surferPosition > 0) {
        surfer.style.left = surferPosition - 20 + 'px';
    } else if (direction === 'right' && surferPosition < 260) {
        surfer.style.left = surferPosition + 20 + 'px';
    }
}

function generateObstacle() {
    let obstacleType = Math.random() < 0.5 ? 'rock' : 'shark'; // 随机选择障碍物类型
    let obstacleElement = obstacleType === 'rock' ? obstacle : shark;

    obstacleElement.style.left = Math.random() * 250 + 'px'; // 随机位置
    obstacleElement.style.top = '-50px'; // 从游戏区域上方开始
    obstacleElement.style.display = 'block'; // 显示障碍物

    let fallInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(fallInterval);
            return;
        }

        let obstacleTop = parseInt(window.getComputedStyle(obstacleElement).getPropertyValue('top'));
        if (obstacleTop > 500) {
            // 如果障碍物已经离开屏幕底部，重新生成障碍物
            score++;
            scoreDisplay.innerText = '得分: ' + score;
            obstacleElement.style.top = '-50px'; // 重置障碍物位置
            obstacleElement.style.display = 'none'; // 隐藏障碍物
            generateObstacle(); // 生成新的障碍物
        } else {
            obstacleElement.style.top = obstacleTop + 5 + 'px'; // 向下移动
        }

        // 检查碰撞
        if (obstacleTop > 450 && obstacleTop < 500 && 
            parseInt(obstacleElement.style.left) >= surfer.offsetLeft && 
            parseInt(obstacleElement.style.left) <= surfer.offsetLeft + 40) {
            clearInterval(fallInterval);
            alert('游戏结束！你的得分是: ' + score);
            isGameOver = true;
        }
    }, 100);
}

function startGame() {
    score = 0;
    timeLeft = 60;
    isGameOver = false;
    scoreDisplay.innerText = '得分: ' + score;
    timerDisplay.innerText = '剩余时间: ' + timeLeft + '秒';
    startButton.style.display = 'none'; // 隐藏开始按钮
    generateObstacle();
    setInterval(generateObstacle, 2000); // 每2秒生成一个新障碍物

    const timerInterval = setInterval(() => {
        if (timeLeft <= 0 || isGameOver) {
            clearInterval(timerInterval);
            isGameOver = true;
            alert('游戏结束！你的得分是: ' + score);
            startButton.style.display = 'block'; // 显示开始按钮
        } else {
            timerDisplay.innerText = '剩余时间: ' + timeLeft + '秒';
            timeLeft--;
        }
    }, 1000);
}

// 处理键盘事件
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveSurfer('left');
    } else if (event.key === 'ArrowRight') {
        moveSurfer('right');
    }
});

// 处理触摸事件
gameArea.addEventListener('touchstart', (event) => {
    const touchX = event.touches[0].clientX; // 获取触摸的 X 坐标
    const gameAreaWidth = gameArea.clientWidth;

    if (touchX < gameAreaWidth / 2) {
        // 左半边屏幕
        moveSurfer('left');
    } else {
        // 右半边屏幕
        moveSurfer('right');
    }
});
