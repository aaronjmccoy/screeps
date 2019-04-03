/* jshint -W008 */
//// ATTACK PLUS
Creep.prototype.whack = function() {
  if (this.memory.tasks.whack) {
    switch (this.rangedAttack(Game.getObjectById(this.memory.tasks.whack))) {
      case 0:
        //CM.set(this.pos.x, this.pos.y, 255);
        //this.move(Math.random() * (8 - 1) + 1);
        //no need to clear memory for upgrade, controller is permanent
        return Memory.emoji.upgrade;
      case - 9:
        //set move
        
        this.moveTo(Game.getObjectById(this.memory.tasks.whack), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffffff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
    switch (this.attack(Game.getObjectById(this.memory.tasks.whack))) {
      case 0:
        //CM.set(this.pos.x, this.pos.y, 255);
        //this.move(Math.random() * (8 - 1) + 1);
        //no need to clear memory for upgrade, controller is permanent
        return Memory.emoji.upgrade;
      case - 9:
        //set move
        
        this.moveTo(Game.getObjectById(this.memory.tasks.whack), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffffff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
    return Memory.emoji.whack;
    }
  return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
};
