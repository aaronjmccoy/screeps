/* jshint -W008 */
//// RESERVE PLUS
Creep.prototype.squat = function () {
  //console.log('Attempting to squat lock to '+Memory.rooms[this.memory.room].children[1]);
  //this.memory.squatTarget = (Memory.rooms[this.memory.room].children[1]);
  //console.log('manual squat: '+this.memory.room+' : '+this.memory.squatTarget)
  if (this.memory.tasks.squat) {
    this.memory.squatTarget = Game.getObjectById(this.memory.tasks.squat).pos.roomName;
    if (this.reserveController(Game.getObjectById(this.memory.tasks.squat)) == 0) {
      this.memory.squatLock = this.memory.tasks.squat;
      this.signController(Game.getObjectById(this.memory.tasks.squat), "Ribbit");
      return Memory.emoji.frog;
    } else {
      //set move
      //console.log(JSON.stringify(Memory.rooms[this.memory.squatTarget].controller.pos));
      this.attackController(Game.getObjectById(this.memory.tasks.squat));
      if (this.memory.squatTarget) {
        // console.log(this.name);
        // console.log(this.memory.squatTarget);
        // console.log(Memory.rooms[this.memory.squatTarget]);
        this.moveTo(new RoomPosition(Memory.rooms[this.memory.squatTarget].controller.pos.x, Memory.rooms[this.memory.squatTarget].controller.pos.y, this.memory.squatTarget), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffafaf',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .5
          }
        });
      } else {
        //console.log(Memory.rooms[Memory.rooms[this.memory.room].children[0]].squatter.squat);
        //console.log(Memory.rooms[Memory.rooms[this.memory.room].children[0]].squatter.squat.includes(this.memory.tasks.squat));
        this.memory.squatTarget = Memory.rooms[Memory.rooms[this.memory.room].children[0]].squatter.squat.includes(this.memory.tasks.squat) ? Memory.rooms[this.memory.room].children[0] : Memory.rooms[this.memory.room].children[1];
        //console.log('set target for squat after fail: '+ this.memory.squatTarget +' for creep whose home is room '+this.memory.room);
      }
      return Memory.emoji.sogood;
    }
  }
  return false;
};
