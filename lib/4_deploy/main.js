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
      jobs: {
        deposit: null,
        collect: null,
        sweep: null,
        eat: null
      }
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
  fix: '🏗️🏚️',
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
module.exports.loop = function() {
  //start by initializing memory per room
  for (let r in Memory.rooms) {
    var room = Game.rooms[r];
    room.initializeMemory();
    room.memory.jobs = {
      whack: {
        workers: [],
        tasks: []
      },
      construct: {
        workers: [],
        tasks: []
      },
      deposit: {
        workers: [],
        tasks: []
      },
      collect: {
        workers: [],
        tasks: []
      },
      aid: {
        workers: [],
        tasks: []
      },
      fix: {
        workers: [],
        tasks: []
      },
      sweep: {
        workers: [],
        tasks: []
      },
      mine: {
        workers: [],
        tasks: []
      },
      eat: {
        workers: [],
        tasks: []
      },
      upgrade: {
        workers: [],
        tasks: []
      },
    };
    room.queueTasks();
  }
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
  for (let name in Memory.creeps) {
    //clearing of the dead from memory
    if (!Game.creeps[name]) {
      //clear creep work registration
      delete Memory.creeps[name];
      //then keep iterating over other creeps
    } else
    if (Game.creeps[name]) {
      var creep = Game.creeps[name];
      if (!creep.memory.room) {
        creep.memory.room = creep.room.name;
      }
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
      }
    }
  }
};
//graphs
//collect_stats();
