function frog(creep) {
 //state flipper
 if (creep.carry.energy === 0) {
  creep.memory.state = 0;
 }
 //if creep has energy
 else if (creep.carry.energy === creep.carryCapacity) {
  creep.memory.state = 1;
 }

 //if creep has energy
 if (creep.memory.state) {
  switch (creep.build(Game.getObjectById(creep.memory.build))) {
  case 0:
   //creep successfuly acted
   creep.say('riBBit', true);
   Game.getObjectById(creep.memory.build).debrief();
   return 0;
  case -7:
   //invalid target
   creep.say('Bad Target', false);
   //remove old target from memory
   Game.getObjectById(creep.memory.build).debrief();
   //assign new target
   creep.memory.build = creep.assignTask('build');
   //head towards upgrader if this repeats
   if (creep.upgradeController(Game.getObjectById(creep.room.controller)) == -9) {
    creep.moveTo(Game.getObjectById(creep.room.controller), {
     visualizePathStyle: {
      fill: '#ccff66',
      stroke: '#ccff66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -7;
  case -9:
   //set move
   creep.moveTo(Game.getObjectById(creep.memory.withdraw), {
    visualizePathStyle: {
     fill: '#ccff66',
     stroke: '#ccff66',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return -9;
  }
 }
 //if creep has no energy
 else {
  switch (creep.withdraw(Game.getObjectById(creep.memory.withdraw))) {
  case 0:
   //creep successfuly acted
   creep.say('RibbiT', true);
   return 0;
  case -6:
   //not enough resources
   //remove withdraw target from memory
   Game.getObjectById(creep.memory.withdraw).debrief();
   //assign new withdraw target
   creep.memory.withdraw = creep.assignTask('withdraw');
   //head towards mining if this repeats
   if (creep.harvest(creep.memory.harvest) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.harvest), {
     visualizePathStyle: {
      fill: '#ccff66',
      stroke: '#ccff66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -6;
  case -7:
   //invalid target
   creep.say('Bad Target', false);
   //remove old target from memory
   Game.getObjectById(creep.memory.withdraw).debrief();
   //assign new target
   creep.memory.withdraw = creep.assignTask('withdraw');
   //head towards mining if this repeats
   if (creep.harvest(Game.getObjectById(creep.memory.harvest)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.harvest), {
     visualizePathStyle: {
      fill: '#ccff66',
      stroke: '#ccff66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   } else if (creep.harvest(creep.memory.harvest) == -6) {
    //if sources are out of energy harvest
    if (creep.eat(creep.memory.home) == -9) {
     //bad target followed by empty sources = eat while you can
     creep.moveTo(Game.getObjectById(creep.memory.home), {
      visualizePathStyle: {
       fill: '#ccff66',
       stroke: '#ccff66',
       lineStyle: 'dashed',
       strokeWidth: .15,
       opacity: .1
      }
     });
    }
   }
   return -7;
  case -9:
   //set move
   creep.moveTo(Game.getObjectById(creep.memory.withdraw), {
    visualizePathStyle: {
     fill: '#ccff66',
     stroke: '#ccff66',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return -9;
  }
 }
}
Memory.recipes.frog = {
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

 },
 options: {
  //add role for creep function call
  role: 'frog',
  //limit resource type to avoid chemical poisoning
  resourceType: RESOURCE_ENERGY
 }
};
