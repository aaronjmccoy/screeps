/* jshint -W008 */
//// RENEWCREEP PLUS
Creep.prototype.eat = function() {
  this.depositAura();

  this.eatAura();
  //any creep checking to eat with less hp thean 1000 should eat then
  if (this.ticksToLive < 1000 && this.role !== 'squatter') {
    this.memory.hungry = true;
  }
  if (this.memory.tasks.eat) {
    if (Game.getObjectById(this.memory.tasks.eat).renewCreep(this) === 0) {
      return Memory.emoji.eat;
    } else {
      //if hungry eat
      if (this.memory.hungry) {
        //set move
        
        this.moveTo(Game.getObjectById(this.memory.tasks.eat), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#00eeff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
        //if not go back to a starting point
      } else {
        if (this.memory.role == 'toad') {
          this.moveTo(Game.getObjectById(this.memory.tasks.mine), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#eeff99',
              lineStyle: 'solid',
              strokeWidth: .15,
              opacity: .1
            }
          });
          return Memory.emoji.hop;
        } else {
          this.moveTo(Game.rooms[this.memory.room].storage);
          return Memory.emoji.hop;
        }
      }
    }
    return this.moveTo(Game.getObjectById(this.memory.tasks.eat), {
      visualizePathStyle: {
        fill: 'transparent',
        stroke: '#00eeff',
        lineStyle: 'solid',
        strokeWidth: .15,
        opacity: .1
      }
    });
  }
};
