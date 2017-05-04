function build(creep) {
  //Find closest construction site and store in memory
  if(creep.memory.colony){
    creep.memory.target = Game.getObjectById(creep.memory.colony);
  }else{
    creep.memory.target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
  }

    //if no target is successfully stored
    if (!creep.memory.target || creep.memory.target === null) {
        //upgrade instead
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
            creep.upgradeController(creep.room.controller);
        }
    }
    //otherwise build at the site
    else if(creep.build(creep.memory.target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.memory.target);
        creep.build(creep.memory.target);
    }
    creep.moveTo(creep.memory.target);
}
