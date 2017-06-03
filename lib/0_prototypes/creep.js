// LAZINESS PROTOTYPES //

//eat action
Creep.prototype.eat = function() {
    return Game.getObjectById(this.memory.eat).renewCreep(this);
};
//sacrifice action
Creep.prototype.sacrifice = function() {
    return Game.getObjectById(this.memory.eat).recycleCreep(this);
};

//// WORKER PROTOTYPES////

//set a worker
Creep.prototype.setWorker = function(job) {
    room.memory.jobs[job].workers.add(this.id);
}
//delete a worker
Creep.prototype.deleteWorker = function(job) {
    room.memory.jobs[job].workers.delete(this.id);
}
//check if a creep is in our worker set
Creep.prototype.isWorker = function(job) {
    room.memory.jobs[job].workers.has(this.id);
}
//get a particlar worker
Creep.prototype.getWorkerAt = function(index, job) {
    return [...room.memory.jobs[job].workers][index];
}
//get a worker's index
Creep.prototype.getWorkerIndex = function(job) {
    return [...room.memory.jobs[job].workers].indexOf(this.id);
}
//return the worker set in array form
function getWorkersArray(job) {
    return [...room.memory.jobs[job].workers];
}

//// TASK ASSIGNMENT ////

//set an assignment
Creep.prototype.setAssignment = function(job, taskID) {
    this.room.memory.jobs[job].assignments.add({this.id: taskID});
}
//delete an assignment
Creep.prototype.deleteAssignment = function(job) {
    room.memory.jobs[job].assignments.delete({this.id: taskID});
}
//delete all assignments a creep has
Creep.prototype.deleteAllAssignments = function(job) {
    this.memory.jobs.forEach(function(jobs) {
        //delete the assignment entry
        this.deleteAssignment(job);
        //delete the worker entry
        this.deleteWorker(job);
    });
}

//assign a task in the task array to a creep in the corresponding worker array
Creep.prototype.assignTask = function(job) {
    //first be sure the creep is in the worker array
    if (!this.isWorker(job)) {
        //if not add it
        this.setWorker(job);
    };
    //then get the index of the worker
    let wIndex = this.getWorkerIndex(job);
    let aIndex = 0;
    let task = getTaskAt(wIndex, job);
    //if there is a job in the tasks set at wIndex
    if (task) {
        this.memory.jobs[job] = task;
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
    //set assignment
    this.setAssignment(job, getTaskAt(aIndex, job));
}
