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

//// TASK ////

//set a task
function Structure.createTask(job) {
    room.memory.jobs[job].tasks.add(this.id);
}
//delete a task
function Structure.deleteTask(job) {
    room.memory.jobs[job].tasks.delete(this.id);
}
//check if a structure is in our task set
function Structure.isTask(job) {
    room.memory.jobs[job].tasks.has(this.id);
}
//get a particular task by converting the set to an array with the spread operator
function getTaskAt(index, job) {
    return [...room.memory.jobs[job].tasks][index];
}
//get a tasks' index
function Structure.getTaskIndex(job) {
    return [...room.memory.jobs[job].tasks].indexOf(this.id);
}
//return the task set in array form
function getTasksArray(job) {
    return [...room.memory.jobs[job].tasks];
}

//get a particular task by converting the set to an array with the spread operator
function getTaskAt(index, job) {
    return [...room.memory.jobs[job].tasks][index];
}
//get a tasks' index
function Structure.getTaskIndex(job) {
    return [...room.memory.jobs[job].tasks].indexOf(this.id);
}
//return the task set in array form
function getTasksArray(job) {
    return [...room.memory.jobs[job].tasks];
}

//// ASSIGNMENT ////

//set an assignment
function Creep.setAssignment(job, taskID) {
    this.room.memory.jobs[job].assignments.add({this.id: taskID});
}
//delete an assignment
function Creep.deleteAssignment(job) {
    room.memory.jobs[job].assignments.delete({this.id: taskID});
}
//delete all assignments a creep has
function Creep.deleteAllAssignments(job) {
    this.memory.jobs.forEach(function(jobs) {
        //delete the assignment entry
        this.deleteAssignment(job);
        //delete the worker entry
        this.deleteWorker(job);
    });
}

//assign a task in the task array to a creep in the corresponding worker array
function Creep.assignTask(job) {
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
