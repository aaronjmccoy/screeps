/* jshint -W008 */
/// TRANSFER PLUS /
Creep.prototype.deposit = function() {
  if (this.memory.tasks.deposit) {
    switch (this.transfer(Game.getObjectById(this.memory.tasks.deposit), RESOURCE_ENERGY)) {
      case 0:
        return Memory.emoji.deposit;
      case - 9:
        this.depositAura();
        //set move

        this.moveTo(Game.getObjectById(this.memory.tasks.deposit), {
          reusePath: 5,
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#eecc00',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
          },

        });
        return Memory.emoji.frog;
    }
  }
  this.moveTo(this.room.storage, {
    reusePath: 5,
    ignoreCreeps: false,
    visualizePathStyle: {
      fill: 'transparent',
      stroke: '#eecc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
    },

  });
  return Memory.emoji.sogood;
};
