/* jshint -W008 */
//// UPGRADECONTROLLER PLUS
Creep.prototype.upgrade = function() {
  if (this.memory.tasks.upgrade) {
    switch (this.upgradeController(Game.getObjectById(this.memory.tasks.upgrade))) {
      case 0:
        //CM.set(this.pos.x, this.pos.y, 255);
        //this.move(Math.random() * (8 - 1) + 1);
        //no need to clear memory for upgrade, controller is permanent
        return Memory.emoji.upgrade;
      case - 9:
        //set move
        
        this.moveTo(Game.getObjectById(this.memory.tasks.upgrade), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffffff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
  }
  return Memory.emoji.oops + Memory.emoji.upgrade + Memory.emoji.oops;
};
