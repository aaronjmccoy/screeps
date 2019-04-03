function queen(spawn) {
  var r = spawn.room;
  var rcl = r.controller.level;
  //load recipes for creep
  var frog = Memory.recipes.frog;
  var toad = Memory.recipes.toad;
  var newt = Memory.recipes.newt;
  var minnow = Memory.recipes.minnow;
  var claimer = Memory.recipes.claimer;
  var squatter = Memory.recipes.squatter;
  var shark = Memory.recipes.shark;
  //set population caps
  var childrenCount = (r.memory.children?r.memory.children.length:0);
  var newtCap = Math.min(r.memory.newt.collect.length, 15);
  var frogCap = 1+(childrenCount*2);
  var toadCap =  r.memory.toad.mine.length;
  var minnowCap = 0;
  var claimCap = 0;
  var sharkCap = Math.ceil(r.memory.shark.defend.length/2);
  var squatCap = r.memory.squatter.squat.length;
  var toads = r.roleCount('toad');
  //console.log(spawn.room.name + ' toads: ' + toads + ' toadcap: ' + toadCap);
  var frogs = r.roleCount('frog');
  //console.log(spawn.room.name + ' frogs: ' + frogs + ' frogcap: ' + frogCap);
  var newts = r.roleCount('newt');
  //console.log(spawn.room.name+' newts: '+newts+' newtCap: '+newtCap);
  var minnows = r.roleCount('minnow');
  //console.log(spawn.room.name + ' minnows: ' + minnows + ' minnowCap: ' + minnowCap);
  var claimers = r.roleCount('claimer');
  //console.log(spawn.room.name + ' minnows: ' + minnows + ' minnowCap: ' + minnowCap);
  var squatters = r.roleCount('squatter');
  //console.log(spawn.room.name + ' squatters: ' + squatters + ' squatCap: ' + squatCap);
  var sharks = r.roleCount('shark');
  //console.log(spawn.room.name + ' minnows: ' + minnows + ' minnowCap: ' + minnowCap);
  if (toads < toadCap) {
    for (var _i2 = 0; _i2 < rcl; _i2++) {
      spawn.spawnCreep(toad, Math.min(rcl+1 - _i2, 5));
    }
  } else if (newts < newtCap) {
    for (var _i3 = 0; _i3 < rcl; _i3++) {
        spawn.spawnCreep(newt, Math.min(rcl - _i3 + 1, 8));
    }
  } else if (frogs < frogCap) {
    for (var _i4 = 0; _i4 < rcl; _i4++) {
      spawn.spawnCreep(frog, rcl - _i4 + 1);
    }
  } else if (minnows < minnowCap) {
    spawn.spawnCreep(minnow, 2);
  } else if (claimers < claimCap) {
    spawn.spawnCreep(claimer, 1);
  } else if (sharks < sharkCap && (r.energyAvailable == r.energyCapacityAvailable)) {
    spawn.spawnCreep(shark, rcl);
  } else if (squatters < squatCap) {
    spawn.spawnCreep(squatter, rcl);
  }
}
