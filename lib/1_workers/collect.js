/*jshint -W008 */
/// WITHDRAW PLUS ///
Creep.prototype.collect = function() {
  if (this.memory.jobs.collect) {
    //debrief only removes task from memory if appropriate and does not affect creep memory
    switch (this.withdraw(Game.getObjectById(this.memory.jobs.collect), RESOURCE_ENERGY)) {
      case 0:
        return Memory.emoji.collect;
      case -9:
        //set move
        this.moveTo(Game.getObjectById(this.memory.jobs.collect), {
          reusePath: 1,
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#eeff99',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
          }
        })
        return Memory.emoji.hop;
    }
  }
  return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
};
