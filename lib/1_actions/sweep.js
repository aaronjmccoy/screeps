/// PICKUP PLUS ///
Creep.prototype.sweep = function () {
 //debrief first
 Game.getObjectById(this.memory.jobs.sweep).debrief('sweep');
 //now we can switch
 switch (this.pickup(Game.getObjectById(this.memory.jobs.sweep))) {
 case 0:
  //memory is already cleared
  return Memory.emoji['sweep'];
 case -7:
 case -8:
  //we need to clear the assignment from the assignment list as well as the job list in room memory
  this.deleteAssignment('sweep');
  //assign a new task
  if (getTasksArray('sweep').length) {
   this.assignTask('sweep');
   //attempt to sweep again
   this.sweep();
   return Memory.emoji['oops'] + Memory.emoji['sweep'] + Memory.emoji['oops'];
  } else {
   //if there are no tasks in the sweep set
   if (_.includes(this.body, WORK)) {
    //if the creep can upgrade do it
    this.upgrade();
   } else {
    //otherwise attempt to eat
    this.eat();
   }
   return Memory.emoji['oops'] + Memory.emoji['sweep'] + Memory.emoji['oops'];
  }
  return Memory.emoji['oops'] + Memory.emoji['sweep'] + Memory.emoji['oops'];
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
  return Memory.emoji['frog'];
 }
}
