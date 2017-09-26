Room.prototype.initializeMemory = function () {
 /*
 Task boards for roles are cleared & repopulated at the beginning of every tick
 */
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
 this.memory.roles = {
  frog: 0,
  newt: 0,
  toad: 0,
  squatter: 0
 };
 //basic room info into memory
 if (!this.memory.initialized) {
  //initialize room tower memory if not present
  if (!this.memory.towers) {
   this.memory.towers = {};
  }
  //source memory
  if (!this.memory.sc) {
   let sources = this.find(FIND_SOURCES);
   this.memory.sc = (sources.length);
   this.memory.sources = [];
   for (let i = 0; i < sources.length; i++) {
    this.memory.sources.push({ id: sources[i].id, pos: sources[i].pos });
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
 }
};

Room.prototype.queueTasks = function (parentRoom) {
  //hostiles
  /*
  On a per room basis, we want to keep track of enemy activity in live time.
  This means every tick we need to check for hostiles. Theoretically you could
  wrap this in a function that only executed once every n-th tick, but why would
  we do that? We want perfect information live.
  */
  //The game provides for a FIND constant of hostile creeps so we take advantage of that
  const enemies = this.find(FIND_HOSTILE_CREEPS);
  //If we have enemies
  if (enemies.length) {
   //for each enemy
   for (let e in enemies) {
    var enemy = enemies[e];
    //manual report since we can't call functions on creep we don't control
    //If it is a large enemy
    if (enemy.hitsMax > 2500) {
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
  const dust = this.find(FIND_DROPPED_RESOURCES);
  if (dust.length) {
   for (let d in dust) {
    var mote = dust[d];
    //EZPZ : Visit once report once
    mote.report();
   }
  }
  //source reporting
  if (this.memory.sources.length) {
   for (let s in this.memory.sources) {
    var source = this.memory.sources[s];
    //EZPZ : Visit once report once
    this.memory.toad.mine.push(source.id);
    if (Memory.rooms[this.name].parentRoom) {
     //and if this is a colony cry for help from your Parents
     Memory.rooms[Memory.rooms[this.name].parentRoom].frog.mine.push(source.id);
    }
   }
  }
  //construction sites task reporting
  for (let id in Game.constructionSites) {
   if (Game.getObjectById(id).room.name == this.name) {
    Memory.rooms[this.name].frog.construct.push(id);
    Memory.rooms[this.name].toad.construct.push(id);
   }
   if (Memory.rooms[parentRoom]) {
    //and if this is a colony cry for help from your Parents
    Memory.rooms[parentRoom].frog.construct.push(id);
   }

  }
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
    creep's request function (roles/creep.js line 12). This creates a parity in task
    assignment and creep count that allows us to manage our task assignments on a
    perfect 1 - 1 basis or else evenly distributing excess workforce. Think of
    it as a carousel: there are 8 horses. We can line up any number of children
    and evenly distribute them among the horses simply by assigning them one at
    a time to every horse as it comes along.

    This promotes the philosophy in my task handling engine heavily:

        "Only do what needs to be done now while also doing everything we can in one pass
        as we iterate over each object to ease CPU usage in the future."
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
