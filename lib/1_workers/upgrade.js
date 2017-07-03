/*jshint -W008 */
//// UPGRADECONTROLLER PLUS ////
Creep.prototype.upgrade = function() {
  if (this.memory.jobs.upgrade) {
    switch (this.upgradeController(Game.getObjectById(this.memory.jobs.upgrade))) {
      case 0:
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
        if (!this.upgradeAura()) {
          //set move
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
        return Memory.emoji.sogood;
    }
  }
  return Memory.emoji.oops + Memory.emoji.upgrade + Memory.emoji.oops;
};
