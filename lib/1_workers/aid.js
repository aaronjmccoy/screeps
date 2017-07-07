/*jshint -W008 */
//// HEAL PLUS ////
Creep.prototype.aid = function() {
  if (this.memory.jobs.aid) {
    switch (this.heal(Game.getObjectById(this.memory.jobs.aid))) {
      case 0:
        return Memory.emoji.aid;
      case -9:
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.jobs.aid), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffaaaa',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
  }
  return Memory.emoji.oops+Memory.emoji.aid+Memory.emoji.oops;
};
