/*jshint -W008 */
//// UPGRADECONTROLLER PLUS ////
Creep.prototype.upgrade = function() {
  if (this.memory.jobs.upgrade) {
    this.signController("Ribbit");
    switch (this.upgradeController(Game.getObjectById(this.memory.jobs.upgrade))) {
      case 0:
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.jobs.upgrade), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffffff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        //no need to clear memory for upgrade, controller is permanent
        return Memory.emoji.upgrade;
      case -9:
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.jobs.upgrade), {
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
