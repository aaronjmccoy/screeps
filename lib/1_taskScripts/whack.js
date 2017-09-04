/*jshint -W008 */
//// ATTACK PLUS ////
Creep.prototype.whack = function() {
  if (this.memory.jobs.whack) {
    switch (this.attack(Game.getObjectById(this.memory.jobs.whack))) {
      case 0:
        //clear id from room's task set
        Game.getObjectById(this.memory.jobs.whack).deleteTask('whack');
        return Memory.emoji.whack;
      case -9:
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.jobs.whack), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ff0000',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.whack;
    }
  }
  return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
};
