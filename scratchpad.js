//room memory structure
let taskSet = new Set();
room.memory {
 jobs: {
  job: {
   workers: workerSet,
   tasks: taskSet,
   assignments: {}
  }
 }
}

//set a worker
function Creep.setTask(job) { room.memory.jobs[job].workers.add(this.id); }
//delete a worker
function Creep.deleteTask(job) { room.memory.jobs[job].workers.delete(this.id); }
//check if a creep is in our worker set
function Creep.isWorker(job) { room.memory.jobs[job].workers.has(this.id); }
//get a particlar worker
function getWorkerAt(index, job) { return [...room.memory.jobs[job].workers][index]; }
//get a worker's index
function Creep.getWorkerIndex(job) { return [...room.memory.jobs[job].workers].indexOf(this.id); }
//return the worker set in array form
function getWorkersArray(job) { return [...room.memory.jobs[job].workers]; }

//set a task
function Structure.setTask(job) { room.memory.jobs[job].tasks.add(this.id); }
//delete a task
function Structure.deleteTask(job) { room.memory.jobs[job].tasks.delete(this.id); }
//check if a structure is in our task set
function Structure.isTask(job) { room.memory.jobs[job].tasks.has(this.id); }
//get a particular task by converting the set to an array with the spread operator
function getTaskAt(index, job) { return [...room.memory.jobs[job].tasks][index]; }
//get a tasks' index
function Structure.getTaskIndex(job) { return [...room.memory.jobs[job].tasks].indexOf(this.id); }
//return the task set in array form
function getTasksArray(job) { return [...room.memory.jobs[job].tasks]; }

//set an assignment
function Creep.setAssignment(job, taskID) { this.room.memory.jobs[job].assignments.add({ this.id: taskID }); }
//delete an assignment
function Creep.deleteAssignment(job) { room.memory.jobs[job].assignments.delete({ this.id: taskID }); }
//delete all assignments a creep has
function Creep.deleteAllAssignments(job) {
 this.memory.jobs.forEach(function (jobs) { deleteAssignment(job) });
}


//get a particular task by converting the set to an array with the spread operator
function getTaskAt(index, job) { return [...room.memory.jobs[job].tasks][index]; }
//get a tasks' index
function Structure.getTaskIndex(job) { return [...room.memory.jobs[job].tasks].indexOf(this.id); }
//return the task set in array form
function getTasksArray(job) { return [...room.memory.jobs[job].tasks]; }

//assign a task in the task array to a creep in the corresponding worker array
function Creep.assignTask(job) {
 //first be sure the creep is in the worker array
 if (!this.isWorker(job)) {
  //if not add it
  this.setTask(job);
 };
 //then get the index of the worker
 let wIndex = this.getWorkerIndex(job);
 let aIndex = 0;
 let task = getTaskAt(wIndex, job);
 //if there is a job in the tasks set at wIndex
 if (task) {
  creep.memory.jobs[job] = task;
 } else {
  //there is no job at that index, we need to assign this creep to a job parallel to wIndex
  let tasksLength = getTasksArray(job).length;
  let workersLength = getWorkersArray(job).length;
  //if we have more workers to tasks
  if (workersLength > tasksLength) {
   aIndex = wIndex % tasksLength;
  } else {
   //we have less then or equal workers to tasks
   aIndex = wIndex;
  }

 }
}





//assign task takes string for creep action and assigns creep to corresponding task if any present in room.job[job].tasks
Creep.prototype.assignTask = function (job) {
 //you know you can get objects by simulated index by getting the keys
 var tasksLength = this.room.memory.jobs[job].tasks.length;
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
