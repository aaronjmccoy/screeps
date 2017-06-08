Creep.prototype.frog() = function () {
 //state flipper
 if (this.carry.energy === 0) {
  this.memory.state = 0;
 }
 //if this has energy
 else if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
 }

 //if this has energy
 if (this.memory.state) {
  this.say(this.construct());
 }
 //if this has no energy
 else {
  this.say(this.collect());
 }
}
