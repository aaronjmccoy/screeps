//assign task takes string for creep action and assigns creep to corresponding task if any present in room.job[job].tasks
Creep.prototype.assignTask = function (job) {
 //you know you can get objects by simulated index by getting the keys
 var tasksKeys = Object.keys(this.room.memory.jobs[job].tasks);
 if (!this.room.memory.jobs[job].workers[this.id]) {
  this.room.memory.jobs[job].workers[this.id] = this.id;
 }
 var workersKeys = Object.keys(this.room.memory.jobs[job].workers);
 //if there are actually tasks
 if (tasksKeys.length) {
  //console.log('we have ' + workersKeys.length + ' workers and ' + tasksKeys.length + ' ' + job + ' jobs to do');
  //we need to run a different loop depending on the number of workers and tasks
  if (workersKeys.length > tasksKeys.length) {
   //console.log('we have more workers than jobs');
   // if we have less tasks than workers we can assign bunch workers to the
   // bottommost task
   for (var w = 0; w < workersKeys.length; w++) {
    //only if the creep id is the one we want
    console.log(this.id + ' being assigned at index ' + w + ' for worker value ' + this.room.memory.jobs[job].workers[workersKeys[w]]);

     //console.log(this.id + ' being assigned');
     //if the creep index accesses a job
     if (tasksKeys[w]) {
      //assign job at index i
      console.log('creep with id ' + this.id + ' being assigned to '+job+' ' + tasksKeys[w] + ' at index ' + w);
      this.room.memory.jobs[job].assignment[this.id] = tasksKeys[w];
      return this.room.memory.jobs[job].assignment[this.id];
     } else {
      //assign job at parallel index
      console.log('creep with id ' + this.id + ' being assigned to b ' + tasksKeys[tasksKeys%i] + ' at index ' + tasksKeys%i);
      this.room.memory.jobs[job].assignment[this.id] = tasksKeys[tasksKeys.length-(tasksKeys%i)];
      return this.room.memory.jobs[job].assignment[this.id];
     }

   }
  } else {
   //console.log('we have more jobs than workers');
   //if we have more or equal workers to tasks we simply assign them in order
   for (var i = 0; i < workersKeys.length; i++) {
    //only if the creep id is the one we want
    //if (this.id == this.room.memory.jobs[job].workers[workersKeys[i]]) {
     //assign and return task id
     this.room.memory.jobs[job].assignment[this.id] = this.room.memory.jobs[job].tasks[tasksKeys[i]];
     //console.log('creep with id ' + this.id + ' being assigned to ' + tasksKeys[i] + ' at index ' + i);
    //}
   }
   return this.room.memory.jobs[job].assignment[this.id];
  }
 } else {
  //if there are no jobs return null
  return null;
 }
};
