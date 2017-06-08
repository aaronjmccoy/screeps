//// UPGRADECONTROLLER PLUS ////
Creep.prototype.upgrade = function () {
 switch (this.upgradeController(Game.getObjectById(this.memory.jobs.upgrade))) {
 case 0:
  //no need to clear memory for upgrade, controller is permanent
  return Memory.emoji['upgrade'];
 case -6:
  //this should never occur but it's good to have preventative measures
  this.memory.state = 0;
  return Memory.emoji['oops'] + Memory.emoji['upgrade'] + Memory.emoji['oops'];
 case -7:
  //we need to clear the assignment
  this.deleteAssignment('upgrade');
  //reset task assignment
  if (getTasksArray('upgrade').length) {
   //task is there
   this.assignTask('upgrade');
   //try again
   this.upgrade();
  }
  return Memory.emoji['oops'] + Memory.emoji['upgrade'] + Memory.emoji['oops'];
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.build), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#ffffff',
    lineStyle: 'solid',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji['frog'];
 }
}
