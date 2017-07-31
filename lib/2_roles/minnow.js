//minnows simply run resources between the minnow flag room and their room's storage
Creep.prototype.minnow = function () {
 //state flipper
 if (_.sum(this.carry) === 0) {
  this.memory.state = 0;
 }
 if (_.sum(this.carry) > this.carryCapacity / 2) {
  this.memory.state = 1;
 }

 //attempt all non-exclusive action auras
 //if this has energy
 if (this.room.controller && this.room.controller.my) {
  this.sweepAura();
  this.dumpAura();
 } else {
  this.vacuumAura();
 }

 if (this.memory.hungry) {
  if (this.requestTask('eat')) {
   this.moveTo(Game.getObjectById(this.memory.jobs.eat));
   this.eatAura();
   return Memory.emoji.hop;
  }
 }

 if (this.memory.state) {
  this.memory.checkpoint = 0;
  if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
   this.moveTo(Game.rooms[this.memory.room].storage);
  } else {
   this.moveTo(Game.rooms[this.memory.room].storage, { noPathFinding: true });
  }
  if (this.room.terminal) {
   for (let resourceType in this.carry) {
    this.transfer(Game.rooms[this.memory.room].terminal, resourceType);
   }
  }
  if (this.room.storage) {
   for (let resourceType in this.carry) {
    this.transfer(Game.rooms[this.memory.room].storage, resourceType);
   }
  }
  return Memory.emoji.hop;
 }
 //if this has no energy
 else {
  if (this.pos.isEqualTo(Game.flags.minnow.pos)) {
   this.memory.checkpoint = 1;
  }
  if (this.memory.checkpoint > 0) {
   if (!this.room.controller || !this.room.controller.my) {
    if (this.room.storage) {
     if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
      this.moveTo(this.room.storage);
     } else {
      this.moveTo(this.room.storage, { noPathFinding: true });
     }
     for (let resourceType in this.room.storage.store) {
      this.withdraw(this.room.storage, resourceType);
     }
    }
    if (this.room.terminal) {
     if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
      this.moveTo(this.room.terminal);
     } else {
      this.moveTo(this.room.terminal, { noPathFinding: true });
     }
     for (let resourceType in this.room.terminal.store) {
      this.withdraw(this.room.terminal, resourceType);
     }
    }
   }
  } else {
   // Perform pathfinding only if we have enough CPU
   if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
    this.moveTo(Game.flags.minnow);
   }
   this.moveTo(Game.flags.minnow, { noPathFinding: true });
  }
  return Memory.emoji.hop;
 }
};
