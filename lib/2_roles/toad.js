Creep.prototype.toad = function () {
 //state flipper
 if (this.carry.energy === 0) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (this.carry.energy > 49) {
  this.memory.state = 1;
 }

 //if this has energy
 if (this.memory.state) {
  //console.log('frog this: ' + JSON.stringify(this));
  return this.construct();
 }
 //if this has no energy
 else {
  //console.log('frog this: ' + JSON.stringify(this));
  return this.mine();
 }
};
