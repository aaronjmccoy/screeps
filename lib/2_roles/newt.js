function newt(creep) {
 //state flipper
 if (creep.carry.energy === 0) {
  creep.memory.state = 0;
 }
 //if creep has energy
 else if (creep.carry.energy === creep.carryCapacity) {
  creep.memory.state = 1;
 }

 //logic
 if (creep.memory.state) {
  switch (creep.transfer(Game.getObjectById(creep.memory.transfer), creep.memory.resourceType)) {
  case 0:
   //creep successfuly transferred
   creep.say('slink', true);
   Game.getObjectById(creep.memory.transfer).debrief();
   return 0;
  case -7:
   //invalid target
   creep.say('Bad Target', false);
   creep.memory.transfer = creep.assignTask('transfer');
   //head towards eating if this repeats
   if (creep.eat(Game.getObjectById(creep.memory.home)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.home), {
     visualizePathStyle: {
      fill: '#ffcc00',
      stroke: '#ffcc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -7;
  case -8:
   //full target
   creep.say('Full', false);
   creep.memory.transfer = creep.assignTask('transfer');
   //head towards eating if this repeats
   if (creep.eat(Game.getObjectById(creep.memory.home)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.home), {
     visualizePathStyle: {
      fill: '#ffcc00',
      stroke: '#ffcc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -9;
  case -9:
   //move in
   creep.moveTo(Game.getObjectById(creep.memory.transfer), {
    visualizePathStyle: {
     fill: '#ffcc00',
     stroke: '#ffcc00',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return creep.transfer(Game.getObjectById(creep.memory.transfer), creep.memory.resourceType);
  }
 }
 //if creep has energy
 else {
  switch (creep.withdraw(Game.getObjectById(creep.memory.withdraw), creep.memory.resourceType)) {
  case 0:
   //creep successfuly transferred
   creep.say('peep', true);
   Game.getObjectById(creep.memory.withdraw).debrief();
   return 0;
  case -6:
   //empty target
   creep.say('Not Enough', false);
   creep.memory.withdraw = creep.assignTask('withdraw');
   //head towards eating if this repeats
   if (creep.pickup(Game.getObjectById(creep.memory.pickup)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.pickup), {
     visualizePathStyle: {
      fill: '#ffcc00',
      stroke: '#ffcc00',
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
   creep.memory.withdraw = creep.assignTask('withdraw');
   //head towards eating if this repeats
   if (creep.pickup(Game.getObjectById(creep.memory.pickup)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.pickup), {
     visualizePathStyle: {
      fill: '#ffcc00',
      stroke: '#ffcc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -7;
  case -9:
   //move in
   creep.moveTo(Game.getObjectById(creep.memory.withdraw), {
    visualizePathStyle: {
     fill: '#ffcc00',
     stroke: '#ffcc00',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return -9;
  }
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
