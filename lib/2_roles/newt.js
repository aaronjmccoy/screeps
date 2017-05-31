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
   creep.memory.eat = creep.assignTask('eat');
   //head towards eating if this repeats
   if (creep.eat(Game.getObjectById(creep.memory.eat)) < 0) {
     creep.say(creep.eat(Game.getObjectById(creep.memory.eat)));
    creep.moveTo(Game.getObjectById(creep.memory.eat), {
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
   //console.log(creep.eat(Game.getObjectById(creep.memory.eat)));
   creep.memory.transfer = creep.assignTask('transfer');
   creep.memory.eat = creep.assignTask('eat');
   //head towards eating if this repeats
   if (creep.eat(Game.getObjectById(creep.memory.eat)) < 0) {
    creep.moveTo(Game.getObjectById(creep.memory.eat), {
     visualizePathStyle: {
      fill: '#ffcc00',
      stroke: '#ffcc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -8;
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
   //creep.say('Not Enough', false);
   creep.memory.withdraw = creep.assignTask('withdraw');
   //head towards eating if this repeats
   creep.memory.pickup = creep.assignTask('pickup');
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
   delete creep.room.memory.jobs.pickup.tasks[creep.memory.pickup];
   return -6;
  case -7:
   //invalid target
   //creep.say('Bad Target', false);
   creep.memory.withdraw = creep.assignTask('withdraw');
   creep.memory.pickup = creep.assignTask('pickup');
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
   delete creep.room.memory.jobs.pickup.tasks[creep.id];
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
