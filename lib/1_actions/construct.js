//// BUILD PLUS ////
Creep.prototype.construct = function () {
 //debrief task first
 Game.getObjectById(this.memory.jobs.construct).debrief();
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.build(Game.getObjectById(this.memory.jobs.construct))) {
 case 0:
  return Memory.emoji['construct'];
 case -6:
  //this should never occur but it's good to have preventative measures
  this.memory.state = 0;
 case -7:
  //if we get a -7 it means no target found
  //since construct tasks are pulled directly from Game.constructionSites we know our construct tasks are valid
  //this means the site was built successfully and we need to remove the task
  Game.getObjectById(this.memory.jobs.construct).deleteTask('construct');
  //we also need to clear the assignment
  this.deleteAssignment('construct');
  //last, we have to decide if we should assign a new task
  if (getTasksArray('construct').length) {
   this.assignTask('construct');
   this.construct();
   return Memory.emoji['oops'] + Memory.emoji['construct'] + Memory.emoji['oops'];
  } else {
   this.upgrade();
   return Memory.emoji['oops'] + Memory.emoji['construct'] + Memory.emoji['oops'];
  }
  return Memory.emoji['oops'] + Memory.emoji['construct'] + Memory.emoji['oops'];
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.construct), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#aacc66',
    lineStyle: 'solid',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji['frog'];
 case -12:
  //if for any reason the wrong creep is in the construct workers
  this.deleteAssignment('construct');
  this.deleteWorker('construct');
  return Memory.emoji['oops'] + Memory.emoji['construct'] + Memory.emoji['oops'];
 case -14:
  //remove the construction site
  Game.getObjectById(this.memory.jobs.construct).remove();
  return Memory.emoji['oops'] + Memory.emoji['construct'] + Memory.emoji['oops'];
 }
}
