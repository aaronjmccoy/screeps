/*jshint -W008 */
//// REPAIR PLUS ////
Creep.prototype.fix = function () {
 //debrief task first
 if (!this.memory.jobs.fix) {
  this.assignTask('fix');
 }
 try {
  Game.getObjectById(this.memory.jobs.fix).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.fix.tasks.length) {
   Game.getObjectById(this.memory.jobs.construct).deleteTask('fix');
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.repair(Game.getObjectById(this.memory.jobs.fix))) {
 case 0:
  return Memory.emoji.fix;
 case -6:
  //this should never occur but it's good to have preventative measures
  this.memory.state = 0;
  return Memory.emoji.frog;
 case -7:
  //invalid target, remove room memory
  Game.getObjectById(this.memory.jobs.fix).deleteTask('fix');
  //we also need to clear the assignment on the creep memory
  this.deleteAssignment('fix');
  //last, we have to decide if we should assign a new task
  if (getTasksArray('fix').length) {
   this.assignTask('fix');
   return Memory.emoji.oops + Memory.emoji.fix + Memory.emoji.oops;
  } else {
   this.memory.state = 0;
  }
  return Memory.emoji.oops + Memory.emoji.fix + Memory.emoji.oops;
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.fix), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#ffaaaa',
    lineStyle: 'solid',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji.fix;
 case -12:
  //if for any reason the wrong creep is in the build workers
  this.deleteAssignment('fix');
  this.deleteWorker('fix');
  return Memory.emoji.oops + Memory.emoji.fix + Memory.emoji.oops;
 }
};
