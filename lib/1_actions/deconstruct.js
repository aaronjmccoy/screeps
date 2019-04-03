/* jshint -W008 */
//// BUILD PLUS
Creep.prototype.deconstruct = function() {
  if (this.memory.tasks.deconstruct) {
    switch (this.dismantle(Game.getObjectById(this.memory.tasks.deconstruct))) {
      case 0:
        return Memory.emoji.deconstruct;
      case - 9:
        if (!this.deconstructAura()) {
          //set move
          
          this.moveTo(Game.getObjectById(this.memory.tasks.deconstruct), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#ff0000',
              lineStyle: 'solid',
              strokeWidth: .15,
              opacity: .4
            }
          });
          return Memory.emoji.hop;
        } else {
          return Memory.emoji.sogood;
        }

    }
  }
  return Memory.emoji.oops + Memory.emoji.deconstruct + Memory.emoji.oops;
};
