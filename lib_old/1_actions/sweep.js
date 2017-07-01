/*jshint -W008 */
/// PICKUP PLUS ///
Creep.prototype.sweep = function () {
 //debrief task first
 if (!this.memory.jobs.sweep) {
  this.assignTask('sweep');
 }
 try {
  Game.getObjectById(this.memory.jobs.sweep).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.sweep.tasks.length) {
   this.manualDelete('sweep', this.memory.sweep);
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.pickup(Game.getObjectById(this.memory.jobs.sweep))) {
 case 0:
  //memory is already cleared
  return Memory.emoji.sweep;
 case -7:
 case -8:
  //we need to clear the assignment from the assignment list as well as the job list in room memory
  this.deleteAssignment('sweep');
  //assign a new task
  if (getTasksArray('sweep', this.room).length) {
   this.assignTask('sweep');
   return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
  } else {
   //if there are no tasks in the sweep set
   if (_.includes(this.body, WORK)) {
    //if the creep can upgrade do it
    return this.upgrade();
   } else {
    //otherwise attempt to eat
    return this.eat();
   }
   return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
  }
  return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.sweep), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#eecc00',
    lineStyle: 'dashed',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji.frog;
 }
};
