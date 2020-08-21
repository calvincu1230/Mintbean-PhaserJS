import Phaser from "phaser";
import background from "../../src/assets/background.png";
import pidgey from "../../src/assets/pidgey.gif";
import pokeball from "../../src/assets/pokeball.png"
import { gameOptions } from "../utils";

let player;
let scoreText;
let score = 0;
let bestScore = localStorage.getItem(gameOptions.localStorageBestScore) === null ? 0 : localStorage.getItem(gameOptions.localStorageBestScore);
let bestScoreText;
let obstacles;
let counter = 0;

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: 'game' });
  },
  preload: function preload() {
    this.load.image("background", background);

    this.load.spritesheet('pidgey', pidgey, {
      frameWidth: 75,
      frameHeight: 75
    });

    this.load.image("pokeball", pokeball); // CHANGE when new image is used
  },
  create: function create() {
    const { height, width } = this.game.canvas;

    // sets background image as a sprite with start pos (mid) and size, allowing it to be scrolled
    this.background = this.add.tileSprite(width / 2, height / 2, width, height, "background");

    // sets text on screen to provide a constant score  update
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '28px', fill: '#000' });
    bestScoreText = this.add.text(16, 40, ` Best: ${ bestScore }`, { fontSize: '28px', fill: '#000' });

    // adds spacebar to var, allowing listener/event to be attached
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // player will jump when pressed
    this.spacebar.on('down', this.jump, this);

    // need to change this, as it creates all at once and I need to add initial individually for dif positions
    obstacles = this.physics.add.group(); 

    // will be positions in gameOptions arrays for difficulty
    this.spawnTimerPos = 0;
    this.objSpeedPos = 0;
 
    // build initial obstacles
    this.createObstacles();

    // sets obstacles speed to simulate player movement
    obstacles.setVelocityX(-gameOptions.objSpeeds[this.objSpeedPos]);
    
    // draws players sprite
    player = this.physics.add.sprite(200, 100, "pidgey");
    player.body.gravity.y = gameOptions.fallSpeed; // sets gravity for player to fall at
  },
  
  update: function () {
    const spawnTimer = gameOptions.objSpawnTimers[this.spawnTimerPos];

    // scrolls background sprite
    this.background.tilePositionX += 2;

    // tracks frames for score increases
    counter++;

    // checks if a new difficulty threshold was met
    this.increaseDifficulty();

    // if player hits an obstacle, triggers gameOver
    this.physics.world.collide(player, obstacles, function () {
      this.gameOver();
    }, null, this);

    // if player leaves top or bottom bounds they die
    if (player.y > this.game.canvas.height || player.y < 0) { 
      // may want to put a lose animation
      this.gameOver();
    }

    // iterates objects for rotation and checks if they should be deleted
    obstacles.getChildren().forEach(obstacle => {
      obstacle.rotation += 0.02;
      if (obstacle.y > this.game.canvas.height + 100|| obstacle.y < -100) {
        // obstacle is out of bounds so destroy it
        obstacle.destroy();
      }
    })

    if (counter % 20 === 0) { // updates score every 20 renders of gameplay
      score += 10;
      if (score > bestScore) {
        bestScore = score;
        bestScoreText.setText(' Best: ' + bestScore);
      }
      scoreText.setText('Score: ' + score);
    }

    if (counter >= spawnTimer) { // will be used to control spawns of new obstacles
      counter = 0;
      this.createObstacles();
    }
  },

  gameOver() {
    localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));
    score = 0;
    this.scene.start('overscreen');
  },

  jump() {
    player.body.velocity.y = -gameOptions.jumpBurst;
  },

  createObstacles() {
    const { height, width } = this.game.canvas;
    const obstacleSpeed = gameOptions.objSpeeds[this.objSpeedPos];
    // this.obstacleArray.push(
    obstacles.create(width, 0, 'pokeball')
      .setBounce(1, 1)
      .setVelocityY(this.genRandNum());

    // this.obstacleArray.push(
    obstacles.create(width, height, 'pokeball')
      .setBounce(1, 1)
      .setVelocityY(-this.genRandNum());

    obstacles.setVelocityX(-obstacleSpeed);
  },

  increaseDifficulty() {
    if (this.spawnTimerPos > 2) {
      this.objSpeedPos = 1;
      if (score > 900) this.objSpeedPos = 2;
      return;
    } else if (score >= 200 && score < 400) {
      this.spawnTimerPos = 1;
    } else if (score >= 400 && score < 600) {
      this.spawnTimerPos = 2;
    } else if (score >= 600 && score < 800) {
      this.spawnTimerPos = 3;
    }
  },

  genRandNum(){
    return 100 + Math.random() * 200; 
  }
});