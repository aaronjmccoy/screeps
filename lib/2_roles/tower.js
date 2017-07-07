function tower(structure) {
 var nearenemies = structure.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
 if (!structure.room.memory.towers) {
  structure.room.memory.towers = {};
 }
 if (!structure.room.memory.towers[structure.id]) {
  structure.room.memory.towers[structure.id] = {};
 }
 if (!structure.room.memory.towers[structure.id].mode) {
  structure.room.memory.towers[structure.id].mode = 'alert';
 }
 if (structure.energy <= 100 || nearenemies.length > 0) {
  structure.room.memory.towers[structure.id].mode = 'alert';
 } else if (structure.energy > 100) {
  structure.room.memory.towers[structure.id].mode = 'repair';
 }
 var hurt;
 var mode = structure.room.memory.towers[structure.id].mode;
 if (mode == 'alert') {
  hurt = structure.room.find(FIND_MY_CREEPS, { filter: object => object.hits < object.hitsMax });
  if (nearenemies.length > 0) {
   if (nearenemies.length > 1) {
    nearenemies.sort((a, b) => a.hits - b.hits);
   }
   structure.attack(nearenemies[0]);
  } else if (hurt.length > 0) {
   if (hurt.length > 1) {
    hurt.sort((a, b) => a.hits - b.hits);
   }
   structure.heal(hurt[0]);
  }


 } else if (mode == 'repair') {
  var damaged = structure.room.memory.jobs.fix;
  //console.log('Detecting damaged structures');
  structure.repair(Game.getObjectById(damaged[0]));
  hurt = structure.room.memory.jobs.aid;
  structure.heal(Game.getObjectById(hurt[0]));
} else{
  if (nearenemies.length > 0) {
   if (nearenemies.length > 1) {
    nearenemies.sort((a, b) => a.hits - b.hits);
   }
   structure.attack(nearenemies[0]);
  }
 }
}
