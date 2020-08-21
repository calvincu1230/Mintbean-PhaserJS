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

    this.add.text(200, 100, "Pidgey Escape", { fontSize: '50px' })
    this.add.text(200, 450, "Press space to start", { fontSize: "30px" });
  },
  update: function () {

    if (cursors.space.isDown) {
      this.scene.start('game');
    }
  }
})