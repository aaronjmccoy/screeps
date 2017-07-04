/*jshint -W008 */
//// HEAL PLUS ////
Creep.prototype.expand = function() {
  if (this.memory.jobs.expand) {
    switch (this.claim(Game.getObjectById(this.memory.jobs.expand))) {
      case 0:
        this.memory.room = this.room.name;
        return Memory.emoji.expand;
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
  return Memory.emoji.oops+Memory.emoji.expand+Memory.emoji.oops;
};
