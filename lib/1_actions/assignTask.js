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
  console.log('we have ' + workersKeys.length + ' ' + job + 'ers and ' + tasksKeys.length + ' ' + job + ' jobs to do');
  //we need to run a different loop depending on the number of workers and tasks
  if (workersKeys.length > tasksKeys.length) {
   // if we have less tasks than workers we assign in parallel lists
   for (var w = 0; w < workersKeys.length; w++) {
    //if the creep index accesses a job
    if (tasksKeys[w]) {
     //only if the creep id is the one we want
     if (this.id == workersKeys[w]) {
      console.log(this.id + ' being assigned at index ' + w + ' for job ' + job);
      this.room.memory.jobs[job].assignment[this.id] = tasksKeys[w];
      return this.room.memory.jobs[job].assignment[this.id];
     }
    } else {
     if (this.id == workersKeys[w]) {
      //assign job at parallel index
      console.log('overflow assignment at index ' + (w % tasksKeys.length) + ' for job ' + job);
      this.room.memory.jobs[job].assignment[this.id] = tasksKeys[(w + 1) % (tasksKeys.length + 1)];
      return this.room.memory.jobs[job].assignment[this.id];
     }
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
    console.log('perfect assignment of' + this.id + ' to ' + tasksKeys[i] + ' for ' + job);
    //}
   }
   return this.room.memory.jobs[job].assignment[this.id];
  }
 } else {
  //if there are no jobs return null
  return null;
 }
};


//assign loop needs rework: modulo doesn't acheive this
//instead use a for loop where the iterator is a coefficient to the number of tasks you have
// workerIndex - (totalTasks*i) = index of assignment
