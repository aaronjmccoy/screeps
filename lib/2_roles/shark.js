//warfare unit
Creep.prototype.shark = function() {
  //if this has hp
  //this.whackAura();
  if(this.hits < this.hitsMax){
      this.heal(this);
  }else{
      this.aidAura();
  }
  if(this.memory.hungry){
    if (this.requestTask('eat')) {
        return this.eat();
    }
  }
      //console.log(this.name+'::STARTING');
     if (this.requestTask('whack')) {
        return this.whack();
     }
     if (this.requestTask('defend')) {
        return this.defend();
     }
     if (this.requestTask('aid')) {
        return this.aid();
     }
     //console.log(this.name+'::ENDING');
  return 'zzz';
};
