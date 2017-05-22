function assignSpot(creep) {
 for (let source in Memory.rooms[creep.room.name].sources) {
  if (Memory.rooms[creep.room.name].lastAssignedSource == source) {
   continue;
  }
  for (let spot in Memory.rooms[creep.room.name].sources[source].spots) {
   if (!Game.getObjectById(Memory.rooms[creep.room.name].sources[source].spots[spot])) {
    Memory.rooms[creep.room.name].sources[source].spots[spot] = creep.id;
    Memory.rooms[creep.room.name].lastAssignedSource = source;
    return source;
   } else if (creep.memory.priority > Game.getObjectById(Memory.rooms[creep.room.name].sources[source].spots[spot]).memory.priority) {
    Game.getObjectById(Memory.rooms[creep.room.name].sources[source].spots[spot]).suicide();
    Memory.rooms[creep.room.name].sources[source].spots[spot] = creep.id;
    Memory.rooms[creep.room.name].lastAssignedSource = source;
    return source;
   }
  }
 }
 return creep.pos.findClosestByRange(FIND_SOURCES).id;
}
