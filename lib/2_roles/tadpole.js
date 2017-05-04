function tadpole(creep) {
    //before the extensions are built
    if (creep.room.extensionIDs().length < 10) {
        //if tadpole count is below threshold
        if (_(Memory.creeps).filter({
                role: 'tadpole'
            }, {
                room: creep.room.name
            }).size() < creep.memory.max) {
            if (!creep.memory.to) {
                const r = creep.room;
                let extensionArray = r.extensionIDs();
                //console.log(extensionArray);
                let spawnerArray = r.spawnerIDs();
                //console.log(spawnerArray);
                let depositArray = spawnerArray.concat(extensionArray);
                creep.memory.to = depositArray;
            }
            //we need to put energy in the spawn
            if (creep.carry.energy === 0) {
                creep.memory.important = 'mine';
            } else if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.important = 'deposit';
            }
        } else {
            //if tadpole count is equal to or above threshold build
            if (creep.carry.energy === 0) {
                creep.memory.important = 'mine';
            } else if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.important = 'build';
            }
        }
    }else{
      if(!creep.memory.reset){
        creep.memory.resetTo = true;
        creep.memory.to = null;
      }
      //if extension count is fulfilled
      //specify the creep deposit array
      if (!creep.memory.to) {
          const r = creep.room;
          let extensionArray = r.extensionIDs();
          //console.log(extensionArray);
          let spawnerArray = r.spawnerIDs();
          //console.log(spawnerArray);
          let depositArray = spawnerArray.concat(extensionArray);
          creep.memory.to = depositArray;
      }
      //if the spawn energy is at max
      if(creep.room.energyAvailable == creep.room.energyCapacityAvailable){
        if (creep.carry.energy === 0) {
            creep.memory.important = 'mine';
        } else if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.important = 'build';
        }
      }else{
        if (creep.carry.energy === 0) {
            creep.memory.important = 'mine';
        } else if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.important = 'deposit';
        }
      }

    }
    act(creep);
    depositAura(creep);
    gatherAura(creep);
}
