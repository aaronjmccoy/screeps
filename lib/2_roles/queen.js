//we currently have no interest in taking rooms we can't build spawns in, so
//initialize room goes here with our first building in any room
function initialize(r) {

 //initialize room if not already initialized
 Memory.rooms[r.name] = {};
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
   mote.report();
  }
 }
 if (!Memory.rooms[r.name]) {
  initialize(r);
  r.memory.jobs.upgrade.tasks.add(r.controller.id);
  r.memory.jobs.deposit.tasks.add(spawn.id);
  r.memory.jobs.eat.tasks.add(spawn.id);
 }
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;
 let newtCap = (Math.max(r.memory.jobs.collect.tasks.length, r.memory.jobs.deposit.tasks.length) ? Math.max(r.memory.jobs.collect.tasks.length, r.memory.jobs.deposit.tasks.length) : 0);
 let frogCap = (Math.max(r.memory.jobs.construct.tasks.length, dust.length + r.memory.sc) ? Math.max(r.memory.jobs.construct.tasks.length, dust.length + r.memory.sc) : 1);
 let toadCap = (rcl < 3 ? r.memory.sc * 2 : r.memory.sc);
 //we want to spawn creeps based on tasks needing to be done

 //so we have a variable count for toads since it takes a while for max mining on a single toad
 if (r.roleCount('toad') < toadCap) {
  //console.log(toadCap);
  let creepName = spawn.spawnCreep(toad, rcl);
 } else
 if (r.roleCount('frog') < frogCap) {
  //console.log(frogCap);
  let creepName = spawn.spawnCreep(frog, rcl);
 } else
 if (r.roleCount('newt') < newtCap) {
  //console.log(newtCap);
  let creepName = spawn.spawnCreep(newt, rcl);
 }
}
