/*jshint -W008 */
//// RENEWCREEP PLUS ////
Creep.prototype.eat = function() {
  //any creep checking to eat with less hp thean 1400 should eat then
  if (this.ticksToLive < 420) {
    this.memory.hungry = true;
  } else {
    this.memory.hungry = false;
  }

  if (this.memory.tasks.eat) {
    this.transfer(Game.getObjectById(this.memory.tasks.eat), RESOURCE_ENERGY);
    let ate = Game.getObjectById(this.memory.tasks.eat).renewCreep(this);
    if ( ate === 0) {
      return Memory.emoji.eat;
    } else if(ate === -9) {
      //if hungry eat
      if (this.memory.hungry) {
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
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
          this.moveTo(Game.rooms[this.memory.room].terminal);
          return Memory.emoji.hop;
        }
      }
    }else{
      return this.moveTo(Game.rooms[this.memory.room].storage), {
        visualizePathStyle: {
          fill: 'transparent',
          stroke: '#00eeff',
          lineStyle: 'solid',
          strokeWidth: .15,
          opacity: .1
        }
      });
    }
  } else {
    return false;
  }
};
