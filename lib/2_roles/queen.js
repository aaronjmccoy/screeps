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
    if (!Memory.rooms[r.name].miningSpots) {
        Memory.rooms[r.name].miningSpots = r.miningSpots(r.find(FIND_SOURCES));
    }
    if (!Memory.rooms[r.name].jobs) {
        Memory.rooms[r.name].jobs = {
            attack: {},
            construct: {},
            deposit: {},
            gather: {},
            heal: {},
            fix: {},
            sweep: {}
        });
}
if (!Memory.rooms[r.name].attack) {
    Memory.rooms[r.name].attack = {});
}
if (!Memory.rooms[r.name].construct) {
    Memory.rooms[r.name].construct = {});
}
if (!Memory.rooms[r.name].deposit) {
    Memory.rooms[r.name].deposit = {});
}
if (!Memory.rooms[r.name].gather) {
    Memory.rooms[r.name].gather = {});
}
if (!Memory.rooms[r.name].heal) {
    Memory.rooms[r.name].heal = {});
}
if (!Memory.rooms[r.name].fix) {
    Memory.rooms[r.name].fix = {});
}
if (!Memory.rooms[r.name].sweep) {
    Memory.rooms[r.name].sweep = {});
}
}

//limit the redspawn population to the number of available mining spots + the number of sources for an extra miner to replace rotating creep
function queen(spawn) {
    const r = spawn.room;
    if (!Memory.rooms[r.name]) {
        initialize(r);
    }
    const rcl = r.controller.level;
    //spawn logic
    //rcl switch
    let frog = Memory.recipes.frog;
    let toad = Memory.recipes.toad;
    let newt = Memory.recipes.newt;

    //we want to spawn creeps based on tasks needing to be done
    //so we have a variable count for toads since it tkes a while for max mining on a single toad
    if (r.roleCount('toad') < r.memory.sc * toad.options.popcount[rcl]) {
        spawnCreep(spawn, toad);
    } else
    //we make newts based on the amount of gather tasks we have
    if ((r.roleCount('newt') < Object.keys(r.gather).length)||(r.roleCount('newt') < Object.keys(r.sweep).length)) {
        spawnCreep(spawn, newt);
    } else
    //we make frogs based on the amount of build tasks we have
    if (r.roleCount('frog') < Object.keys(r.construct).length) {
        spawnCreep(spawn, frog);
    }


}
