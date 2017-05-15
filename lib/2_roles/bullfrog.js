function bullfrog(creep) {
    //var extend = reds(creep);
    var target = Game.flags['destroy'];
    if (target) {
        creep.say('flop');
        creep.moveTo(target);
        if (creep.room === Game.flags['claim'].room) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    } else {
        creep.say('bop');
        if(Game.getObjectById(creep.memory.home).recycleCreep(creep)==ERR_NOT_IN_RANGE){
          creep.moveTo(Game.getObjectById(creep.memory.home));
        }
    }
}

function spawnBullfrog(){
  Game.spawns.Spawn2.createCreep([ATTACK, MOVE], Game.time + '_bullfrog', {role: 'bullfrog'});
}
