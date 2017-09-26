//first set memory structures
if (!Memory.recipes) {
 Memory.recipes = {};
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
   6: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
   //rcl 7 2300 - 5600
   7: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
   //rcl 8 5600 - 12900
   8: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK]

  },
  options: {
   //add role for creep function call
   role: 'frog',
   //limit resource type to avoid chemical poisoning
   resourceType: RESOURCE_ENERGY,
   jobs: {
    construct: null,
    collect: null,
    fix: null,
    sweep: null,
    mine: null,
    eat: null,
    upgrade: null
   }
  }
 };
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
   5: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 6 1800 - 2300
   6: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 7 2300 - 5600
   7: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 8 5600 - 12900
   8: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]

  },
  options: {
   //add role for creep function call
   role: 'newt',
   //limit resource type to avoid chemical poisoning
   resourceType: RESOURCE_ENERGY,
   jobs: {
    deposit: null,
    collect: null,
    sweep: null,
    eat: null
   }
  }
 };
 Memory.recipes.minnow = {
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
   5: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 6 1800 - 2300
   6: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 7 2300 - 5600
   7: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 8 5600 - 12900
   8: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]

  },
  options: {
   //add role for creep function call
   role: 'minnow',
   jobs: {
    eat: null
   },
   to: null,
   from: null
  }
 };
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
   6: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, CARRY, CARRY],
   //rcl 7 2300 - 5600
   7: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY],
   //rcl 8 5600 - 12900
   8: [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE]

  },
  options: {
   //add role for creep function call
   role: 'toad',
   //limit resource type to avoid chemical poisoning
   resourceType: RESOURCE_ENERGY,
   builtcontainer: 0,
   jobs: {
    construct: null,
    fix: null,
    sweep: null,
    mine: null,
    eat: null,
    upgrade: null
   }
  }
 };
}
Memory.emoji = {
 //EMOJI CAUSE YOLO
 frog: '🐸',
 construct: '🛠️️',
 deconstruct: '⛏',
 fix: '🏚️',
 mine: '💰',
 upgrade: '⚡',
 eat: '🍽️',
 deposit: '✨',
 collect: '✨',
 oops: '☠️',
 whack: '⚔️',
 pew: '🔫',
 aid: '💊',
 sweep: '✨',
 suicide: '💮',
 sogood: '✨🐸✨',
 hop: '💨'
};
//export my loop logic
module.exports.loop = function () {
 //SCREEP TASK HANDLING THE EZPZ WAY by herbo4
 /*
   We start by agreeing that the best way to program practical frameworks in a
 turn based RTS is to evaluate the current state at every atomic resolution of
 time, in this case the tick. Every tick, we want to update our information as
 efficiently as possible while still maintaining current information to build,
 harvest, and defend by. This is my attempt at executing an engine operating
 within this category of simulations that emulates a philosophy of "Iterate
 once, execute once" as a baseline for having perfect information at it's most
 efficient of costs. We start with items that are independant to our access via
 the API, aka things we do not own or control except as an external force.
 */
 //creep reporting//
 /*
 All creep need to do these every turn so we do them first:
 -If we are tracking a population, census reporting should happen. Population
   only needs to be edited when creep are born or die.
 -If a creep is hungry we should change their memory to indicate they are
 -The first two creep per spawn that are hungry should get in line to eat
 -If a creep is damaged it should report for aid
 -If a creep has energy it's energyState should be 1, else 0
 -If a creep with a destination can not move it should re-path
 -If a creep has nothing to do, it should evaluate it's usefulness per cycle
   and decide if it should live or not. We can use transaction data relevant to
   the creep to decide this by programming in energy transaction logs and move
   efficiency.
 -If a creep is outdated for the current rcl and the new creep have been
   generated, it should sacrifice itself.
 -We should bear in mind that we want to maintain live info while also not
   making tons of checks. This means we should look for ways to only check creep
   that need to be checked. We acheive this by making them sad when they need
   something.
 */
 for (let name in Memory.creeps) {
  //clearing of the dead from memory
  if (!Game.creeps[name]) {
   //alter population count on death
   Game.rooms[Memory.creeps[name].home][Memory.creeps[name].role] = Game.rooms[Memory.creeps[name].home][Memory.creeps[name].role] - 1;
   //delete creep from memory
   delete Memory.creeps[name];
   //then keep iterating over other creeps
  } else {
   //if a creep is sad for any reason we check on it
   if (Game.creeps[name].memory.sad) {
    //If a creep is hungry, we let the creep decide if it wants to get in the
    //supper queue by changing the hunger value on its memory. we only commit
    //this full check on every 5th tick.
    if (Game.creeps[name].ticksToLive < 420) {
     Game.creeps[name].memory.hungry = true;
    }
    //if a creep is full then we need to flip the hunger back to false
    if (Game.creeps[name].ticksToLive > 1400) {
     Game.creeps[name].memory.hungry = false;
    }
    //if a creep is injured report to towers for healing.
    if (Game.creeps[name].hits < Game.creeps[name].hitsMax) {
     Game.rooms[Game.creeps[name].memory.home].tower.aid.push(Game.creeps[name].id);
    }

    //set creeps energyState
    Game.creeps[name].memory.energyState = Game.creeps[name].carry[RESOURCE_ENERGY];

    //if a creep is stuck
    if (Game.creeps[name].memory.stuck) {
     //try to renavigate to your target.
     switch (Game.creeps[name].moveTo(Game.creeps[name].memory.target)) {
      //if that works great
     case 0:
      Game.creeps[name].memory.stuck = 0;
      console.log(name + ' renavigated pursuing ' + target);
      break;
      //creep is stuck in a jam
     case -2:
      if (Game.creeps[name].memory.stuck < 10) {
       Game.creeps[name].memory.stuck += 1;
      } else {
       Game.creeps[name].sacrifice();
      }
      break;
      //creep's target became invalid
     case -7:
      Game.creeps[name].memory.target = null;
     }
    }
    /*
    Some folks I talk with think having a handler for creeps without work is
    a good idea so you can do that here. I haven't worked out a great use
    case yet because I think you really should never have idle creep while
    there are controllers you can pour energy into.
    */
    if (Game.creeps[name].memory.bored) {
     //count to ten
     if (Game.creeps[name].memory.bored < 10) {
      Game.creeps[name].memory.bored += 1;
     } else {
      Game.creeps[name].sacrifice();
     }
    }
    //if a creep is outdated and the room is maxed
    if (Game.creeps[name].memory.rank < Game.rooms[Game.creeps[name].memory.home].contoller.level &&
     (Game.rooms[Game.creeps[name].memory.home].energyCapacityAvailable == Game.rooms[Game.creeps[name].memory.home].energyAvailable)
    ) {
     Game.creeps[name].sacrifice();
    }
   }
   //if creep is not sad then it's doing great. it deserves chemical enhancement
   //code coming after I learn more.
   //BEGIN SPECIAL CLASS SPECIFIC CODE
   if (Game.creeps[name].memory.role == 'frog') {
    //if you are a frog with less energy than you can carry
    if (Game.creeps[name].carry.energy < Game.creeps[name].carryCapacity) {
     //push yourself to the deposit tasks on the newt job board
     Game.rooms[Game.creeps[name].memory.home].memory.newt.deposit.push(creep.id);
    }
   }
   //END SPECIAL CLASS SPECIFIC CODE
  }

 }
 //building reporting
 for (let s in Game.structures) {
  let structure = Game.structures[s];
  try {
   //EZPZ : Visit once report once
   structure.report();
  } catch (e) {
   console.log('No report method for ' + structures[structure]);
  }
 }
 //now room specific memory
 for (let r in Memory.rooms) {
  var room = Game.rooms[r];
  //if you can see it
  if (room) {
   room.initializeMemory();
   if (room.memory.parentRoom) {
    room.queueTasks(Game.rooms[room.memory.parentRoom]);
   } else {
    room.queueTasks();
   }
  }
 }
 //building action
 for (let s in Game.structures) {
  let structure = Game.structures[s];
  switch (structure.structureType) {
  case 'tower':
   tower(structure);
   break;
  case 'spawn':
   if (Memory.spawns[structure.name].queen) {
    queen(structure);
   }
   break;
  }
 }
 //creep action
 for (let name in Memory.creeps) {
  switch (creep.memory.role) {
  case 'frog':
   creep.say(creep.frog());
   break;
  case 'toad':
   creep.say(creep.toad());
   break;
  case 'newt':
   creep.say(creep.newt());
   break;
  case 'minnow':
   creep.say(creep.minnow());
   break;
  }
 }
}

};
//graphs
//collect_stats();
