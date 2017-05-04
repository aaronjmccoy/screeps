function eraseDead() {
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

}
//first clear memory
eraseDead();
//then trigger creep behavior
for (let name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == 'redspawn') {
        redspawn(creep);
    } else
    if (creep.memory.role == 'tadpole') {
        tadpole(creep);
    } else
    if (creep.memory.role == 'frog') {
        frog(creep);
    } else
    if (creep.memory.role == 'toad') {
        toad(creep);
    } else
    if (creep.memory.role == 'newt') {
        newt(creep);
    }
    if (creep.memory.role == 'squatter') {
        squatter(creep);
    }
}
//then trigger spawn behavior
for (let name in Game.spawns) {
  var spawn = Game.spawns[name];
  if(spawn.memory.queen){
    spawner(spawn);
  }
}
//then trigger towers
if (!Memory.towers){
  Memory.towers = {};
}
for (let towerID in Memory.towers) {
    tower(Game.getObjectById(towerID));
}
//then trigger links

//graphs
collect_stats();
