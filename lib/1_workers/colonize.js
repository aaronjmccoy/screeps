/*jshint -W008 */
//// HEAL PLUS ////
Creep.prototype.colonize = function() {
  if (this.memory.jobs.colonize) {
    switch (this.build(Game.getObjectById(this.memory.jobs.colonize))) {
      case 0:
        this.memory.room = this.room.name;
        return Memory.emoji.colonize;
      case -9:
        //set move
        this.moveTo(Game.getObjectById(this.memory.jobs.colonize), {
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
  return Memory.emoji.oops+Memory.emoji.colonize+Memory.emoji.oops;
};
