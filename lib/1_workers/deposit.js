/*jshint -W008 */
/// TRANSFER PLUS ///
Creep.prototype.deposit = function() {
  if (this.memory.jobs.deposit) {
    switch (this.transfer(Game.getObjectById(this.memory.jobs.deposit), RESOURCE_ENERGY)) {
      case 0:
        return Memory.emoji.deposit;
      case -9:
        //set move
        this.moveTo(Game.getObjectById(this.memory.jobs.deposit), {
          reusePath: 10,
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#eecc00',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.frog;
    }
  }
  return Memory.emoji.oops + Memory.emoji.deposit + Memory.emoji.oops;
};
