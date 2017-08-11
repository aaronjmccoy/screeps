function queen(spawn) {
 const r = spawn.room;
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;
 let minnow = Memory.recipes.minnow;
 let newtCap = r.memory.sc;
 let frogCap = r.memory.jobs.construct.length ? r.memory.jobs.construct.length : 1;
 let toadCap = r.memory.sc;
 let minnowCap = (r.storage && Game.flags.minnow ? 2 : 0);
 //we want to spawn creeps based on tasks needing to be done
 let toads = r.roleCount('toad');
 //console.log(spawn.room.name + ' toads: ' + toads + ' toadcap: ' + toadCap);
 let frogs = r.roleCount('frog');
 console.log(spawn.room.name + ' frogs: ' + frogs + ' frogcap: ' + frogCap);
 let newts = r.roleCount('newt');
 //console.log(spawn.room.name+' newts: '+newts+' newtCap: '+newtCap);
 let minnows = r.roleCount('minnow');
 //console.log(spawn.room.name + ' minnows: ' + minnows + ' minnowCap: ' + minnowCap);
 if (toads < toadCap) {
  //console.log(toadCap);
  let creepName = spawn.spawnCreep(toad, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(toad, rcl);
  }
 } else
 if (newts < newtCap) {
  //console.log(newtCap);
  let creepName = spawn.spawnCreep(newt, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, rcl);
  }
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, rcl - 1);
  }
 } else
 if (frogs < frogCap) {
  //console.log(frogCap);
  let creepName = spawn.spawnCreep(frog, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(frog, rcl);
  }
 } else
 if (minnows < minnowCap) {
  //console.log(frogCap);
  let creepName = spawn.spawnCreep(minnow, rcl);
 }
}
