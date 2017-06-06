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

//get an assignment
Creep.prototype.getAssignment = function(job, taskID) {
    return this.room.memory.jobs[job].assignments[this.id];
}
//set an assignment
Creep.prototype.setAssignment = function(job, taskID) {
    this.room.memory.jobs[job].assignments[this.id] = taskID;
    this.memory.jobs[job] = taskID;
}
//delete an assignment
Creep.prototype.deleteAssignment = function(job) {
    delete this.room.memory.jobs[job].assignments[this.id];
    delete this.memory.jobs[job];
}
//delete all assignments a creep has
Creep.prototype.deleteAllAssignments = function() {
    for (var job in this.memory.jobs) {
        //delete the assignment entry
        this.deleteAssignment(job);
        //delete the worker entry
        this.deleteWorker(job);
    };
}

//assign a task in the task array to a creep in the corresponding worker array
Creep.prototype.assignTask = function(job) {
    //first be sure the creep is in the worker array
    if (!this.isWorker(job)) {
        //if not add it
        this.setWorker(job);
    };
    //then get the index of the worker, wIndex
    let wIndex = this.getWorkerIndex(job);
    let aIndex = 0;
    //get the task at wIndex
    let task = getTaskAt(wIndex, job);
    //if there is a job in the tasks set at wIndex
    if (task) {
        this.setAssignment(job, task);
        return true;
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
        //set assignment
        this.setAssignment(job, getTaskAt(aIndex, job));
        return true;
    }
    this.setAssignment(job, getTaskAt(aIndex, job));
    return true;
}

Creep.prototype.gatherAura = function() {
    var shinies = this.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
        filter: r => r.resourceType == RESOURCE_ENERGY
    });
    var moarshinies = this.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: s => s.structureType == STRUCTURE_CONTAINER
    });
    var evenmoarshinies = this.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: s => s.structureType == STRUCTURE_STORAGE
    });
    if (this.memory.role != 'newt' && this.memory.role != 'toad') {
        if (this.withdraw(evenmoarshinies[0], RESOURCE_ENERGY) === 0) {
            this.say('shinies');
        }
    }
    if (this.memory.role != 'toad') {
        if (this.withdraw(moarshinies[0], RESOURCE_ENERGY) === 0) {
            this.say('shinies');
        }
    }
    if (this.pickup(shinies[0]) === 0) {
        this.say('shinies');
    }
}

Creep.prototype.depositAura = function() {
    var nearExt = this.pos.findInRange(FIND_MY_STRUCTURES, 1, {
        filter: s => s.structureType == STRUCTURE_EXTENSION
    });
    //console.log(nearExt);
    for (let e in nearExt) {
        //console.log(nearExt[e]);
        if (this.transfer(nearExt[e], RESOURCE_ENERGY) === 0) {
            this.say('teehee');
        }
    }
}

Creep.prototype.assignSpot = function() {
    for (let source in Memory.rooms[this.room.name].sources) {
        if (Memory.rooms[this.room.name].lastAssignedSource == source) {
            continue;
        }
        for (let spot in Memory.rooms[this.room.name].sources[source].spots) {
            if (!Game.getObjectById(Memory.rooms[this.room.name].sources[source].spots[spot])) {
                Memory.rooms[this.room.name].sources[source].spots[spot] = this.id;
                Memory.rooms[this.room.name].lastAssignedSource = source;
                return source;
            } else if (this.memory.priority > Game.getObjectById(Memory.rooms[this.room.name].sources[source].spots[spot]).memory.priority) {
                Game.getObjectById(Memory.rooms[this.room.name].sources[source].spots[spot]).suicide();
                Memory.rooms[this.room.name].sources[source].spots[spot] = this.id;
                Memory.rooms[this.room.name].lastAssignedSource = source;
                return source;
            }
        }
    }
    return this.pos.findClosestByRange(FIND_SOURCES).id;
}

//// CREEP ACTIONS PLUS ////
Creep.prototype.whack = function() {
    switch (this.attack(Game.getObjectById(this.memory.jobs.attack))) {
        case 0:
            //clear id from room's task set
            Game.getObjectById(this.memory.jobs.attack).deleteTask('attack');
            return Memory.emoji['attack'];
        case -7:
            //invalid target
            Game.getObjectById(this.memory.jobs.attack).deleteTask('attack');
            //we also need to clear the assignment
            this.deleteAssignment('attack');
            //last, we have to decide if we should assign a new task
            if (getTasksArray('attack').length) {
                this.assignTask('attack');
                this.whack();
                return Memory.emoji['oops'];
            } else {
                this.eat();
                return Memory.emoji['oops'];
            }
            return Memory.emoji['oops'];
        case -9:
            //set move
            this.moveTo(Game.getObjectById(this.memory.jobs.attack), {
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#ff0000',
                    lineStyle: 'solid',
                    strokeWidth: .15,
                    opacity: .1
                }
            });
            return Memory.emoji['attack'];
        case -12:
            //if for any reason the wrong creep is in the build workers
            this.deleteAssignment('attack');
            this.deleteWorker('attack');
            return Memory.emoji['oops'];
    }
}

Creep.prototype.construct = function() {
    switch (this.build(Game.getObjectById(this.memory.jobs.build))) {
        case 0:
            //clear id from room's task set
            Game.getObjectById(this.memory.jobs.build).deleteTask('build');
            return Memory.emoji['build'];
        case -6:
            //this should never occur but it's good to have preventative measures
            this.memory.state = 0;
        case -7:
            //if we get a -7 it means no target found
            //since build tasks are pulled directly from Game.constructionSites we know our build tasks are valid
            //this means the site was built successfully and we need to remove the task
            Game.getObjectById(this.memory.jobs.build).deleteTask('build');
            //we also need to clear the assignment
            this.deleteAssignment('build');
            //last, we have to decide if we should assign a new task
            if (getTasksArray('build').length) {
                this.assignTask('build');
                this.construct();
                return Memory.emoji['oops'];
            } else {
                this.upgrade();
                return Memory.emoji['oops'];
            }
            return Memory.emoji['oops'];
        case -9:
            //set move
            this.moveTo(Game.getObjectById(this.memory.jobs.build), {
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#ccff66',
                    lineStyle: 'dashed',
                    strokeWidth: .15,
                    opacity: .1
                }
            });
            return Memory.emoji['frog'];
        case -12:
            //if for any reason the wrong creep is in the build workers
            this.deleteAssignment('build');
            this.deleteWorker('build');
            return Memory.emoji['oops'];
        case -14:
            //remove the construction site
            Game.getObjectById(this.memory.jobs.build).remove();
            return Memory.emoji['oops'];
    }
}

Creep.prototype.collect = function() {
    switch (this.withdraw(Game.getObjectById(this.memory.jobs.withdraw))) {
        case 0:
            //no need to clear memory for upgrade, controller is permanent
            return Memory.emoji['withdraw'];
        case -6:
        case -7:
        case -10:
            //we need to clear the assignment
            this.deleteAssignment('withdraw');
            //assign a new task
            if (getTasksArray('withdraw').length) {
                this.assignTask('withdraw');
                this.collect();
                return Memory.emoji['oops'];
            } else {
                this.mine();
                return Memory.emoji['oops'];
            }
            return Memory.emoji['oops'];
        case -8:
          //creep is full
          this.memory.state = 1;
        case -9:
            //set move
            this.moveTo(Game.getObjectById(this.memory.jobs.withdraw), {
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#ccff66',
                    lineStyle: 'dashed',
                    strokeWidth: .15,
                    opacity: .1
                }
            });
            return Memory.emoji['frog'];
    }
}

Creep.prototype.upgrade = function() {
    switch (this.upgradeController(Game.getObjectById(this.memory.jobs.upgradeController))) {
        case 0:
            //no need to clear memory for upgrade, controller is permanent
            return Memory.emoji['upgradeController'];
        case -6:
            //this should never occur but it's good to have preventative measures
            this.memory.state = 0;
        case -7:
            //we need to clear the assignment
            this.deleteAssignment('upgradeController');
            //assign a new task
            if (getTasksArray('upgradeController').length) {
                this.assignTask('upgradeController');
                this.upgrade();
                return Memory.emoji['oops'];
            } else {
                this.upgrade();
                return Memory.emoji['oops'];
            }
            return Memory.emoji['oops'];
        case -9:
            //set move
            this.moveTo(Game.getObjectById(this.memory.jobs.build), {
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#ccff66',
                    lineStyle: 'dashed',
                    strokeWidth: .15,
                    opacity: .1
                }
            });
            return Memory.emoji['frog'];
    }
}
