function frog(creep) {
    if (!creep.memory.from) {
        const r = creep.room;
        let containerArray = r.containerIDs();
        let gatherArray = r.storageIDs();
        gatherArray = gatherArray.concat(containerArray);
        creep.memory.from = gatherArray;
    }
    //in rcl3 we want frogs to build and upgrade
    if (creep.carry.energy === 0) {
        creep.memory.important = 'gather';
    } else if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.important = 'build';
    }
    act(creep);
    gatherAura(creep);
}
