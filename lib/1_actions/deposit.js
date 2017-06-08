/// TRANSFER PLUS ///
Creep.prototype.deposit = function () {
 //debrief task first
 Game.getObjectById(this.memory.jobs.deposit).debrief();
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.transfer(Game.getObjectById(this.memory.jobs.deposit))) {
 case 0:
  return Memory.emoji['deposit'];
 case -7:
 case -8:
 case -10:
  //we need to clear the assignment
  this.deleteAssignment('deposit');
  //assign a new task
  if (getTasksArray('deposit').length) {
   this.assignTask('deposit');
   //attempt to deposit again
   this.deposit();
   return Memory.emoji['oops'] + Memory.emoji['deposit'] + Memory.emoji['oops'];
  } else {
   //if there are no tasks in the deposit set
   if (_.includes(this.body, WORK)) {
    //if the creep can upgrade do it
    this.upgrade();
   } else {
    //otherwise attempt to eat
    this.eat();
   }
   return Memory.emoji['oops'] + Memory.emoji['deposit'] + Memory.emoji['oops'];
  }
  return Memory.emoji['oops'] + Memory.emoji['deposit'] + Memory.emoji['oops'];
 case -6:
  //creep is empty
  this.memory.state = 0;
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.deposit), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#eecc00',
    lineStyle: 'dashed',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji['frog'];
 }
}
