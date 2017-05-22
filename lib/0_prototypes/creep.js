//assign task
Creep.prototype.assignTask = function (job) {
 //you know you can get objects by simulated index by getting the keys
 var tasksKeys = Object.keys(this.room.memory.jobs[job].tasks);
 if (!this.room.memory.jobs[job].workers[this.id]) {
  this.room.memory.jobs[job].workers[this.id] = this.id;
 }
 var workersKeys = Object.keys(this.room.memory.jobs[job].workers);
 //if there are actually tasks
 if (tasksKeys.length) {
  console.log('we have ' + workersKeys.length + ' workers and ' + tasksKeys.length + ' ' + job + ' jobs to do');
  //we need to run a different loop depending on the number of workers and tasks
  if (workersKeys.length > tasksKeys.length) {
   console.log('we have more workers than jobs');
   // if we have less tasks than workers we can assign bunch workers to the
   // bottommost task
   for (var w = 0; w < workersKeys.length; w++) {
    //only if the creep id is the one we want
    console.log(this.id + ' being assigned at index ' + w + ' for worker value ' + this.room.memory.jobs[job].workers[workersKeys[w]]);
    if (this.id == this.room.memory.jobs[job].workers[workersKeys[w]]) {
     //console.log(this.id + ' being assigned');
     //if the creep index accesses a job
     if (tasksKeys[w]) {
      //assign job at index i
      console.log('creep with id ' + this.id + ' being assigned to a ' + tasksKeys[w] + ' at index ' + w);
      this.room.memory.jobs[job].assignment[this.id] = tasksKeys[w];
      return this.room.memory.jobs[job].assignment[this.id];
     } else {
      //assign job at index tasks.length-1
      console.log('creep with id ' + this.id + ' being assigned to b ' + tasksKeys[tasksKeys.length - 1] + ' at index ' + w);
      this.room.memory.jobs[job].assignment[this.id] = tasksKeys[tasksKeys.length - 1];
      return this.room.memory.jobs[job].assignment[this.id];
     }
    }
   }
  } else {
   console.log('we have more jobs than workers');
   //if we have more or equal workers to tasks we simply assign them in order
   for (var i = 0; i < workersKeys.length; i++) {
    //only if the creep id is the one we want
    if (this.id == this.room.memory.jobs[job].workers[workersKeys[i]]) {
     //assign and return task id
     this.room.memory.jobs[job].assignment[this.id] = this.room.memory.jobs[job].tasks[tasksKeys[i]];
     console.log('creep with id ' + this.id + ' being assigned to ' + tasksKeys[i] + ' at index ' + i);
     return this.room.memory.jobs[job].assignment[workersKeys[i]];
    }
   }
  }
 } else {
  //if there are no jobs return null
  return null;
 }
};

//act
Creep.prototype.act = function (job) {
 //if the creep memory can't substantiate an object
 if (!Game.getObjectById(this.memory[job].id)) {
  //that isn't there any more
  console.log('can not instantiate target object for ' + job);
  this.memory[job].id = this.assignTask(job);
 }

 let project = Game.getObjectById(this.memory[job]);
 console.log('creep attempting to ' + job + ' with ' + this[job](project));
 switch (this[job](project)) {
 case 0:
  //creep successfuly acted
  this.say('ribbit', true);
  project.debrief();
  return true;
 case -1:
  //don't own the creep
  console.log('You do not own the creep being told to ' + job);
  break;
 case -4:
  //creep is being spawned
  this.say('Spawning', false);
  break;
 case -6:
  //no more energy to spend
  this.say('Empty', false);
  break;
 case -7:
  //invalid target
  this.say('Bad Target', false);
  this.memory[job] = this.assignTask(job);
  break;
 case -9:
  //set move
  this.moveByPath(creep.memory[job].path);
  break;
 case -12:
  //no work body parts
  this.say('¯\\_(ツ)_/¯', false);
  break;
 }
};

//eat action
Creep.prototype.eat = function (home) {
 return home.renewCreep(this);
};
//sacrifice action
Creep.prototype.sacrifice = function (home) {
 return home.recycleCreep(this);
};
