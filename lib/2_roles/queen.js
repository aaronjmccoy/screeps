function queen(spawn) {
  const r = spawn.room;
  const rcl = r.controller.level;
  //load recipes for creep
  let frog = Memory.recipes.frog;
  let toad = Memory.recipes.toad;
  let newt = Memory.recipes.newt;
  let minnow = Memory.recipes.minnow;
  //set population caps
  let newtCap = r.memory.sc;
  let frogCap = r.memory.frog.construct.length ? r.memory.frog.construct.length
    : 1;
  let toadCap = r.memory.sc;
  let minnowCap = (r.storage && Game.flags.minnow?
    2
    : 0);
  let toads = r.roleCount('toad');
  //console.log(spawn.room.name + ' toads: ' + toads + ' toadcap: ' + toadCap);
  let frogs = r.roleCount('frog');
  //console.log(spawn.room.name + ' frogs: ' + frogs + ' frogcap: ' + frogCap);
  let newts = r.roleCount('newt');
  //console.log(spawn.room.name+' newts: '+newts+' newtCap: '+newtCap);
  let minnows = r.roleCount('minnow');
  //console.log(spawn.room.name + ' minnows: ' + minnows + ' minnowCap: ' + minnowCap);
  if (toads < toadCap) {
    for (let i = 0; i < rcl; i++) {
      spawn.spawnCreep(toad, rcl - i + 1);
    }
  } else if (newts < newtCap) {
    for (let i = 0; i < rcl; i++) {
      spawn.spawnCreep(newt, rcl - i + 1);
    }
  } else if (frogs < frogCap) {
    for (let i = 0; i < rcl; i++) {
      spawn.spawnCreep(frog, rcl - i + 1);
    }
  } else if (minnows < minnowCap) {
    spawn.spawnCreep(minnow, rcl - i + 1);
  }
}
