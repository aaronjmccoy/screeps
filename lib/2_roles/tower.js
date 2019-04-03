function tower(structure) {
  if (!structure.room.memory.tower.whack) {
    structure.room.memory.tower.whack = [];
  }
  var enemies = Memory.rooms[structure.room.name].tower.whack;
  var hurt = Memory.rooms[structure.room.name].tower.aid;
  var damaged = Memory.rooms[structure.room.name].tower.fix;
  if (!structure.room.memory.towers) {
    structure.room.memory.towers = {};
  }
  if (!structure.room.memory.towers[structure.id]) {
    structure.room.memory.towers[structure.id] = {};
    structure.room.memory.towers[structure.id].mode = 'alert';
  }
  if (structure.energy <= 100 || enemies.length > 0) {
    structure.room.memory.towers[structure.id].mode = 'alert';
  } else {
    structure.room.memory.towers[structure.id].mode = 'repair';
  }
  var mode = structure.room.memory.towers[structure.id].mode;
  if (mode == 'alert') {
    if (enemies.length > 0) {
      if (enemies.length > 1) {
        enemies.sort(function(a, b) {
          return a.hits - b.hits;
        });
      }
      structure.attack(Game.getObjectById(enemies[0]));
    } else if (hurt.length > 0) {
      if (hurt.length > 1) {
        hurt.sort(function(a, b) {
          return a.hits - b.hits;
        });
      }
      structure.heal(hurt[0]);
    }
  } else if (mode == 'repair') {
    structure.repair(Game.getObjectById(damaged[0]));
    structure.heal(Game.getObjectById(hurt[0]));
  }
}
//not using this yet, not sure it makes sense to divide their tasks
StructureTower.prototype.requestTask = function(task) {
  if (!this.room.memory.towers[this.id]) {
    this.room.memory.towers[this.id] = {};
  }
  Memory.rooms[this.room.name].towers[this.id][task] = Game.rooms[this.room.name].releaseTask('tower', task);
  if (Memory.rooms[this.room.name].towers[this.id][task]) {
    Memory.rooms[this.room.name].tower[task].push(Memory.rooms[this.room.name].towers[this.id][task]);
    return true;
  } else {
    Memory.rooms[this.room.name].towers[this.id][task] = null;
    return false;
  }
};
