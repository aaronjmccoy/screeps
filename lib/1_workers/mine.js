/*jshint -W008 */
//// HARVEST PLUS ////
Creep.prototype.mine = function() {
  if (this.memory.jobs.mine) {
    switch (this.harvest(Game.getObjectById(this.memory.jobs.mine))) {
      case 0:
        return Memory.emoji.mine;
      case -9:
        //set move
        this.moveTo(Game.getObjectById(this.memory.jobs.mine), {
          visualizePathStyle: {
            reusePath: 10,
            fill: 'transparent',
            stroke: '#eeff99',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
  }
  return Memory.emoji.oops + Memory.emoji.mine + Memory.emoji.oops;
};
