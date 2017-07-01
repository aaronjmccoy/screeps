function queen(spawn) {
 const r = spawn.room;
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;
 let newtCap = Math.min(r.memory.jobs.collect.tasks.length, r.memory.jobs.deposit.tasks.length);
 let frogCap = Math.max(r.memory.jobs.construct.tasks.length, r.memory.jobs.sweep.tasks.length + r.memory.sc);
 let toadCap = r.memory.sc;
 //we want to spawn creeps based on tasks needing to be done

 //so we have a variable count for toads since it takes a while for max mining on a single toad
 if (r.roleCount('toad') < toadCap) {
  //console.log(toadCap);
  let creepName = spawn.spawnCreep(toad, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(toad, rcl);
  }
 } else
 if (r.roleCount('frog') < frogCap) {
  //console.log(frogCap);
  let creepName = spawn.spawnCreep(frog, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(frog, rcl);
  }
 } else
 if (r.roleCount('newt') < newtCap) {
  //console.log(newtCap);
  let creepName = spawn.spawnCreep(newt, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, rcl);
  }
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, 1);
  }
 }
}
