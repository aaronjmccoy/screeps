function toad(creep) {
 //if creep has no energy
 if (creep.carry.energy === 0) {
  //console.log('eat queued');
  creep.act('eat');
  //console.log('harvest queued');
  creep.act('harvest');
 }
 //if creep has energy
 else if (creep.carry.energy > 0) {
  creep.act('build');
  creep.act('upgradeController');
  creep.act('harvest');
 }
}

Memory.recipes.toad = {
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

 },
 options: {
  //add role for creep function call
  role: 'toad',
  //limit resource type to avoid chemical poisoning
  resourceType: RESOURCE_ENERGY,
 }
};
