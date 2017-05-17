function toad(creep) {
    //if creep has no energy
    if (creep.carry.energy === 0) {
      eat(creep);
      mine(creep);
    }
    //if creep has energy
    else if (creep.carry.energy > 0) {
      build(creep);
      upgrade(creep);
      mine(creep);
    }
}

Memory.recipes.toad: {
    parts: {
      //rcl1 300 energy
      1: [MOVE, WORK, CARRY, WORK],
      //rcl2 300 - 550
      2: [MOVE, WORK, CARRY, WORK],
      //rcl3 550 - 800
      3: [MOVE, WORK, WORK, MOVE, WORK, WORK, CARRY],
      //rcl 4 800 - 1300
      4: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, CARRY],
      //rcl 5 1300 - 1800
      5: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, CARRY],
      //rcl 6 1800 - 2300
      6: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, CARRY],
      //rcl 7 2300 - 5600
      7: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, CARRY],
      //rcl 8 5600 - 12900
      8: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, CARRY]

    }
    options: {
        //add role for creep function call
        role: 'toad',
        //limit resource type to avoid chemical poisoning
        resourceType: RESOURCE_ENERGY,
        //define actions object with priority in mind
        // least important -> most important
        popcap: {
          1: 3,
          2: 3,
          3: 2,
          4: 1,
          5: 1,
          6: 1,
          7: 1,
          8: 1
        }
    }
}
