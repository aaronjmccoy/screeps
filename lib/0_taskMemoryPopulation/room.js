Room.prototype.initializeMemory = function() {
  //base haulers
  this.memory.newt = {
    collect: [],
    deposit: [],
    eat: []
  };
  //remote haulers
  this.memory.minnow = {
    collect: [],
    deposit: [],
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
    whack: []
  };
  //initialize room tower memory if not present
  if (!this.memory.towers) {
    this.memory.towers = {};
  }
  //basic room info into memory
  if (!this.memory.sc) {
    let sources = this.find(FIND_SOURCES);
    this.memory.sc = (sources.length);
    this.memory.sources = [];
    for (let i = 0; i < sources.length; i++) {
      this.memory.sources.push({id: sources[i].id, pos: sources[i].pos});
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

Room.prototype.queueTasks = function(parentRoom) {
  //independant items first
  //hostiles
  const enemies = this.find(FIND_HOSTILE_CREEPS);
  if (enemies.length) {
    for (let e in enemies) {
      var enemy = enemies[e];
      //manual report since we can't call functions on creep we don't control
      if (enemy.hits > 2500) {
        this.memory.shark.whack.push(enemy.id);
        if (parentRoom) {
          Memory.rooms[parentRoom].shark.whack.push(enemy.id);
        }
      } else {
        this.memory.tower.whack.push(enemy.id);
      }
    }
  }
  //dropped resources reporting
  const dust = this.find(FIND_DROPPED_RESOURCES);
  if (dust.length) {
    for (let d in dust) {
      var mote = dust[d];
      mote.report();
    }
  }
  //source reporting
  if (this.memory.sources.length) {
    for (let s in sources) {
      var source = sources[s];
      source.report();
    }
  }
  //construction sites task reporting
  for (let id in Game.constructionSites) {
    //manual push for these too, its just too easy to write a function
    Memory.rooms[this.room.name].frog.construct.push(id);
    Memory.rooms[this.room.name].toad.construct.push(id);
    if (parentRoom) {
      parentRoom.memory.frog.construct.push(id);;
    }

  }
  //structure task reporting, does not include containers or roads if you use FIND_MY_STRUCTURES
  const structures = this.find(FIND_STRUCTURES);
  if (structures.length) {
    for (let structure in structures) {
      try {
        structures[structure].report();
      } catch (e) {
        console.log('No report method for ' + structure.structureType);
      }
    }
  }
  //creep task reporting
  const creeps = this.find(FIND_MY_CREEPS);
  if (creeps.length) {
    for (let c in creeps) {
      var creep = creeps[c];
      //// stopped here ////
      if (creep.hits < creep.hitsMax) {
        this.memory.tower.aid.push(creep.id);
      }
      if (creep.hits < creep.hitsMax/2) {
        this.memory.tower.aid.push(creep.id);
      }
      if (Memory.rooms[creep.memory.room]) {
        if (!Memory.rooms[creep.memory.room].roles[creep.memory.role]) {
          Memory.rooms[creep.memory.room].roles[creep.memory.role] = 1;
        } else {
          Memory.rooms[creep.memory.room].roles[creep.memory.role] += 1;
        }
      }
      if (creep.memory.role == 'frog') {
        if (creep.carry.energy < creep.carryCapacity) {
          //console.log('frog pushing deposit to ' + this.name);
          this.memory.newt.deposit.push(creep.id);
          if (parentRoom) {
            Memory.rooms[parentRoom].newt.deposit.push(creep.id);
          }
        }
      }
    }
  }
};

Room.prototype.releaseTask = function(role, job) {
  if (!this.memory.[role][job]) {
    this.memory.[role][job] = [];
  }
  if (this.memory.[role][job].length > 0) {
    return this.memory.[role][job].shift();
  } else {
    return null;
  }
};

Room.prototype.roleCount = function(roleString) {
  if (!Memory.rooms[this.name].roles[roleString]) {
    Memory.rooms[this.name].roles[roleString] = 0;
  }
  //console.log(roleString + ' ' + this.name + ' ' + Memory.rooms[this.name].roles[roleString]);
  return Memory.rooms[this.name].roles[roleString];
};
