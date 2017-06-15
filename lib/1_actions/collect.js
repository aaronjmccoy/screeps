/*jshint -W008 */
/// WITHDRAW PLUS ///
Creep.prototype.collect = function () {
 //debrief task first
 Game.getObjectById(this.memory.jobs.collect).debrief();
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.withdraw(Game.getObjectById(this.memory.jobs.collect))) {
 case 0:
  return Memory.emoji.collect;
 case -6:
 case -7:
 case -10:
  //we need to clear the creep memory to completely remove the bad id
  this.deleteAssignment('collect');
  //assign a new task
  if (getTasksArray('collect').length) {
   this.assignTask('collect');
   //attempt to collect again
   this.collect();
   return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
  } else {
   //if there are no tasks in the collect
   if (_.includes(this.body, WORK)) {
    //if the creep can mine do it
    this.mine();
   } else {
    //otherwise attempt to sweep
    this.sweep();
   }
   return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
  }
  return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
 case -8:
  //creep is full
  this.memory.state = 1;
  return Memory.emoji.frog;
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.collect), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#eeff99',
    lineStyle: 'dashed',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji.frog;
 }
};
