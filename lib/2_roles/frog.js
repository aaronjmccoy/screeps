function frog(creep) {
    //if creep has no energy
    if (creep.carry.energy === 0) {
      eat(creep);
      mine(creep);
      gather(creep);
    }
    //if creep has energy
    else if (creep.carry.energy === creep.carryCapacity) {
      eat(creep);
      upgrade(creep);
      fix(creep);
      build(creep);
    }
}

Memory.recipes.frog: {
    parts: {
      //rcl1 300 energy
      1: [MOVE, CARRY, MOVE, WORK],
      //rcl2 300 - 550
      2: [MOVE, CARRY, MOVE, WORK],
      //rcl3 550 - 800
      3: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
      //rcl 4 800 - 1300
      4: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
      //rcl 5 1300 - 1800
      5: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
      //rcl 6 1800 - 2300
      6: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
      //rcl 7 2300 - 5600
      7: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
      //rcl 8 5600 - 12900
      8: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK]

    }
    options: {
        //add role for creep function call
        role: 'frog',
        //limit resource type to avoid chemical poisoning
        resourceType: RESOURCE_ENERGY
    }
}
