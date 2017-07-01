Creep.prototype.toad = function() {
  //state flipper
  if (this.carry.energy === 0) {
    this.memory.state = 0;
  }
  if (this.carry.energy === this.carryCapacity) {
    this.memory.state = 1;
  }
  let say = '';
  //primary tasks in order of importance inside of state logic
  if (this.requestTask('mine')) {
    let up = this.upgrade();
    if(up === 0){
      this.mine();
      say += Memory.emoji.sogood;
    }else{
        say += this.mine();
    }
  }else
  if (this.requestTask('eat')) {
    say += this.eat();
  }else
  if (this.requestTask('construct')) {
    say += this.construct();
  } else {
    say+=Memory.emoji.sogood;
  }
  return say;
};
