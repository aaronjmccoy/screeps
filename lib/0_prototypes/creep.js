//eat action
Creep.prototype.eat = function () {
 return Game.getObjectById(this.memory.eat).renewCreep(this);
};
//sacrifice action
Creep.prototype.sacrifice = function () {
 return Game.getObjectById(this.memory.eat).recycleCreep(this);
};

Creep.prototype.clearJob = function (job) {
 if (Game.getObjectById(this.memory[job])) {
  Game.getObjectById(this.memory[job]).debrief();
 } else {
  delete this.room.memory.jobs[job].tasks[this.memory[job]];
 }
 delete this.room.memory.jobs[job].assignments[this.memory[job]];
};
Creep.prototype.clearCreep = function () {

}

/*

structures put jobs with priority, spawn assigns job and rank to creep, creep do jobs and take them down as they are completed

structure -> room.memory.jobs[job].tasks[structure.id] =  api return code form last attempted action or 0

spawn -> room.memory.jobs[job].workers[creep.name] = api code returning 

creep -> room.memory.jobs[job].assignment[]

*/
