function initialize(r) {
    //initialize room if not already initialized

    Memory.rooms[r.name] = {};
    if (!Memory.rooms[r.name].sc) {
        Memory.rooms[r.name].sc = (findSources(r).length);
    }
    if (!Memory.rooms[r.name].pc) {
        Memory.rooms[r.name].pc = (Memory.rooms[r.name].sc * 3000);
    }
    if (!Memory.rooms[r.name].pt) {
        Memory.rooms[r.name].pt = Math.ceil(Memory.rooms[r.name].pc / 300);
    }
    if (!Memory.rooms[r.name].miningSpots) {
        Memory.rooms[r.name].miningSpots = r.miningSpots();
    }
}

function findSources(r) {
    return r.find(FIND_SOURCES);
}
