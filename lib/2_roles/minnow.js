//minnows simply run resources between 'from' and it's room's storage until from is empty
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
 if (!this.room.controller.my) {
  this.collectAura();
 } else {
  this.sweepAura();
  this.depositAura();
 }
 if (this.memory.hungry) {
  if (this.requestTask('eat')) {
   return this.eat();
  }
 }

 if (this.memory.state) {
  this.moveTo(Game.rooms[this.memory.room].storage);
  for (let resourceType in this.carry) {
   this.transfer(Game.rooms[this.memory.room].storage, resourceType);
  }
  return Memory.emoji.hop;
 }
 //if this has no energy
 else {
  this.moveTo(Game.flags.minnow);
  if (!this.room.controller.my) {
   if (this.room.storage) {
    for (let resourceType in this.room.storage.store) {
     this.withdraw(this.room.storage, resourceType);
    }
   } else if (this.room.terminal) {
    for (let resourceType in this.room.storage.store) {
     this.withdraw(this.room.storage, resourceType);
    }
   }
  }
  return Memory.emoji.hop;
 }
};
