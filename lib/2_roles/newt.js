Creep.prototype.newt = function () {
 //state flipper
 if (this.carry.energy == 0) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (this.carry.energy > 0) {
  this.memory.state = 1;
 }
 //if this has energy
 if (this.memory.state) {
  //primary tasks in order of importance inside of state logic
  if (this.requestTask('deposit')) {
   return this.deposit();
  } else
  if (this.requestTask('eat')) {
   return this.eat();
  }
 }
 //if this has no energy
 else {
  //primary tasks in order of importance inside of state logic
  if (this.requestTask('sweep')) {
   return this.sweep();
  } else
  if (this.requestTask('collect')) {
   return this.collect();
  }
 }
};
