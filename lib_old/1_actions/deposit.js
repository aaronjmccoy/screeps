/*jshint -W008 */
/// TRANSFER PLUS ///
Creep.prototype.deposit = function () {
 //debrief task first
 if (!this.memory.jobs.deposit) {
  this.assignTask('deposit');
 }
 try {
  Game.getObjectById(this.memory.jobs.deposit).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.deposit.tasks.length) {
   //console.log(this.name);
   this.manualDelete('deposit', this.memory.jobs.deposit);
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.transfer(Game.getObjectById(this.memory.jobs.deposit), RESOURCE_ENERGY)) {
 case 0:
  return Memory.emoji.deposit;
 case -7:
 case -8:
 case -10:
  //assign a new task
  if (getTasksArray('deposit', this.room).length) {
   this.assignTask('deposit');
   //attempt to deposit again
   return Memory.emoji.oops + Memory.emoji.deposit + Memory.emoji.oops;
  } else {
   //if there are no tasks in the deposit set
   if (_.includes(this.body, WORK)) {
    //if the creep can upgrade do it
    return this.upgrade();
   } else {
    //otherwise attempt to eat
    return this.eat();
   }
   return Memory.emoji.oops + Memory.emoji.deposit + Memory.emoji.oops;
  }
  return Memory.emoji.oops + Memory.emoji.deposit + Memory.emoji.oops;
 case -6:
  //creep is empty
  this.memory.state = 0;
  return Memory.emoji.frog;
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.deposit), {
   reusePath: 10,
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
