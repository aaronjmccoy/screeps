Creep.prototype.frog = function () {
 this.depositAura();
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

 //if this has energy
 if (this.memory.state) {
  return this.construct();
 }
 //if this has no energy
 else {
  return this.collect();
 }
};
