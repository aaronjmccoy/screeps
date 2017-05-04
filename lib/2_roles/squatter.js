function squatter(creep) {
    //var extend = reds(creep);
    var target = Game.flags['claim'];
    if (target) {
        creep.moveTo(target);
        if (creep.room === Game.flags['claim'].room) {
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    } else {
        if(Game.getObjectById(creep.memory.home).recycleCreep(creep)==ERR_NOT_IN_RANGE){
          creep.moveTo(Game.getObjectById(creep.memory.home));
        }
    }
}

function spawnSquatter(){
  Game.spawns.Spawn1.createCreep([CLAIM, MOVE], Game.time + '_squatter');
}
