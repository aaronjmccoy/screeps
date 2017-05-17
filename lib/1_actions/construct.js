function construct(creep) {
  let project = Game.getObjectById(creep.room.memory.construct[creep.room.memory.jobs.construct[creep.id]]);
  while(creep.room.memory.construct[creep.room.memory.jobs.construct[creep.id]] && (!project)){
    delete creep.room.memory.construct[creep.room.memory.jobs.construct[creep.id]];
    let project = Game.getObjectById(creep.room.memory.construct[creep.room.memory.jobs.construct[creep.id]]);
  }

  switch (creep.build(project)) {
      case 0:
          //creep successfuly built
          creep.say('werkwerk', true);
          return true;
      case -1:
          //don't own the creep
          console.log('You do not own the creep being told to build')
          break;
      case -4:
          //creep is being spawned
          creep.say('Spawning', false);
          break;
      case -6:
          //no more energy to spend
          creep.say('Empty', false);
          break;
      case -7:
          //invalid target
          creep.say('Bad Target', false);
          break;
      case -9:
          //move in
          creep.moveTo(project);
          if(creep.build(project) === 0){
            return true;
          }
          break;
      case -12:
          //no work body parts
          creep.say('¯\\_(ツ)_/¯', false);
          break;
  }
}
