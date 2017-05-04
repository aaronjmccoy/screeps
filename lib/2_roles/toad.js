function toad(creep) {
  if(creep.carry[creep.resourceType] === 0){
    creep.memory.important = 'mine';
  }
  gatherAura(creep);
  //in rcl3 we want toads to mine sources and deposit to containers
  act(creep);
    if (!creep.memory.to) {
        var source = Game.getObjectById(creep.memory.mine);
        var container = source.pos.findClosestByRange(FIND_STRUCTURES, {filter : (c) => c.structureType == STRUCTURE_CONTAINER});
        if(container){
          creep.memory.to = [container.id];
        }
    }
}
