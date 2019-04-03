/* jshint -W008 */
//// BUILD PLUS
Creep.prototype.defend = function() {
  

    this.moveTo(Game.getObjectById(this.memory.tasks.defend), {
      visualizePathStyle: {
        fill: 'transparent',
        stroke: '#ff0000',
        lineStyle: 'solid',
        strokeWidth: .15,
        opacity: .4
      }
    });


  return Memory.emoji.oops;
};
