'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Room.prototype.initializeMemory = function () {
  //base haulers
  this.memory.newt = {
    collect: [],
    deposit: [],
    sweep: [],
    eat: []
  };
  //remote haulers
  this.memory.minnow = {
    collect: [],
    deposit: [],
    sweep: [],
    eat: []
  };
  //base builders and deconstructers
  this.memory.frog = {
    collect: [],
    construct: [],
    deconstruct: [],
    eat: [],
    fix: [],
    mine: [],
    sweep: [],
    upgrade: []
  };
  //remote miners
  this.memory.caecilian = {
    sweep: [],
    collect: [],
    deposit: [],
    eat: [],
    mine: []
  };
  //base miners
  this.memory.toad = {
    collect: [],
    construct: [],
    deposit: [],
    eat: [],
    fix: [],
    mine: [],
    sweep: [],
    upgrade: []
  };
  //base defense
  this.memory.tower = {
    aid: [],
    fix: [],
    whack: []
  };
  //remote defense
  this.memory.shark = {
    whack: [],
    aid: []
  };
  //initialize room tower memory if not present
  if (!this.memory.towers) {
    this.memory.towers = {};
  }
  //basic room info into memory
  if (!this.memory.sc) {
    var sources = this.find(FIND_SOURCES);
    this.memory.sc = sources.length;
    this.memory.sources = [];
    for (var _i = 0; _i < sources.length; _i++) {
      this.memory.sources.push({ id: sources[_i].id, pos: sources[_i].pos });
    }
  }
  if (!this.memory.storage) {
    if (this.storage) {
      this.memory.storage = {
        id: this.storage.id,
        pos: this.storage.pos
      };
    }
  }
  if (!this.memory.terminal) {
    if (this.terminal) {
      this.memory.terminal = {
        id: this.terminal.id,
        pos: this.terminal.pos
      };
    }
  }
  if (!this.memory.controller) {
    if (this.controller) {
      this.memory.controller = {
        id: this.controller.id,
        pos: this.controller.pos
      };
    }
  }
};

Room.prototype.queueTasks = function (parentRoom) {
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
  //hostiles
  /*
  On a per room basis, we want to keep track of enemy activity in live time.
  This means every tick we need to check for hostiles. Theoretically you could
  wrap this in a function that only executed once every n-th tick, but why would
  we do that? We want perfect information live.
  */
  //The game provides for a FIND constant of hostile creeps so we take advantage of that
  var enemies = this.find(FIND_HOSTILE_CREEPS);
  //If we have enemies
  if (enemies.length) {
    //for each enemy
    for (var e in enemies) {
      var enemy = enemies[e];
      //manual report since we can't call functions on creep we don't control
      //If it is a large enemy
      if (enemy.hits > 2500) {
        //feed it to the sharks
        this.memory.shark.whack.push(enemy.id);
        this.memory.tower.whack.push(enemy.id);
        if (parentRoom) {
          //and if this is a colony cry for help from your Parents
          Memory.rooms[parentRoom].shark.whack.push(enemy.id);
        }
      } else {
        //If it's a little enemy towers can deal with it
        this.memory.tower.whack.push(enemy.id);
      }
    }
  }
  //dropped resources reporting, ty game find constants again
  var dust = this.find(FIND_DROPPED_RESOURCES);
  if (dust.length) {
    for (var d in dust) {
      var mote = dust[d];
      //EZPZ : Visit once report once
      mote.report();
    }
  }
  //source reporting
  if (this.memory.sources.length) {
    for (var s in this.memory.sources) {
      var source = this.memory.sources[s];
      //EZPZ : Visit once report once
      this.memory.toad.mine.push(source.id);
      if (Memory.rooms[this.name].parentRoom) {
        //console.log(parentRoom);
        Memory.rooms[Memory.rooms[this.name].parentRoom].frog.mine.push(source.id);
      }
    }
  }
  //construction sites task reporting
  for (var id in Game.constructionSites) {
    if (Game.getObjectById(id).room.name == this.name) {
      Memory.rooms[this.name].frog.construct.push(id);
      Memory.rooms[this.name].toad.construct.push(id);
    }
    if (Memory.rooms[parentRoom]) {
      Memory.rooms[parentRoom].frog.construct.push(id);
    }
  }
  //structure task reporting, does not include containers or roads if you use FIND_MY_STRUCTURES
  var structures = this.find(FIND_STRUCTURES);
  if (structures.length) {
    for (var structure in structures) {
      //I'm playing with whether I like try/catch right now, and structures
      //have been particularly difficult to weild.
      try {
        //EZPZ : Visit once report once
        structures[structure].report();
      } catch (e) {
        //console.log('No report method for ' + structures[structure]);
      }
    }
  }
  //creep task reporting, ty game find constants
  var creeps = this.find(FIND_MY_CREEPS);
  if (creeps.length) {
    for (var c in creeps) {
      var creep = creeps[c];
      //if the creep is damaged
      if (creep.hits < creep.hitsMax) {
        //report it to the tower aid board
        this.memory.tower.aid.push(creep.id);
      }
      //if the creep is under half
      if (creep.hits < creep.hitsMax / 2) {
        //report it to the heavy healers
        this.memory.shark.aid.push(creep.id);
      }
      //if the creep is bored
      if (creep.memory.bored) {}
      /*
      Some folks I talk with think having a handler for creeps without work is
      a good idea so you can do that here. I haven't worked out a great use
      case yet because I think you really should never have idle creep while
      there are controllers you can pour energy into.
      */


      /*
      While we're here, iterating over this creep, it may be useful to gather as
      much info as we might need down the line. We start by taking a census:
      */
      //If the creep has a room stored in memory (which it should since they're born with that memory)
      if (Memory.rooms[creep.memory.room]) {
        //if there isn't a role count in room memory for that creep role yet
        if (!Memory.rooms[creep.memory.room].roles[creep.memory.role]) {
          //create it at 1
          //console.log('creating '+creep.memory.role+' memory at 1 for '+ creep.id+' in '+creep.room.name);
          Memory.rooms[creep.memory.room].roles[creep.memory.role] = 1;
        } else {
          //add that creep to that room's pop count
          //console.log('incrementing '+creep.memory.role+' memory by 1 for '+ creep.id+' in '+creep.room.name);
          Memory.rooms[creep.memory.room].roles[creep.memory.role] += 1;
          //console.log('new '+creep.memory.role+' count: '+Memory.rooms[creep.memory.room].roles[creep.memory.role]);
          //Now we have a nice neat memory object we can lookup any time for
          //population management purposes.
        }
      } else {
        //if the creep doesn't have it in memory it has amnesia
        if (!creep.memory.room) {
          //so it settles down in the small town that saved it from the car crash
          creep.memory.room = this.name;
        } else {
          //creep has room but room is not in memory, therefore he is an adventurer.
          //This creep claims these lands for our glory.
          Memory.rooms[creep.memory.room] = {};
          //Beautiful
        }
      }
      /*
      This is very specific to my class system. You may want to issue different
      role specific creep task requests here. Essentially, we do the baseline
      creep reporting first (low hp, nothing to do, population control) and
      specialize as needed below.
      */
      //frogs end-point at duping energy into the controller, meaning they always
      //need energy. When they are below max they should report.
      if (creep.memory.role == 'frog') {
        //if you are a frog with less energy than you can carry
        if (creep.carry.energy < creep.carryCapacity) {
          //push yourself to the deposit tasks on the newt and toad boards
          this.memory.newt.deposit.push(creep.id);
        }
      }
    }
  }
};

/*
This is the end point for all our not-so-hard work: we have a memory structure
which populates the entirety of our needs based on a single pass-through of
observations. Now we can pass that memory off to our workers, and to do so we
write a task release handler. We do this to acheive enforcing even distribution
of work force across all tasks. All we have to do is make sure our requests line
up with our structure, ordering by role and then task.
*/
Room.prototype.releaseTask = function (role, task) {
  //if the task being requested doesn't exist in Memory
  if (!this.memory[role][task]) {
    //create the placeholder array
    this.memory[role][task] = [];
  }
  //if it has length
  if (this.memory[role][task].length) {
    //return the bottom most element while ejecting it from the array
    return this.memory[role][task].shift();
    /*
    We eject it here knowing that the task will be pushed back to the top in the
    creep's request function (roles/creep.js). This creates a parity in task
    assignment and creep count that allows us to manage our task assignments on a
    perfect 1 - 1 basis or else evenly distributing excess workforce. Think of
    it as a carousel: there are 8 horses. We can line up any number of children
    and evenly distribute them among the horses simply by assigning them one at
    a time to every horse as it comes along.
     This promotes the philosophy in my task handling engine heavily:
         "Only do what needs to be done now while doing everything we can as we
      iterate over each object to ease CPU usage in the future."
      RE: EZPZ
     The structures and creeps populate their needs into memory, and then the
    creep with the appropriate skill set get in line to be assigned a task one at
    a time, by cycling the element back into the set we create the abstraction
    of the carousel's loop.
    */
  } else {
    return null;
  }
};
//RE:RE:EZPZ
//Now we have a neat, cheap function we can call any time to get a pop count
Room.prototype.roleCount = function (roleString) {
  //if the string doesn't exist no creeps reported to create it
  if (!Memory.rooms[this.name].roles[roleString]) {
    //assign 0
    Memory.rooms[this.name].roles[roleString] = 0;
  }
  //else return string
  return Memory.rooms[this.name].roles[roleString];
};

StructureContainer.prototype.report = function () {
  if (this.store.energy >= 50) {
    Memory.rooms[this.room.name].newt.collect.push(this.id);
    Memory.rooms[this.room.name].frog.collect.push(this.id);
  }
  if (_.sum(this.store) < this.storeCapacity) {
    Memory.rooms[this.room.name].toad.deposit.push(this.id);
  }
  if (this.hits < 10000) {
    Memory.rooms[this.room.name].frog.fix.push(this.id);
    Memory.rooms[this.room.name].toad.fix.push(this.id);
    Memory.rooms[this.room.name].tower.fix.push(this.id);
  }
};

StructureController.prototype.report = function () {
  //if our max energy capacity has been reached for given rcl
  //if (this.room.energyCapacity == CONTROLLER_STRUCTURES.spawn[this.room.rcl] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES.extension[this.room.rcl] * EXTENSION_ENERGY_CAPACITY[this.room.rcl]) {
  //push to task array
  Memory.rooms[this.room.name].frog.upgrade.push(this.id);
  Memory.rooms[this.room.name].toad.upgrade.push(this.id);
  //console.log(Memory.rooms[this.room.name].frog.upgrade);
  //}
};

StructureExtension.prototype.report = function () {
  if (this.room.controller.my) {
    //if I control the extension
    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
      Memory.rooms[this.room.name].toad.deposit.push(this.id);
      if (this.room.memory.parentRoom) {
        //console.log('has parent: '+this.room.memory.parentRoom);
        Game.rooms[this.room.memory.parentRoom].memory.newt.deposit.push(this.id);
        Memory.rooms[this.room.memory.parentRoom].toad.deposit.push(this.id);
      }
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
      Memory.rooms[this.room.name].frog.fix.push(this.id);
    }
  } else {
    //if I do not control the extension
    if (this.energy > 0) {
      //push to parent room scavengers
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].minnow.collect.push(this.id);
      }
    } else {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].frog.deconstruct.push(this.id);
      }
    }
  }
};

StructureLab.prototype.report = function () {
  if (this.room.controller.my) {
    //if I control the lab
    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
    }
    //lab logic here later
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].frog.fix.push(this.id);
      Memory.rooms[this.room.name].tower.fix.push(this.id);
    }
  } else {
    //if I do not control the lab
    if (this.energy > 0) {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].minnow.collect.push(this.id);
      }
    } else {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].frog.deconstruct.push(this.id);
      }
    }
  }
};

StructurePowerSpawn.prototype.report = function () {
  if (this.room.controller.my) {
    //if I control the powerspawn
    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
      Memory.rooms[this.room.name].frog.fix.push(this.id);
    }
  } else {
    //if I do not control the powerspawn
    if (this.energy > 0) {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].newt.collect.push(this.id);
      }
    } else {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].frog.deconstruct.push(this.id);
      }
    }
  }
};

StructureRampart.prototype.report = function () {
  if (this.room.controller.my) {
    //if I control the rampart
    if (this.hits < this.hitsMax / 8 * this.room.controller.level) {
      Memory.rooms[this.room.name].frog.fix.push(this.id);
    } else if (this.hits < this.room.controller.level * 100000) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
    }
    //auto-close when guarded
    if ([].concat(_toConsumableArray(this.room.lookAt(this.pos.x, this.pos.y))).length > 2) {
      this.setPublic(false);
    } else {
      this.setPublic(true);
    }
    //defensive close
    if (Memory.rooms[this.room.name].tower.whack.length > 0) {
      for (var e in Memory.rooms[this.room.name].tower.whack) {
        var enemy = Game.getObjectById(Memory.rooms[this.room.name].tower.whack[e]);
        if (this.pos.inRangeTo(enemy, 1)) {
          this.setPublic(false);
          return true;
        }
      }
    }
  } else {
    //if I do not control the rampart
    Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
  }
};

Resource.prototype.report = function () {
  if (this.resourceType == 'energy') {
    Memory.rooms[this.room.name].frog.sweep.push(this.id);
    Memory.rooms[this.room.name].newt.sweep.push(this.id);
    Memory.rooms[this.room.name].toad.sweep.push(this.id);
    Memory.rooms[this.room.name].minnow.sweep.push(this.id);
  } else {
    Memory.rooms[this.room.name].caecilian.sweep.push(this.id);
  }
};

StructureRoad.prototype.report = function () {
  if (this.hits < 4000) {
    Memory.rooms[this.room.name].frog.fix.push(this.id);
    Memory.rooms[this.room.name].toad.fix.push(this.id);
  }
  if (this.hits < 1500) {
    Memory.rooms[this.room.name].tower.fix.push(this.id);
  }
};

Source.prototype.report = function () {
  if (Memory.rooms[this.room.name].parentRoom) {
    //console.log(parentRoom);
    Memory.rooms[Memory.rooms[this.room.name].parentRoom].toad.mine.push(source.id);
  }
  //console.log(this.id+' to '+this.room.name);
  this.room.memory.toad.mine.push(this.id);
};

StructureSpawn.prototype.report = function () {
  if (this.room.controller.my) {
    //if I control the spawn
    //make sure evryone can eat
    Memory.rooms[this.room.name].frog.eat.push(this.id);
    Memory.rooms[this.room.name].toad.eat.push(this.id);
    Memory.rooms[this.room.name].newt.eat.push(this.id);
    Memory.rooms[this.room.name].minnow.eat.push(this.id);

    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
      Memory.rooms[this.room.name].toad.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
      Memory.rooms[this.room.name].frog.fix.push(this.id);
    }
  } else {
    //if I do not control the spawn
    if (this.energy > 0) {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].newt.collect.push(this.id);
      }
    } else {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].frog.deconstruct.push(this.id);
      }
    }
  }
};

StructureSpawn.prototype.spawnCreep = function (creepRecipe, rcl) {
  //We make sure to give the creep memory of it's home room for census purposes
  creepRecipe.options.room = this.room.name;
  switch (this.createCreep(creepRecipe.parts[rcl], creepRecipe.options.role + "_" + Game.time + "_" + this.room.name, creepRecipe.options)) {
    case -10:
      //invalid body
      console.log('Body part array not properly formed: ');
      console.log(JSON.stringify(creepRecipe.parts[rcl]));
      break;
    case -14:
      //rcl dropped
      console.log('RCL no longer sufficient to use this spawn');
  }
};

StructureStorage.prototype.report = function () {
  if (this.room.controller.my) {
    //if I control the storage
    if (this.store.energy >= 50) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
      Memory.rooms[this.room.name].frog.collect.push(this.id);
    }
    if (_.sum(this.store) < this.storeCapacity) {
      Memory.rooms[this.room.name].toad.deposit.push(this.id);
      Memory.rooms[this.room.name].minnow.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].frog.fix.push(this.id);
      Memory.rooms[this.room.name].toad.fix.push(this.id);
    }
  } else {
    //if I do not control the storage
    if (this.energy > 0) {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].newt.collect.push(this.id);
      }
    } else {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].frog.deconstruct.push(this.id);
      }
    }
  }
};

StructureTerminal.prototype.report = function () {
  if (this.room.controller.my) {
    //if I control the storage
    if (this.store.energy >= 50) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
      Memory.rooms[this.room.name].frog.collect.push(this.id);
    }
    if (_.sum(this.store) < this.storeCapacity) {
      Memory.rooms[this.room.name].toad.deposit.push(this.id);
      Memory.rooms[this.room.name].minnow.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].frog.fix.push(this.id);
      Memory.rooms[this.room.name].toad.fix.push(this.id);
    }
  } else {
    //if I do not control the storage
    if (this.energy > 0) {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].newt.collect.push(this.id);
      }
    } else {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].frog.deconstruct.push(this.id);
      }
    }
  }
};

StructureTower.prototype.report = function () {
  if (this.room.controller.my) {
    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].memory.frog.fix.push(this.id);
      Memory.rooms[this.room.name].memory.tower.fix.push(this.id);
    }
  } else {
    if (this.energy > 0) {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].newt.collect.push(this.id);
      }
    } else {
      if (Memory.rooms[this.room.name].parentRoom) {
        Memory.rooms[Memory.rooms[this.room.name].parentRoom].frog.deconstruct.push(this.id);
      }
    }
  }
};

StructureWall.prototype.report = function () {
  if (this.hits < 1000) {
    Memory.rooms[this.room.name].tower.fix.push(this.id);
    Memory.rooms[this.room.name].frog.fix.push(this.id);
  }
};

/*jshint -W008 */
//// HEAL PLUS ////
Creep.prototype.aid = function () {
  if (this.memory.tasks.aid) {
    switch (this.heal(Game.getObjectById(this.memory.tasks.aid))) {
      case 0:
        return Memory.emoji.aid;
      case -9:
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.tasks.aid), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffaaaa',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
  }
  return Memory.emoji.oops + Memory.emoji.aid + Memory.emoji.oops;
};

/*jshint -W008 */
/// WITHDRAW PLUS ///
Creep.prototype.collect = function () {
  if (this.memory.tasks.collect) {
    switch (this.withdraw(Game.getObjectById(this.memory.tasks.collect), this.memory.resourceType)) {
      case 0:
        return Memory.emoji.collect;
      case -9:
        if (!this.collectAura()) {
          //set move
          CM.set(this.pos.x, this.pos.y, 0);
          this.moveTo(Game.getObjectById(this.memory.tasks.collect), {
            reusePath: 10,
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#eeff99',
              lineStyle: 'dashed',
              strokeWidth: .15,
              opacity: .1
            },
            costCallback: CM
          });
          return Memory.emoji.hop;
        } else {
          return Memory.emoji.sogood;
        }
    }
  }
  return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
};

/*jshint -W008 */
//// BUILD PLUS ////
Creep.prototype.construct = function () {
  if (this.memory.tasks.construct) {
    CM.set(this.pos.x, this.pos.y, 0);
    this.moveTo(Game.getObjectById(this.memory.tasks.construct), {
      visualizePathStyle: {
        fill: 'transparent',
        stroke: '#aacc66',
        lineStyle: 'solid',
        strokeWidth: .15,
        opacity: .1
      }
    });
    switch (this.build(Game.getObjectById(this.memory.tasks.construct))) {
      case 0:
        return Memory.emoji.construct;
      case -9:
        if (!this.constructAura()) {
          //set move
          return Memory.emoji.hop;
        } else {
          return Memory.emoji.sogood;
        }

    }
  }
  return Memory.emoji.oops + Memory.emoji.construct + Memory.emoji.oops;
};

/*jshint -W008 */
//// BUILD PLUS ////
Creep.prototype.deconstruct = function () {
  if (this.memory.tasks.deconstruct) {
    switch (this.dismantle(Game.getObjectById(this.memory.tasks.deconstruct))) {
      case 0:
        return Memory.emoji.deconstruct;
      case -9:
        if (!this.deconstructAura()) {
          //set move
          CM.set(this.pos.x, this.pos.y, 0);
          this.moveTo(Game.getObjectById(this.memory.tasks.deconstruct), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#ff0000',
              lineStyle: 'solid',
              strokeWidth: .15,
              opacity: .4
            }
          });
          return Memory.emoji.hop;
        } else {
          return Memory.emoji.sogood;
        }

    }
  }
  return Memory.emoji.oops + Memory.emoji.deconstruct + Memory.emoji.oops;
};

/*jshint -W008 */
/// TRANSFER PLUS ///
Creep.prototype.deposit = function () {
  if (this.memory.tasks.deposit) {
    switch (this.transfer(Game.getObjectById(this.memory.tasks.deposit), RESOURCE_ENERGY)) {
      case 0:
        return Memory.emoji.deposit;
      case -9:
        this.depositAura();
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.tasks.deposit), {
          reusePath: 5,
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#eecc00',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
          },
          costCallback: CM
        });
        return Memory.emoji.frog;
    }
  }
  this.moveTo(this.room.storage, {
    reusePath: 5,
    ignoreCreeps: false,
    visualizePathStyle: {
      fill: 'transparent',
      stroke: '#eecc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
    },
    costCallback: CM
  });
  return Memory.emoji.sogood;
};

/*jshint -W008 */
//// RENEWCREEP PLUS ////
Creep.prototype.eat = function () {
  //any creep checking to eat with less hp thean 1400 should eat then
  if (this.ticksToLive < 420) {
    this.memory.hungry = true;
  } else {
    this.memory.hungry = false;
  }
  if (this.memory.tasks.eat) {
    this.depositAura();
    if (Game.getObjectById(this.memory.tasks.eat).renewCreep(this) === 0) {
      return Memory.emoji.eat;
    } else {
      //if hungry eat
      if (this.memory.hungry) {
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.tasks.eat), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#00eeff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
        //if not go back to a starting point
      } else {
        if (this.memory.role == 'toad') {
          this.moveTo(Game.getObjectById(this.memory.tasks.mine), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#eeff99',
              lineStyle: 'solid',
              strokeWidth: .15,
              opacity: .1
            }
          });
          return Memory.emoji.hop;
        } else {
          this.moveTo(Game.rooms[this.memory.room].storage);
          return Memory.emoji.hop;
        }
      }
    }
    return this.moveTo(Game.getObjectById(this.memory.tasks.eat), {
      visualizePathStyle: {
        fill: 'transparent',
        stroke: '#00eeff',
        lineStyle: 'solid',
        strokeWidth: .15,
        opacity: .1
      }
    });
  }
};

/*jshint -W008 */
//// REPAIR PLUS ////
Creep.prototype.fix = function () {
  if (this.memory.tasks.fix) {
    switch (this.repair(Game.getObjectById(this.memory.tasks.fix))) {
      case 0:
        return Memory.emoji.fix;
      case -9:
        if (!this.fixAura()) {
          //set move
          CM.set(this.pos.x, this.pos.y, 0);
          this.moveTo(Game.getObjectById(this.memory.tasks.fix), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#ffaaaa',
              lineStyle: 'solid',
              strokeWidth: .15,
              opacity: .5
            }
          });
          return Memory.emoji.fix;
        }
        return Memory.emoji.sogood;
    }
  }
  return Memory.emoji.oops + Memory.emoji.fix + Memory.emoji.oops;
};

/*jshint -W008 */
//// HARVEST PLUS ////
Creep.prototype.mine = function () {
  if (this.memory.tasks.mine) {
    switch (this.harvest(Game.getObjectById(this.memory.tasks.mine))) {
      case 0:
        var look = this.pos.look();
        var resourceCount = 0;
        look.forEach(function (lookObject) {
          if (lookObject.type == LOOK_RESOURCES) {
            resourceCount += 1;
          }
        });
        if (resourceCount > 0) {
          this.moveTo(Game.getObjectById(this.memory.tasks.mine));
        }
        return Memory.emoji.mine;
      case -9:
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.tasks.mine), {
          reusePath: 20,
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#eeff99',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
      case -6:
        //if the mine is empty go eat
        if (this.requestTask('eat')) {
          return this.eat();
        } else {
          return 'zzz';
        }
    }
  }
  return this.harvest(Game.getObjectById(this.memory.tasks.mine));
};

/*jshint -W008 */
/// PICKUP PLUS ///
Creep.prototype.sweep = function () {
  if (Game.getObjectById(this.memory.tasks.sweep).resourceType == 'energy') {
    switch (this.pickup(Game.getObjectById(this.memory.tasks.sweep))) {
      case 0:
        return Memory.emoji.sweep;
      case -9:
        if (!this.sweepAura()) {
          //set move
          CM.set(this.pos.x, this.pos.y, 0);
          this.moveTo(Game.getObjectById(this.memory.tasks.sweep), {
            reusePath: 10,
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#eecc00',
              lineStyle: 'dashed',
              strokeWidth: .15,
              opacity: .1
            },
            costCallback: CM
          });
          return Memory.emoji.hop;
        } else {
          return Memory.emoji.sogood;
        }

    }
  }
  return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
};

/*jshint -W008 */
//// UPGRADECONTROLLER PLUS ////
Creep.prototype.upgrade = function () {
  if (this.memory.tasks.upgrade) {
    this.signController("Ribbit");
    switch (this.upgradeController(Game.getObjectById(this.memory.tasks.upgrade))) {
      case 0:
        //CM.set(this.pos.x, this.pos.y, 255);
        //this.move(Math.random() * (8 - 1) + 1);
        //no need to clear memory for upgrade, controller is permanent
        return Memory.emoji.upgrade;
      case -9:
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.tasks.upgrade), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffffff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
  }
  return Memory.emoji.oops + Memory.emoji.upgrade + Memory.emoji.oops;
};

/*jshint -W008 */
//// ATTACK PLUS ////
Creep.prototype.whack = function () {
  if (this.memory.tasks.whack) {
    switch (this.attack(Game.getObjectById(this.memory.tasks.whack))) {
      case 0:
        //clear id from room's task set
        Game.getObjectById(this.memory.tasks.whack).deleteTask('whack');
        return Memory.emoji.whack;
      case -9:
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.tasks.whack), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ff0000',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.whack;
    }
  }
  return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
};

//mineral worker

//// TASK ASSIGNMENT ////
//get current assignment with Room.releaseTask
Creep.prototype.requestTask = function (task) {
  //if you don't have this task in memory yet make a prop for it
  if (!this.memory.tasks) {
    this.memory.tasks = {};
  }
  //request a task from the Room object you are working for
  this.memory.tasks[task] = Game.rooms[this.memory.room].releaseTask(this.memory.role, task);
  //if it didn't return null
  if (this.memory.tasks[task]) {
    //push the task back to the array for reasons explained in _room.js
    this.room.memory[this.memory.role][task].push(this.memory.tasks[task]);
    return true;
  } else {
    this.memory.tasks[task] = null;
    return false;
  }
};

//aura utilities for preliminary actions pre-movement
/*
I don't know if I like these or not. The principle is that they rely on the
arrays of data to be so well organized and granular that even when iterating
through the entire data set to deposit before moving first, that cost will be
negligible. Since they return the second they find a compatible target it seems
as good a method as any if the goal is to prevent uneccessary movement. It also
enables us to focus on saving cpu when pathfinding over task completion, since
task completion is array fast. Still, I think there is a more elegant approach.
*/
Creep.prototype.aidAura = function () {
  //Two for-loops look gnarly, but this allows us to sort by distance at the same
  //time it is still array fast.
  for (var wounded in Memory.rooms[this.memory.room][this.memory.role].aid) {
    if (this.heal(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].aid[wounded])) === 0) {
      return true;
    }
  }
  for (var _wounded in Memory.rooms[this.memory.room][this.memory.role].aid) {
    if (this.rangeHeal(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].aid[_wounded])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.collectAura = function () {
  for (var loot in Memory.rooms[this.memory.room][this.memory.role].collect) {
    if (this.withdraw(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].collect[loot]), this.memory.resourceType) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.constructAura = function () {
  for (var site in Memory.rooms[this.memory.room][this.memory.role].construct) {
    if (this.build(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].construct[site])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.deconstructAura = function () {
  for (var debris in Memory.rooms[this.memory.room][this.memory.role].deconstruct) {
    if (this.dismantle(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].deconstruct[debris])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.depositAura = function () {
  for (var bank in Memory.rooms[this.memory.room][this.memory.role].deposit) {
    if (this.transfer(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].deposit[bank]), this.memory.resourceType) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.eatAura = function () {
  for (var dinner in Memory.rooms[this.memory.room][this.memory.role].eat) {
    if (Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].eat[dinner]).renewCreep(this) === 0) {
      this.depositAura();
      return true;
    }
  }
  return false;
};

Creep.prototype.fixAura = function () {
  for (var broken in Memory.rooms[this.memory.room][this.memory.role].fix) {
    if (this.repair(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].fix[broken])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.mineAura = function () {
  for (var _source in Memory.rooms[this.memory.room][this.memory.role].mine) {
    if (this.harvest(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].mine[_source])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.sweepAura = function () {
  for (var mote in Memory.rooms[this.memory.room][this.memory.role].sweep) {
    if (this.pickup(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].sweep[mote])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.upgradeAura = function () {
  for (var controller in Memory.rooms[this.memory.room][this.memory.role].upgrade) {
    this.signController(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].upgrade[controller]), "Ribbit");
    if (this.upgradeController(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].upgrade[controller]), RESOURCE_ENERGY) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.whackAura = function () {
  for (var enemy in Memory.rooms[this.memory.room][this.memory.role].whack) {
    if (this.attack(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].whack[enemy])) === 0) {
      this.rangedMassAttack(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].whack[enemy]));
      return true;
    }
  }
  for (var _enemy in Memory.rooms[this.memory.room][this.memory.role].whack) {
    if (this.rangedAttack(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].whack[_enemy])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.frog = function () {
  //state flipper
  if (_.sum(this.carry) === 0) {
    this.memory.state = 0;
  }
  if (_.sum(this.carry) === this.carryCapacity) {
    this.memory.state = 1;
  }
  //attempt all non-exclusive action auras
  this.sweepAura();
  this.collectAura();
  this.fixAura();
  //if hungry eat
  if (this.memory.hungry) {
    if (this.requestTask('eat')) {
      this.moveTo(Game.getObjectById(this.memory.tasks.eat));
      this.eatAura();
      return Memory.emoji.hop;
    }
  }
  //if this has energy
  if (this.memory.state) {
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('construct')) {
      return this.construct();
    } else if (this.requestTask('fix')) {
      return this.fix();
    } else if (this.requestTask('upgrade')) {
      this.mineAura();
      return this.upgrade();
    } else if (this.requestTask('eat')) {
      return this.eat();
    } else {
      return 'zzz';
    }
  }
  //if this has no energy
  else {
      //primary tasks in order of importance inside of state logic
      if (this.requestTask('sweep')) {
        return this.sweep();
      } else if (this.requestTask('collect')) {
        return this.collect();
      } else if (this.requestTask('deconstruct')) {
        return this.deconstruct();
      } else {
        return 'zzz';
      }
    }
};

//scouts

Creep.prototype.minnow = function () {
  //state flipper
  if (_.sum(this.carry) === 0) {
    this.memory.state = //if creep has energy
    0;
  } else if (this.carry.energy > 0) {
    this.memory.state = 1;
  }

  if (!this.memory.from) {
    this.sweepAura();
    this.collectAura();
  }

  if (!this.memory.to) {
    if (this.depositAura()) {
      return Memory.emoji.sogood;
    }
  }
  //if this has energy
  if (this.memory.state) {
    if (this.memory.to) {
      for (var resourceType in this.carry) {
        if (this.transfer(Game.getObjectById(this.memory.to), resourceType) === 0) {
          return 'bibiibiii!';
        }
      }
      if (this.moveTo(Game.getObjectById(this.memory.to)) === 0) {
        return Memory.emoji.frog;
      }
    } else if (this.requestTask('deposit')) {
      return this.deposit();
    } else if (this.requestTask('eat')) {
      return this.eat();
      //if this has no energy;
    }
  } else {
    if (this.memory.from) {
      for (var _resourceType in RESOURCES_ALL) {
        if (this.withdraw(Game.getObjectById(this.memory.from), RESOURCES_ALL[_resourceType]) === 0) {
          return 'bibiibiii!';
        }
      }
      if (this.moveTo(Game.getObjectById(this.memory.from)) === 0) {
        return Memory.emoji.frog;
      }
    } else
      //primary tasks in order of importance inside of state logic
      if (this.requestTask('collect')) {
        return this.collect();
      } else if (this.requestTask('sweep')) {
        return this.sweep();
      } else if (this.requestTask('eat')) {
        return this.eat();
      }
  }
  return 'zzz';
};

Creep.prototype.newt = function () {
  //state flipper
  if (_.sum(this.carry) === 0) {
    this.memory.state = //if creep has energy
    0;
  } else if (this.carry.energy >= 50) {
    this.memory.state = 1;
  }

  if (!this.memory.from) {
    this.sweepAura();
    this.collectAura();
  }

  if (!this.memory.to) {
    if (this.depositAura()) {
      return Memory.emoji.sogood;
    }
  }
  //if this has energy
  if (this.memory.state) {
    if (this.memory.to) {
      for (var resourceType in this.carry) {
        if (this.transfer(Game.getObjectById(this.memory.to), resourceType) === 0) {
          return 'bibiibiii!';
        }
      }
      if (this.moveTo(Game.getObjectById(this.memory.to)) === 0) {
        return Memory.emoji.frog;
      }
    } else if (this.requestTask('deposit')) {
      return this.deposit();
    } else if (this.requestTask('eat')) {
      return this.eat();
      //if this has no energy;
    }
  } else {
    if (this.memory.from) {
      for (var _resourceType2 in RESOURCES_ALL) {
        if (this.withdraw(Game.getObjectById(this.memory.from), RESOURCES_ALL[_resourceType2]) === 0) {
          return 'bibiibiii!';
        }
      }
      if (this.moveTo(Game.getObjectById(this.memory.from)) === 0) {
        return Memory.emoji.frog;
      }
    } else
      //primary tasks in order of importance inside of state logic
      if (this.requestTask('collect')) {
        return this.collect();
      } else if (this.requestTask('sweep')) {
        return this.sweep();
      } else if (this.requestTask('eat')) {
        return this.eat();
      }
  }
  return 'zzz';
};

function queen(spawn) {
  var r = spawn.room;
  var rcl = r.controller.level;
  //load recipes for creep
  var frog = Memory.recipes.frog;
  var toad = Memory.recipes.toad;
  var newt = Memory.recipes.newt;
  var minnow = Memory.recipes.minnow;
  //set population caps
  var newtCap = r.memory.sc;
  var frogCap = r.memory.frog.construct.length ? r.memory.frog.construct.length : 1;
  var toadCap = r.memory.sc;
  var minnowCap = r.storage && Game.flags.minnow ? 2 : 0;
  var toads = r.roleCount('toad');
  //console.log(spawn.room.name + ' toads: ' + toads + ' toadcap: ' + toadCap);
  var frogs = r.roleCount('frog');
  //console.log(spawn.room.name + ' frogs: ' + frogs + ' frogcap: ' + frogCap);
  var newts = r.roleCount('newt');
  //console.log(spawn.room.name+' newts: '+newts+' newtCap: '+newtCap);
  var minnows = r.roleCount('minnow');
  //console.log(spawn.room.name + ' minnows: ' + minnows + ' minnowCap: ' + minnowCap);
  if (toads < toadCap) {
    for (var _i2 = 0; _i2 < rcl; _i2++) {
      spawn.spawnCreep(toad, rcl - _i2 + 1);
    }
  } else if (newts < newtCap) {
    for (var _i3 = 0; _i3 < rcl; _i3++) {
      spawn.spawnCreep(newt, rcl - _i3 + 1);
    }
  } else if (frogs < frogCap) {
    for (var _i4 = 0; _i4 < rcl; _i4++) {
      spawn.spawnCreep(frog, rcl - _i4 + 1);
    }
  } else if (minnows < minnowCap) {
    spawn.spawnCreep(minnow, rcl - i + 1);
  }
}

//warfare unit

Creep.prototype.toad = function () {
  //state flipper
  if (this.carry.energy < this.carryCapacity) {
    this.memory.state = 0;
  }
  if (this.carry.energy === this.carryCapacity) {
    this.memory.state = 1;
  }
  if (!this.depositAura()) {
    this.transfer(this.room.storage, this.memory.resourceType);
    this.transfer(this.room.terminal, this.memory.resourceType);
  }
  this.sweepAura();
  this.eatAura();
  this.mineAura();
  var roomMaxed = CONTROLLER_STRUCTURES.spawn[this.room.controller.level] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES.extension[this.room.controller.level] * EXTENSION_ENERGY_CAPACITY[this.room.controller.level];
  if (this.memory.hungry) {
    if (this.requestTask('eat')) {
      //this.requestTask('mine');
      return this.eat();
    }
  } else {
    if (roomMaxed) {
      if (!this.constructAura()) {
        if (!this.fixAura()) {
          this.upgradeAura();
        }
      }
    }
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('mine')) {
      return this.mine();
    } else if (this.requestTask('eat')) {
      return this.eat();
    }
    return Memory.emoji.frog;
  }
};

function tower(structure) {
  if (!structure.room.memory.tower.whack) {
    structure.room.memory.tower.whack = [];
  }
  var enemies = Memory.rooms[structure.room.name].tower.whack;
  var hurt = Memory.rooms[structure.room.name].tower.aid;
  var damaged = Memory.rooms[structure.room.name].tower.fix;
  if (!structure.room.memory.towers) {
    structure.room.memory.towers = {};
  }
  if (!structure.room.memory.towers[structure.id]) {
    structure.room.memory.towers[structure.id] = {};
    structure.room.memory.towers[structure.id].mode = 'alert';
  }
  if (structure.energy <= 100 || enemies.length > 0) {
    structure.room.memory.towers[structure.id].mode = 'alert';
  } else {
    structure.room.memory.towers[structure.id].mode = 'repair';
  }
  var mode = structure.room.memory.towers[structure.id].mode;
  if (mode == 'alert') {
    if (enemies.length > 0) {
      if (enemies.length > 1) {
        enemies.sort(function (a, b) {
          return a.hits - b.hits;
        });
      }
      structure.attack(Game.getObjectById(enemies[0]));
    } else if (hurt.length > 0) {
      if (hurt.length > 1) {
        hurt.sort(function (a, b) {
          return a.hits - b.hits;
        });
      }
      structure.heal(hurt[0]);
    }
  } else if (mode == 'repair') {
    structure.repair(Game.getObjectById(damaged[0]));
    structure.heal(Game.getObjectById(hurt[0]));
  } else {
    if (nearenemies.length > 0) {
      if (nearenemies.length > 1) {
        nearenemies.sort(function (a, b) {
          return a.hits - b.hits;
        });
      }
      structure.attack(nearenemies[0]);
    }
  }
}
//not using this yet, not sure it makes sense to divide their tasks
StructureTower.prototype.requestTask = function (task) {
  if (!this.room.memory.towers[this.id]) {
    this.room.memory.towers[this.id] = {};
  }
  Memory.rooms[this.room.name].towers[this.id][task] = Game.rooms[this.room.name].releaseTask('tower', task);
  if (Memory.rooms[this.room.name].towers[this.id][task]) {
    Memory.rooms[this.room.name].tower[task].push(Memory.rooms[this.room.name].towers[this.id][task]);
    return true;
  } else {
    Memory.rooms[this.room.name].towers[this.id][task] = null;
    return false;
  }
};

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
      tasks: {
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
      tasks: {
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
      tasks: {
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
      7: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, MOVE, CARRY],
      //rcl 8 5600 - 12900
      8: [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE]

    },
    options: {
      //add role for creep function call
      role: 'toad',
      //limit resource type to avoid chemical poisoning
      resourceType: RESOURCE_ENERGY,
      builtcontainer: 0,
      tasks: {
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
Memory.costMatrix = new PathFinder.CostMatrix();
var CM = Memory.costMatrix;
//export my loop logic
module.exports.loop = function () {
  //start by initializing memory and cost matrixes per room
  CM._bits.fill(255);
  for (var r in Memory.rooms) {
    var room = Game.rooms[r];
    if (room) {
      room.initializeMemory();
    }
  }
  //populate each task in each room with vision
  for (var _r in Memory.rooms) {
    var room = Game.rooms[_r];
    if (room) {
      //create memory structure
      room.memory.roles = {
        frog: 0,
        newt: 0,
        toad: 0,
        squatter: 0,
        minnow: 0
      };
      //console.log(room.memory.toad.mine.length);
      if (room.memory.parentRoom) {
        room.queueTasks(Memory.rooms[room.memory.parentRoom]);
      } else {
        //populate memory structure with tasks
        room.queueTasks();
      }
    }
  }
  //call role code to address tasks in memory
  //first structures
  for (var s in Game.structures) {
    var structure = Game.structures[s];
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
  //then creeps
  for (var name in Memory.creeps) {
    //clearing of the dead from memory
    if (!Game.creeps[name]) {
      //clear creep work registration
      delete Memory.creeps[name];
      //then keep iterating over other creeps
    } else if (Game.creeps[name]) {
      var creep = Game.creeps[name];
      var roomMaxed = false;
      if (EXTENSION_ENERGY_CAPACITY[Game.rooms[creep.memory.room].controller.level] * CONTROLLER_STRUCTURES.extension[Game.rooms[creep.memory.room].controller.level] <= Game.rooms[creep.memory.room].energyAvailable) {
        roomMaxed = true;
      }
      if (creep.ticksToLive < 420) {
        creep.memory.hungry = true;
      }
      if (creep.ticksToLive > 1400) {
        creep.memory.hungry = false;
      }
      if (!creep.memory.room) {
        creep.memory.room = creep.name.split('_')[2];
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
        case 'minnow':
          creep.say(creep.minnow());
          break;
      }
    }
  }
};
//graphs
//collect_stats();