function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}
Room.prototype.initializeMemory = function() {

  //claimer
  this.memory.claimer = {
    claim: []
  };
  //squatter
  this.memory.squatter = {
    squat: []
  };
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
    eat: [],
    defend: [],
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
      this.memory.sources.push({id: sources[_i].id, pos: sources[_i].pos});
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
  this.memory.initialized = 1;
};

Room.prototype.queueTasks = function(parentRoom) {
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
  //console.log('begin task queuing for room '+this.name+' with parent '+parentRoom);
  var enemies = this.find(FIND_HOSTILE_CREEPS);
  //If we have enemies
  if (enemies.length) {
    //for each enemy
    for (var e in enemies) {
      var enemy = enemies[e];
      //manual report since we can't call functions on creep we don't control
      this.memory.shark.whack.push(enemy.id);
      this.memory.tower.whack.push(enemy.id);
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
        //console.log(source.id);
        Game.getObjectById(source.id).report();
      }
    }
    //construction sites task reporting
    for (var id in Game.constructionSites) {
      if (Game.getObjectById(id).room && Game.getObjectById(id).room.name == this.name) {
        //console.log('CONSTRUCT: ROOM '+this.name+' should equal '+ Game.getObjectById(id).room);
        Memory.rooms[this.name].frog.construct.push(id);
        Memory.rooms[this.name].toad.construct.push(id);
      }
    }
    //structure task reporting, does not include containers or roads if you use FIND_MY_STRUCTURES
    var structures = this.find(FIND_STRUCTURES);
    if (structures.length) {
      for (var structure in structures) {
        //I'm playing with whether I like try/catch right now, and structures
        //have been particularly difficult to weild.
        if(!structures[structure].my && structures[structure].structureType != 'container' && structures[structure].structureType != 'road' && structures[structure].structureType != 'controller'&& structures[structure].structureType != 'constructedWall' ){
            //console.log('deconstruct in room:'+this+structures[structure]);
            this.memory.frog.deconstruct.push(structures[structure].id);
        }
        try {
          //EZPZ : Visit once report once
          structures[structure].report();
        } catch (e) {
          //console.log('No report method for ' + structures[structure]);
          if(structures[structure].structureType == 'container'){
              //console.log('Manual report for container');
              container(structures[structure]);
          }
          if(structures[structure].structureType == 'road'){
              road(structures[structure]);
          }
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
          if (this.memory.tower) {
            //report it to the tower aid board
            this.memory.tower.aid.push(creep.id);
          }
          if(this.memory.shark.aid){
            this.memory.shark.aid.push(creep.id);
          }
        }
        //if the creep is bored
        //if (creep.memory.bored) {}
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
            //console.log('new '+creep.memory.role+' count for room '+creep.memory.room+': '+Memory.rooms[creep.memory.room].roles[creep.memory.role]);
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
          if (creep.carry.energy < creep.carryCapacity/2) {
            //push yourself to the deposit tasks on the newt and toad boards
            this.memory.newt.deposit.push(creep.id);
          }
        }
      }
    }
    //now we push any jobs to our parent if we need to
    if (parentRoom) {
      //console.log('parent time for '+this.name+' getting help from '+parentRoom);
      //sharks
      Memory.rooms[parentRoom].shark.eat.push.apply(Memory.rooms[parentRoom].shark.eat,Memory.rooms[this.name].shark.eat);
      Memory.rooms[parentRoom].shark.whack.push.apply(Memory.rooms[parentRoom].shark.whack,Memory.rooms[this.name].shark.whack);
      Memory.rooms[parentRoom].shark.defend.push.apply(Memory.rooms[parentRoom].shark.defend,Memory.rooms[this.name].shark.defend);
      Memory.rooms[parentRoom].shark.aid.push.apply(Memory.rooms[parentRoom].shark.aid,Memory.rooms[this.name].shark.aid);
      //frogs
      Memory.rooms[parentRoom].frog.deconstruct.push.apply(Memory.rooms[parentRoom].frog.deconstruct,Memory.rooms[this.name].frog.deconstruct);
      Memory.rooms[parentRoom].frog.construct.push.apply(Memory.rooms[parentRoom].frog.construct,Memory.rooms[this.name].frog.construct);
      Memory.rooms[parentRoom].frog.collect.push.apply(Memory.rooms[parentRoom].frog.collect,Memory.rooms[this.name].frog.collect);
      Memory.rooms[parentRoom].frog.fix.push.apply(Memory.rooms[parentRoom].frog.fix,Memory.rooms[this.name].frog.fix);
      Memory.rooms[parentRoom].frog.upgrade.push.apply(Memory.rooms[parentRoom].frog.upgrade,Memory.rooms[this.name].frog.upgrade);
      //newts
      Memory.rooms[parentRoom].newt.sweep.push.apply(Memory.rooms[parentRoom].newt.sweep,Memory.rooms[this.name].newt.sweep);
      Memory.rooms[parentRoom].newt.collect.push.apply(Memory.rooms[parentRoom].newt.collect,Memory.rooms[this.name].newt.collect);
      Memory.rooms[parentRoom].newt.deposit.push.apply(Memory.rooms[parentRoom].newt.deposit,Memory.rooms[this.name].newt.deposit);
      //toads
      Memory.rooms[parentRoom].toad.construct.push.apply(Memory.rooms[parentRoom].toad.construct,Memory.rooms[this.name].toad.construct);
      Memory.rooms[parentRoom].toad.fix.push.apply(Memory.rooms[parentRoom].toad.fix,Memory.rooms[this.name].toad.fix);
      Memory.rooms[parentRoom].toad.deposit.push.apply(Memory.rooms[parentRoom].toad.deposit,Memory.rooms[this.name].toad.deposit);
      Memory.rooms[parentRoom].toad.sweep.push.apply(Memory.rooms[parentRoom].toad.sweep,Memory.rooms[this.name].toad.sweep);
      Memory.rooms[parentRoom].toad.mine.push.apply(Memory.rooms[parentRoom].toad.mine,Memory.rooms[this.name].toad.mine);
      Memory.rooms[parentRoom].toad.eat.push.apply(Memory.rooms[parentRoom].toad.eat,Memory.rooms[this.name].toad.eat);
      //squatter
      Memory.rooms[parentRoom].squatter.squat.push.apply(Memory.rooms[parentRoom].squatter.squat,Memory.rooms[this.name].squatter.squat);

    }
};
/* This is the end point for all our not-so-hard work: we have a memory structure
which populates the entirety of our needs based on a single pass-through of
observations. Now we can pass that memory off to our workers, and to do so we
write a task release handler. We do this to acheive enforcing even distribution
of work force across all tasks. All we have to do is make sure our requests line
up with our structure, ordering by role and then task. */
Room.prototype.releaseTask = function(role, task) {
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
Room.prototype.roleCount = function(roleString) {
  //if the string doesn't exist no creeps reported to create it
  if (!Memory.rooms[this.name].roles[roleString]) {
    //assign 0
    Memory.rooms[this.name].roles[roleString] = 0;
  }
  //else return string
  return Memory.rooms[this.name].roles[roleString];
};
