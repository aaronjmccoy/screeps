Creep.prototype.newt = function () {
 //state flipper
 if (this.carry.energy < this.carryCapacity) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
 }

 //if this has energy
 if (this.memory.state) {
  return this.deposit();
 }
 //if this has no energy
 else {
  return this.collect();
 }
};
