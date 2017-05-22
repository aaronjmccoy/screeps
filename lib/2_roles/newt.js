function newt(creep) {
 //if creep has no energy
 if (creep.carry.energy === 0) {
  creep.act('withdraw');
  creep.act('pickup');
 }
 //if creep has energy
 else if (creep.carry.energy === creep.carryCapacity) {
  creep.act('eat');
  creep.act('transfer');
 }
}

Memory.recipes.newt = {
 parts: {
  //rcl1 300 energy
  1: [MOVE, CARRY, MOVE, CARRY],
  //rcl2 300 - 550
  2: [MOVE, CARRY, MOVE, CARRY],
  //rcl3 550 - 800
  3: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
  //rcl 4 800 - 1300
  4: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
  //rcl 5 1300 - 1800
  5: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
  //rcl 6 1800 - 2300
  6: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
  //rcl 7 2300 - 5600
  7: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
  //rcl 8 5600 - 12900
  8: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]

 },
 options: {
  //add role for creep function call
  role: 'newt',
  //limit resource type to avoid chemical poisoning
  resourceType: RESOURCE_ENERGY,
 }
};
