/*jshint -W008 */
//// BUILD PLUS ////
Creep.prototype.construct = function() {
  if (this.memory.jobs.construct) {
    switch (this.build(Game.getObjectById(this.memory.jobs.construct))) {
      case 0:
        return Memory.emoji.construct;
      case -9:
      if(!this.constructAura()){
        //set move
        this.moveTo(Game.getObjectById(this.memory.jobs.construct), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#aacc66',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
      }else{
        return Memory.emoji.sogood;
      }

    }
  }
  return Memory.emoji.oops + Memory.emoji.construct + Memory.emoji.oops;
};
