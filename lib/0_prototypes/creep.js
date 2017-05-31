//eat action
Creep.prototype.eat = function () {
 return Game.getObjectById(this.memory.eat).renewCreep(this);
};
//sacrifice action
Creep.prototype.sacrifice = function () {
 return Game.getObjectById(this.memory.eat).recycleCreep(this);
};
Creep.prototype.clearJob = function (job){
  if(Game.getObjectById(this.memory[job])){
      Game.getObjectById(this.memory[job]).debrief();
  }else{
    delete this.room.memory.jobs[job].tasks[this.memory[job]];
  }
  delete this.room.memory.jobs[job].assignments[this.memory[job]];
};
Creep.prototype.clearCreep = function (){

}
