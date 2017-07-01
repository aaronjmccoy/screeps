/*jshint -W008 */
//// ATTACK PLUS ////
Creep.prototype.whack = function () {
 //debrief task first
 if (!this.memory.jobs.whack) {
  this.assignTask('whack');
 }
 try {
  Game.getObjectById(this.memory.jobs.whack).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.whack.tasks.length) {
   this.manualDelete('whack', this.memory.whack);
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.attack(Game.getObjectById(this.memory.jobs.whack))) {
 case 0:
  //clear id from room's task set
  Game.getObjectById(this.memory.jobs.whack).deleteTask('whack');
  return Memory.emoji.whack;
 case -7:
  //invalid target
  Game.getObjectById(this.memory.jobs.whack).deleteTask('whack');
  //we also need to clear the assignment
  this.deleteAssignment('whack');
  //last, we have to decide if we should assign a new task
  if (getTasksArray('whack').length) {
   this.assignTask('whack');
   return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
  } else {
   this.eat();
   return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
  }
  return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.whack), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#ff0000',
    lineStyle: 'solid',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji.whack;
 case -12:
  //if for any reason the wrong creep is in the build workers
  this.deleteAssignment('whack');
  this.deleteWorker('whack');
  return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
 }
};
