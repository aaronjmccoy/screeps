function queen(spawn) {
 const r = spawn.room;
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;
 let newtCap = Math.max(Math.min(r.memory.jobs.collect.length, r.memory.jobs.deposit.length), r.memory.sc);
 let frogCap = Math.max(Math.min(r.memory.jobs.construct.length, r.memory.jobs.sweep.length), r.memory.sc);
 let toadCap = r.memory.sc;
 //we want to spawn creeps based on tasks needing to be done
 let toads = r.roleCount('toad');
 //console.log(spawn.room.name+' toads: '+toads+' toadcap: '+toadCap);
 let frogs = r.roleCount('frog');
 //console.log(spawn.room.name+' frogs: '+frogs+' frogcap: '+frogCap);
 let newts = r.roleCount('newt');
 //console.log(spawn.room.name+' newts: '+newts+' newtCap: '+newtCap);
 //so we have a variable count for toads since it takes a while for max mining on a single toad
 if (toads < toadCap) {
  //console.log(toadCap);
  let creepName = spawn.spawnCreep(toad, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(toad, rcl);
  }
}else
 if (newts < newtCap) {
  //console.log(newtCap);
  let creepName = spawn.spawnCreep(newt, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, rcl);
  }
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, 1);
  }
 } else
 if (frogs < frogCap) {
  //console.log(frogCap);
  let creepName = spawn.spawnCreep(frog, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(frog, rcl);
  }
 }
}
