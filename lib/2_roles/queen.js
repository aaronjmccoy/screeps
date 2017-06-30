//we currently have no interest in taking rooms we can't build spawns in, so
//initialize room goes here with our first building in any room
function initialize(r) {

 //initialize room if not already initialized
 if (Game.time % 5) {
  Memory.rooms[r.name] = {};
 }
 if (!Memory.rooms[r.name].sc) {
  Memory.rooms[r.name].sc = (r.find(FIND_SOURCES).length);
 }
 if (!Memory.rooms[r.name].pc) {
  Memory.rooms[r.name].pc = (Memory.rooms[r.name].sc * 3000);
 }
 if (!Memory.rooms[r.name].pt) {
  Memory.rooms[r.name].pt = Math.ceil(Memory.rooms[r.name].pc / 300);
 }
 if (!Memory.rooms[r.name].jobs) {
  Memory.rooms[r.name].jobs = {
   list: [],
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
 }
 if (!Memory.rooms[r.name].miningSpots) {
  Memory.rooms[r.name].miningSpots = r.miningSpots(r.find(FIND_SOURCES));
 }
}

function queen(spawn) {
 const r = spawn.room;
 initialize(r);
 if (r.memory.jobs.upgrade.tasks) {
  r.memory.jobs.upgrade.tasks.push(r.controller.id);
  r.memory.jobs.deposit.tasks.push(spawn.id);
  r.memory.jobs.eat.tasks.push(spawn.id);
 }
 const containers = r.find(FIND_STRUCTURES, { filter: (s) => s.structureType == 'container' });
 if (containers.length) {
  //console.log(containers);
  for (let container in containers) {
   containers[container].report();
  }
 }
 const dust = r.find(FIND_DROPPED_RESOURCES);
 if (dust.length) {
  for (let d in dust) {
   var mote = dust[d];
   r.memory.jobs.sweep.tasks.push(dust[d].id);
  }
 }
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;
 let newtCap = (Math.min(r.memory.jobs.collect.tasks.length, r.memory.jobs.deposit.tasks.length) ? Math.min(r.memory.jobs.collect.tasks.length, r.memory.jobs.deposit.tasks.length) : 0);
 let frogCap = (Math.max(r.memory.jobs.construct.tasks.length, dust.length + r.memory.sc) ? Math.max(r.memory.jobs.construct.tasks.length, dust.length + r.memory.sc) : 1);
 let toadCap = r.memory.sc;
 //we want to spawn creeps based on tasks needing to be done

 //so we have a variable count for toads since it takes a while for max mining on a single toad
 if (r.roleCount('toad') < toadCap) {
  //console.log(toadCap);
  let creepName = spawn.spawnCreep(toad, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(toad, rcl);
  }
 } else
 if (r.roleCount('frog') < frogCap) {
  //console.log(frogCap);
  let creepName = spawn.spawnCreep(frog, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(frog, rcl);
  }
 } else
 if (r.roleCount('newt') < newtCap) {
  //console.log(newtCap);
  let creepName = spawn.spawnCreep(newt, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, rcl);
  }
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, 1);
  }
 }
}
