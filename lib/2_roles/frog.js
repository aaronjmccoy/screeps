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
   if (!Game.getObjectById(creep.memory.build)) {
    //creep.clearJob('build');
   }
   return 0;
  case -7:
   //invalid target
   //creep.say('Bad Target', false);
   //remove old target from room memory and creep memory
   //creep.clearJob('build');
   if (!creep.memory.build) {
    creep.memory.build = creep.assignTask('build');
   }
   if (creep.memory.upgradeController !== null) {
    creep.memory.upgradeController = creep.assignTask('upgradeController');
   }
   if (creep.upgradeController(Game.getObjectById(creep.memory.upgradeController)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.upgradeController), {
     visualizePathStyle: {
      fill: '#ccff66',
      stroke: '#ccff66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   //assign new target
   //head towards upgrader if this repeats
   //console.log(creep.upgradeController(Game.getObjectById(creep.memory.upgradeController)));
   return -7;
  case -9:
   //set move
   creep.moveTo(Game.getObjectById(creep.memory.build), {
    visualizePathStyle: {
     fill: '#ccff66',
     stroke: '#ccff66',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return -9;
  case -10:
   //invalid target
   //creep.say('Bad Target', false);
   //remove old target from room memory and creep memory
   //creep.clearJob('build');
   if (creep.memory.build !== null) {
    creep.memory.build = creep.assignTask('build');
   }
   if (creep.memory.upgradeController !== null) {
    creep.memory.upgradeController = creep.assignTask('upgradeController');
   }
   if (creep.upgradeController(Game.getObjectById(creep.memory.upgradeController)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.upgradeController), {
     visualizePathStyle: {
      fill: '#ccff66',
      stroke: '#ccff66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   //assign new target
   //head towards upgrader if this repeats
   //console.log(creep.upgradeController(Game.getObjectById(creep.memory.upgradeController)));
   return 'state 1 -10';
  }
 }
 //if creep has no energy
 else {
  switch (creep.withdraw(Game.getObjectById(creep.memory.withdraw))) {
  case 0:
   //creep successfuly acted
   creep.say('RibbiT', true);
   Game.getObjectById(creep.memory.withdraw).debrief()
   return 0;
  case -6:
   //invalid target
   //remove withdraw target from memory
   if (!Game.getObjectById(creep.memory.withdraw)) {
    //creep.clearJob('withdraw');
    //assign new withdraw target
    creep.memory.withdraw = creep.assignTask('withdraw');
   }
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
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     //bad target followed by empty sources = eat while you can
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
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
   return -6;
  case -7:
   //invalid target
   //remove withdraw target from memory
   if (!Game.getObjectById(creep.memory.withdraw)) {
    //creep.clearJob('withdraw');
    //assign new withdraw target
    creep.memory.withdraw = creep.assignTask('withdraw');
   }
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
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     //bad target followed by empty sources = eat while you can
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
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
  case -10:
   //invalid target
   //remove withdraw target from memory
   if (!Game.getObjectById(creep.memory.withdraw)) {
    //creep.clearJob('withdraw');
    //assign new withdraw target
    creep.memory.withdraw = creep.assignTask('withdraw');
   }
   creep.memory.harvest = creep.assignTask('harvest');
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
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     //bad target followed by empty sources = eat while you can
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
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
   return 'state0 -10';
  }
 }
}
