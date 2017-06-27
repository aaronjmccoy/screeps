/*jshint -W008 */
//// HEAL PLUS ////
Creep.prototype.aid = function () {
 //debrief task first
 if (!this.room.memory.jobs.aid.tasks.indexOf(this.memory.jobs.aid)) {
  this.assignTask('aid');
 }
 try {
  Game.getObjectById(this.memory.jobs.aid).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.aid.tasks.length) {
   Game.getObjectById(this.memory.jobs.aid).deleteTask('aid');
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.heal(Game.getObjectById(this.memory.jobs.aid))) {
 case 0:
  return Memory.emoji.aid;
 case -7:
  //invalid target, remove room memory
  Game.getObjectById(this.memory.jobs.aid).deleteTask('aid');
  //we also need to clear the assignment on the creep memory
  this.deleteAssignment('aid');
  //last, we have to decide if we should assign a new task
  if (getTasksArray('aid').length) {
   this.assignTask('aid');
   return Memory.emoji.oops + Memory.emoji.aid + Memory.emoji.oops;
  } else {
   return this.eat();
  }
  return Memory.emoji.oops + Memory.emoji.aid + Memory.emoji.oops;
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.aid), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#ffaaaa',
    lineStyle: 'solid',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji.aid;
 case -12:
  //if for any reason the wrong creep is in the build workers
  this.deleteAssignment('aid');
  this.deleteWorker('aid');
  return Memory.emoji.oops + Memory.emoji.aid + Memory.emoji.oops;
 }
};
