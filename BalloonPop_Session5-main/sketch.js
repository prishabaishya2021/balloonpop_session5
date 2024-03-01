var bg,bg2;
var player,player_img;
var playbutton;
var aboutbutton;
var gameState = "wait";
var bullet,bullet_img, bulletGroup
var balloon, balloonGroup, balloon1_img, balloon2_img, balloon3_img, balloon4_img, balloon5_img;
var score=0;
var health=200, max_health=200;
var life;
var life_img;

function preload(){
    bg=loadImage("assets/balloonpop.gif")
    bg2=loadImage("assets/bg1.jpg")
    player_img=loadImage("assets/gun.png")
    bullet_img=loadImage("assets/bullet.png")
    balloon1_img=loadImage("assets/blueballoon.png")
    balloon2_img=loadImage("assets/purpleballoon.png")
    balloon3_img=loadImage("assets/redballoon.png")
    balloon4_img=loadImage("assets/yellowballoon.png")
    //balloon5_img=loadImage("assets/blackballoon.png")
    life_img=loadImage("assets/life.png")

}

function setup(){
    createCanvas(windowWidth, windowHeight)

    playbutton = createImg("assets/play1.png")
    playbutton.position(460, 510)
    playbutton.size(190, 100)
    playbutton.hide()

    aboutbutton = createImg("assets/about1.png")
    aboutbutton.position(750, 510)
    aboutbutton.size(190, 100)
    aboutbutton.hide()

    player = createSprite(120, 380)
    player.addImage("main", player_img)
    player.visible = false
    player.scale=0.4

    balloonGroup = new Group();

    bulletGroup = new Group();

    life = createSprite(1200, 58);
    life.addImage(life_img);
    life.scale = 0.2;
    life.visible = false;


}

function draw(){

    if (gameState === "wait") {


        background(bg)
        playbutton.show()
        aboutbutton.show()
        //background_music.play();
    }

    aboutbutton.mousePressed(() => {
        playbutton.hide();
        aboutbutton.hide();
        gameState = "about";
    })

    if (gameState == "about") {
        aboutgame();
    }

    playbutton.mousePressed(() => {
        playbutton.hide();
        aboutbutton.hide();
        gameState = "play";
    })

    if (gameState == "play") {
        //background_music.stop();
        background(bg2)
        player.visible = true

        movement()
        spawnBalloons()
        healthlevel1()

        for (var i = 0; i < balloonGroup.length; i++) {
            if (bulletGroup.isTouching(balloonGroup.get(i))) {
                score += 5;
                balloonGroup.get(i).remove()
                bulletGroup.destroyEach()
            }
        }

        for (var i = 0; i < balloonGroup.length; i++) {
            if (player.isTouching(balloonGroup.get(i))) {
                //dieSound.play();
                health -= 20;
                balloonGroup.get(i).remove()
                bulletGroup.destroyEach()
            }
        }

        if (health == 0) {
            //dieSound.play()

            gameState = "gameOver";

        }

        if (gameState == "gameOver") {

            balloonGroup.destroyEach()
            bulletGroup.destroyEach()
            player.visible = false;

            lost();
        }

        if (health > 0 && score >= 50) {

            gameState = "nextlevelinfo"
            bulletGroup.destroyEach()
            balloonGroup.destroyEach()
            player.visible = false
            //checkPointSound.play()

        }

        if (gameState == "nextlevelinfo") {

            nextlevelpopup();

        }
    }


    

    if (gameState == "play" || gameState == "level2" || gameState == "gameOver" || gameState == "nextlevelinfo" || gameState == "win") {
        fill("black");
        textSize(25);
        text("SCORE: " + score, 50, 50);

    }

    drawSprites()

}

function aboutgame() {

    swal({
        title: "About Game === How to Play!!",
        text: "Shoot all the balloons to win!\n Use Arrow keys to move up and down and space bar to shoot.",
        textAlign: "center",
        imageUrl: "assets/balloonpop.gif",
        imageSize: "200x200",
        confirmButtonText: "Let's start",
        confirmButtonColor: "blue",
    },

        function () {
            gameState = "wait"
        }
    )

}

function movement() {

    if (player.y <= 60) {
        player.y = 60
    }

    if (player.y >= 550) {
        player.y = 550
    }

    if (keyDown("UP_ARROW")) {
        player.y = player.y - 5;
    }

    if (keyDown("DOWN_ARROW")) {
        player.y = player.y + 5;
    }

}

function spawnBullets() {

    bullet = createSprite(player.x + 11, player.y-50, 20, 20);
    bullet.addImage(bullet_img);
    bullet.scale = 0.3;
    bullet.velocityX = 40;

    bullet.depth = player.depth;
    player.depth = player.depth + 1;

    bulletGroup.add(bullet);

}

function keyReleased() {
    if (keyCode === 32) {
        //shootSound.play();
        spawnBullets();
    }
}

function spawnBalloons() {

    if (frameCount % 50 == 0) {

        var randy = Math.round(random(80, 600))
        balloon = createSprite(width, randy);
        balloon.scale = 0.3
        balloon.velocityX = -8;

        var randimg = Math.round(random(1, 4))
        switch (randimg) {

            case 1:
                balloon.addImage(balloon1_img)
                balloon.scale = 0.5;
                //balloon.velocityX = -15;
                balloon.setCollider("rectangle", 0, 0, 250, 300)
                break;

            case 2:
                balloon.addImage(balloon2_img)
                balloon.scale = 0.6
                balloon.setCollider("rectangle", 0, 0, balloon.width, balloon.height)
                break;

            case 3:
                balloon.addImage(balloon3_img)
                balloon.scale = 0.4
                balloon.setCollider("rectangle", 0, 0, 250, 300)
                break;

            case 4:
                balloon.addImage(balloon4_img)
                balloon.scale = 0.4
                balloon.setCollider("rectangle", 0, 0, 250, 300)
                break;

            case 5:
                balloon.addImage(balloon5_img)
                balloon.scale = 0.15
                balloon.setCollider("rectangle", 0, 0, 250, 300)
                break;

            default: break;

        }

        balloon.depth = player.depth;
        player.depth = player.depth + 1;

        balloonGroup.add(balloon);

    }

}

function healthlevel1() {

    life.visible = true;

    stroke("black")
    strokeWeight(2)
    noFill()
    rect(1200, 50, max_health, 20)

    noStroke()
    fill("red")
    rect(1200, 50, health, 20)

}

function lost() {

    swal({
        title: "You LOST!",
        imageUrl: "assets/gameover.jpg",
        imageSize: "300x300",
        confirmButtonText: "Try Again",
        confirmButtonColor: "purple",
    },
        function () {
            window.location.reload();

        }

    )

}

function nextlevelpopup() {

    swal({
        title: "HURRAYY!! You have reached Level 2",
        text: "You defeated them! \n Make a score of 100 to win!",
        imageUrl: "assets/levelup.gif",
        imageSize: "200x200",
        confirmButtonText: "Let's Win!",
        confirmButtonColor: "purple",
    },

        function () {
           
            gameState = "level2"

        }

    )

}