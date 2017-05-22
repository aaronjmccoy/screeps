function spawnCreep(spawn, creepRecipe, rcl) {
 switch (spawn.createCreep(creepRecipe.parts[rcl], Game.time, creepRecipe.options)) {
 case -1:
  //don't own the creep
  console.log('You do not own the spawn being told to create a creep');
  break;
 case -3:
  //creep name already taken
  console.log('There is already a creep with this name');
  break;
 case -4:
  //creep is being spawned
  console.log('Spawn is already spawning  creep');
  break;
 case -6:
  //no more energy to spend
  console.log('Not enough energy to spawn creep');
  break;
 case -10:
  //invalid body
  console.log('Body part array not properly formed: ');
  console.log(JSON.stringify(creepRecipe.parts[rcl]));
  break;
 case -14:
  //rcl dropped
  console.log('RCL no longer sufficient to use this spawn');
 }
}
