/*jshint -W008 */
//// RENEWCREEP PLUS ////
Creep.prototype.eat = function() {
  if (this.memory.jobs.eat) {
    switch (Game.getObjectById(this.memory.jobs.eat).renewCreep(this)) {
      case 0:
        return Memory.emoji.eat;
      case -9:
        //set move
        this.moveTo(Game.getObjectById(this.memory.jobs.eat), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#00eeff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
  }
  return Memory.emoji.oops + Memory.emoji.eat + Memory.emoji.oops;
};
