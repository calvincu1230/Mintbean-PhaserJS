import Phaser from "phaser";

let graphics;
let cursors;

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: 'overscreen' });
  },
  create: function(data) {
    this.finalScore = data.score;
    cursors = this.input.keyboard.createCursorKeys();

    graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 800, 600);

    this.add.text(225, 175, "Final Score: " + this.finalScore, { fontSize: "40px" });
    this.add.text(285, 275, "You got caught!", { fontSize: "24px" });
    this.add.text(225, 325, "Press space to try again!", { fontSize: "24px" })
  },
  update: function () {

    if (cursors.space.isDown) {
      this.scene.start('mainmenu');
    }
  }
})