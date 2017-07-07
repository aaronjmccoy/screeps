/*jshint -W008 */
//// REPAIR PLUS ////
Creep.prototype.fix = function() {
  if (this.memory.jobs.fix) {
    switch (this.repair(Game.getObjectById(this.memory.jobs.fix))) {
      case 0:
        return Memory.emoji.fix;
      case -9:
        if (!this.fixAura()) {
          //set move
          CM.set(this.pos.x, this.pos.y, 0);
          this.moveTo(Game.getObjectById(this.memory.jobs.fix), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#ffaaaa',
              lineStyle: 'solid',
              strokeWidth: .15,
              opacity: .1
            }
          });
          return Memory.emoji.fix;
        }
        return Memory.emoji.sogood;
    }
  }
  return Memory.emoji.oops + Memory.emoji.fix + Memory.emoji.oops;
};
