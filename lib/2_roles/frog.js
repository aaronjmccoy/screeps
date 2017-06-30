Creep.prototype.frog = function () {
 //state flipper
 if (this.carry.energy === 0) {
  this.memory.state = 0;
 }
 if (this.carry.energy < this.carryCapacity) {
  this.createTask('deposit');
 }
 //if this has energy
 else if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
  this.deleteTask('deposit');
 }
 this.constructAura();
 //if this has energy
 if (this.memory.state) {
  this.collectAura();
  this.sweepAura();
  this.depositAura();
  return this.construct();
 }
 //if this has no energy
 else {
  this.collectAura();
  this.sweepAura();
  return this.collect();
 }
};
