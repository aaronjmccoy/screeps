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
   creep.clearJob('build');
   if(creep.memory.build !== null){
     creep.memory.build = creep.assignTask('build');
   }
   if(creep.memory.upgradeController !== null){
     creep.memory.upgradeController = creep.assignTask('upgradeController');
   }
   //toad should harvest
   switch (creep.harvest(Game.getObjectById(creep.memory.harvest))) {
   case 0:
    //creep successfuly acted
    creep.say('BwaK', true);
    creep.upgradeController(Game.getObjectById(creep.room.controller));
    return 0;
   case -6:
    //not enough resources
    //head towards eating if this repeats
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
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
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
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
   if(creep.memory.build !== null){
     creep.memory.build = creep.assignTask('build');
   }
   switch (creep.harvest(Game.getObjectById(creep.memory.harvest))) {
   case 0:
    //creep successfuly acted
    creep.say('BwaK', true);
    creep.upgradeController(Game.getObjectById(creep.room.controller));
    return 0;
   case -6:
    //not enough resources
    //head towards eating if this repeats
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
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
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
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
   creep.memory.eat = creep.assignTask('eat');
   if (creep.eat(creep.memory.eat) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.eat), {
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
   creep.memory.eat = creep.assignTask('eat');
   if (creep.eat(creep.memory.eat) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.eat), {
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
