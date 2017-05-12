function act(creep) {
    switch (creep.memory.important) {
        case 'build':
            build(creep);
            break;
        case 'deposit':
            deposit(creep);
            break;
        case 'eat':
            eat(creep);
            break;
        case 'sweep':
            ///we need to get a target for our sweeper
            //first we sort the existing array if need be
            if (creep.room.memory.sortSweep) {
                Object.keys(this.room.memory.sweep).sort(function(a, b) {
                    return this.room.memory.sweep[a] - this.room.memory.sweep[b]
                });
                creep.room.memory.sortSweep = 0;
            }
            //next we look at the dropped resources array
            var sweepObject = creep.room.memory.sweep;
            //then we get our keyIndex, based on our current creep count for individually assigned, non-redundant tasks
            var keyIndex = r.roleCount(creep.memory.role) - 1;
            //since all of our sweep tasks are pushed to the sweep array and sorted by highest value,
            //we can just tackle the top n tasks where n is the rolecount
            if (sweepObject[Object.keys(sweepObject)[keyIndex]]) {
                gather(creep, creep.room.memory.sweep[Object.keys(sweepObject)[keyIndex]]);
            }
            break;
        case 'mine':
            mine(creep);
            break;
        case 'upgrade':
            upgrade(creep);
            break;
    }
}

function gatherAura(creep) {
    var shinies = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
        filter: r => r.resourceType == RESOURCE_ENERGY
    });
    var moarshinies = creep.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: s => s.structureType == STRUCTURE_CONTAINER
    });
    var evenmoarshinies = creep.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: s => s.structureType == STRUCTURE_STORAGE
    });
    if (creep.memory.role != 'newt' && creep.memory.role != 'toad') {
        if (creep.withdraw(evenmoarshinies[0], RESOURCE_ENERGY) === 0) {
            creep.say('shinies');
        }
    }
    if (creep.memory.role != 'toad') {
        if (creep.withdraw(moarshinies[0], RESOURCE_ENERGY) === 0) {
            creep.say('shinies');
        }
    }
    if (creep.pickup(shinies[0]) === 0) {
        creep.say('shinies');
    }
}

function depositAura(creep) {
    var nearExt = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
        filter: s => s.structureType == STRUCTURE_EXTENSION
    });
    //console.log(nearExt);
    for (let e in nearExt) {
        //console.log(nearExt[e]);
        if (creep.transfer(nearExt[e], RESOURCE_ENERGY) === 0) {
            creep.say('teehee');
        }
    }
}

function assignTask(creep) {

}
