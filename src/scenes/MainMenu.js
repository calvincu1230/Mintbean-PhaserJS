import Phaser from "phaser";

let graphics;
let cursors;

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: 'mainmenu' });
  },
  create: function() {
    cursors = this.input.keyboard.createCursorKeys();

    graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 800, 600);

    this.add.text(260, 300, "Press space to start.")
    this.add.text(260, 320, "Press spacebar to fly up.")
    this.add.text(260, 340, "Avoid getting caught by a Pokeball!")
  },
  update: function () {

    if (cursors.space.isDown) {
      this.scene.start('game');
    }
  }
})