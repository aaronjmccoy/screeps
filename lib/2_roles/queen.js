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
  console.log(containers);
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
 let withdrawCap = (r.memory.jobs.collect.tasks ? r.memory.jobs.collect.tasks.size : 0);
 let frogCap = (r.memory.jobs.construct.tasks ? r.memory.jobs.construct.tasks.size : 0);
 let pickupCap = (r.memory.jobs.sweep.tasks ? r.memory.jobs.sweep.tasks.size : 0);
 //we want to spawn creeps based on tasks needing to be done
 //so we have a variable count for toads since it takes a while for max mining on a single toad
 if (r.roleCount('toad') < r.memory.sc) {
  let creepName = spawn.spawnCreep(toad, rcl);
  //assign toad jobs

 } else if (r.roleCount('newt') < withdrawCap) {
  //we make newts based on the amount of gather tasks we have
  console.log(withdrawCap + ":" + pickupCap);
  let creepName = spawn.spawnCreep(newt, rcl);
 } else if (r.roleCount('frog') < frogCap) {
  //we make frogs based on the amount of build tasks we have
  let creepName = spawn.spawnCreep(frog, rcl);
 }


}
