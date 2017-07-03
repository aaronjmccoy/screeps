Room.prototype.initializeMemory = function() {
  if (!this.memory.towers) {
    this.memory.towers = {};
  }
  if (!this.memory.sc) {
    this.memory.sc = (this.find(FIND_SOURCES).length);
  }
}

Room.prototype.queueTasks = function() {
  //structure tasks
  const structures = this.find(FIND_STRUCTURES);
  if (structures.length) {
    for (let structure in structures) {
      try {
        structures[structure].report();
      } catch (e) {
        console.log('No report method for ' + structures[structure] + structure.structureType);
      }
    }
  }
  //dropped resources
  const dust = this.find(FIND_DROPPED_RESOURCES);
  if (dust.length) {
    for (let d in dust) {
      var mote = dust[d];
      this.memory.jobs.sweep.tasks.push(mote.id);
    }
  }
  //construction sites
  for (let id in Game.constructionSites) {
    this.memory.jobs.construct.tasks.push(id);
  }
  //sources
  const sources = this.find(FIND_SOURCES_ACTIVE);
  if (sources.length) {
    for (let s in sources) {
      var source = sources[s];
      this.memory.jobs.mine.tasks.push(source.id);
    }
  }
  const frogs = this.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role == 'frog' });
  if (frogs.length) {
    for (let f in frogs) {
      var frog = frogs[f];
      if(frog.carry.energy < frog.carryCapacity){
        this.memory.jobs.deposit.tasks.push(frog.id);
      }
    }
  }
}

Room.prototype.releaseTask = function(job) {
  if(!this.memory.jobs[job].tasks){
    this.memory.jobs[job].tasks = [];
  }
  if (this.memory.jobs[job].tasks.length > 0) {
    return this.memory.jobs[job].tasks.shift();
  } else {
    return null;
  }
}

Room.prototype.roleCount = function (roleString) {
 //console.log('counting '+roleString+'s in '+this.name);
 let count = this.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role == roleString });
 //console.log(count.length);
 return count.length;
};
