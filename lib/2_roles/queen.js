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
   attack: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   build: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   transfer: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   withdraw: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   heal: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   repair: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   pickup: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   harvest: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   eat: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   upgradeController: {
    workers: {},
    tasks: {},
    assignment: {}
   },
  };
 }
 if (!Memory.rooms[r.name].miningSpots) {
  Memory.rooms[r.name].miningSpots = r.miningSpots(r.find(FIND_SOURCES));
 }
}

function queen(spawn) {
 const r = spawn.room;
 if (!Memory.rooms[r.name]) {
  initialize(r);
  Memory.rooms[r.name].jobs.transfer.tasks[spawn.id] = spawn.id;
  Memory.rooms[r.name].jobs.eat.tasks[spawn.id] = spawn.id;
  Memory.rooms[r.name].jobs.upgradeController.tasks[r.controller.id] = r.controller.id;
 }
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;

 //we want to spawn creeps based on tasks needing to be done
 //so we have a variable count for toads since it takes a while for max mining on a single toad
 if (r.roleCount('toad') < r.memory.sc) {
  spawnCreep(spawn, toad, rcl);
 } //else if ((r.roleCount('newt') < Object.keys(r.gather).length) || (r.roleCount('newt') < Object.keys(r.sweep).length)) {
 //we make newts based on the amount of gather tasks we have
 //spawnCreep(spawn, newt);
 //} else if (r.roleCount('frog') < Object.keys(r.construct).length) {
 //we make frogs based on the amount of build tasks we have
 //spawnCreep(spawn, frog);
 //}


}
