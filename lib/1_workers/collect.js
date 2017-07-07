/*jshint -W008 */
/// WITHDRAW PLUS ///
Creep.prototype.collect = function() {
  if (this.memory.jobs.collect) {
    switch (this.withdraw(Game.getObjectById(this.memory.jobs.collect), RESOURCE_ENERGY)) {
      case 0:
        return Memory.emoji.collect;
      case -9:
      if(!this.collectAura()){
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.jobs.collect), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#eeff99',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
          },
          costCallback: CM
        });
        return Memory.emoji.hop;
      }else{
        return Memory.emoji.sogood;
      }
    }
  }
  return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
};
