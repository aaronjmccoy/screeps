function newt(creep) {
    depositAura(creep);
    if (!creep.memory.to) {
        const r = creep.room;
        let extensionArray = r.extensionIDs();
        let spawnerArray = r.spawnerIDs();
        let towerArray = r.towerIDs();
        //let storageArray = r.storageIDs();
        let frogArray = r.roleIDs('frog');
        let depositArray = spawnerArray.concat(extensionArray);
        depositArray = depositArray.concat(towerArray);
        depositArray = depositArray.concat(frogArray);
        //depositArray = depositArray.concat(storageArray);
        creep.memory.to = depositArray;
    }
    if (!creep.memory.from) {
        const r = creep.room;
        let storageArray = r.storageIDs();
        let containerArray= r.containerIDs();
        let gatherArray = storageArray.concat(containerArray);
        creep.memory.from = [_.max(gatherArray, function(containerID) {
            return Game.getObjectById(containerID).store[RESOURCE_ENERGY];
        })];
    }
    //in rcl3 we want newts to haul from containers to spawn energy array and tower
    if (creep.carry.energy === 0) {
        creep.memory.important = 'gather';
    } else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.important = 'deposit';
    }
    act(creep);
    depositAura(creep);
    gatherAura(creep);
}
