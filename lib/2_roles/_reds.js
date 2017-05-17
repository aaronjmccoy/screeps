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
