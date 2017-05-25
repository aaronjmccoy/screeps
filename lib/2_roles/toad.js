function toad(creep) {
 //state flipper
 if (creep.carry.energy === 0) {
  creep.memory.state = 0;
 }
 //if creep has energy
 else if (creep.carry.energy > 10) {
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
   if (Game.getObjectById(creep.memory.build)) {
    Game.getObjectById(creep.memory.build).debrief();
   }
   //assign new target
   creep.memory.build = creep.assignTask('build');
   switch (creep.harvest(Game.getObjectById(creep.memory.harvest))) {
   case 0:
    //creep successfuly acted
    creep.say('BwaK', true);
    creep.upgradeController(Game.getObjectById(creep.room.controller));
    return 0;
   case -6:
    //not enough resources
    //head towards eating if this repeats
    if (creep.eat(creep.memory.home) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.home), {
      visualizePathStyle: {
       fill: '#ffcc66',
       stroke: '#ffcc66',
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
    //assign new target
    creep.memory.harvest = creep.assignTask('harvest');
    //head towards eating if this repeats
    if (creep.eat(creep.memory.home) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.home), {
      visualizePathStyle: {
       fill: '#ffcc66',
       stroke: '#ffcc66',
       lineStyle: 'dashed',
       strokeWidth: .15,
       opacity: .1
      }
     });
    }
    return -7;
   case -9:
    //set move
    creep.moveTo(Game.getObjectById(creep.memory.harvest), {
     visualizePathStyle: {
      fill: '#ffcc66',
      stroke: '#ffcc66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
    return -9;
   }
   return -7;
  case -9:
   //assign new target
   creep.memory.build = creep.assignTask('build');
   switch (creep.harvest(Game.getObjectById(creep.memory.harvest))) {
   case 0:
    //creep successfuly acted
    creep.say('BwaK', true);
    creep.upgradeController(Game.getObjectById(creep.room.controller));
    return 0;
   case -6:
    //not enough resources
    //head towards eating if this repeats
    if (creep.eat(creep.memory.home) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.home), {
      visualizePathStyle: {
       fill: '#ffcc66',
       stroke: '#ffcc66',
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
    //assign new target
    creep.memory.harvest = creep.assignTask('harvest');
    //head towards eating if this repeats
    if (creep.eat(creep.memory.home) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.home), {
      visualizePathStyle: {
       fill: '#ffcc66',
       stroke: '#ffcc66',
       lineStyle: 'dashed',
       strokeWidth: .15,
       opacity: .1
      }
     });
    }
    return -7;
   case -9:
    //set move
    creep.moveTo(Game.getObjectById(creep.memory.harvest), {
     visualizePathStyle: {
      fill: '#ffcc66',
      stroke: '#ffcc66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
    return -9;
   }
  }
 }
 //if creep has no energy
 else {
  switch (creep.harvest(Game.getObjectById(creep.memory.harvest))) {
  case 0:
   //creep successfuly acted
   creep.say('BwaK', true);
   creep.upgradeController(Game.getObjectById(creep.room.controller));
   return 0;
  case -6:
   //not enough resources
   //head towards eating if this repeats
   if (creep.eat(creep.memory.home) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.home), {
     visualizePathStyle: {
      fill: '#ffcc66',
      stroke: '#ffcc66',
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
   //assign new target
   creep.memory.harvest = creep.assignTask('harvest');
   //head towards eating if this repeats
   if (creep.eat(creep.memory.home) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.home), {
     visualizePathStyle: {
      fill: '#ffcc66',
      stroke: '#ffcc66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -7;
  case -9:
   //set move
   creep.moveTo(Game.getObjectById(creep.memory.harvest), {
    visualizePathStyle: {
     fill: '#ffcc66',
     stroke: '#ffcc66',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return -9;
  }
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
