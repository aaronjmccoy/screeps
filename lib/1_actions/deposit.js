function deposit(creep) {
  let to = Game.getObjectById(creep.room.memory.deposit[creep.room.memory.jobs.deposit[creep.id]]);
  switch (creep.transfer(to, creep.memory.resourceType)) {
      case 0:
          //creep successfuly mined
          creep.say('ka-ching', true);
          to.debrief();
          return true;
      case -1:
          //don't own the creep
          console.log('You do not own the creep being told to deposit')
          break;
      case -4:
          //creep is being spawned
          creep.say('Spawning', false);
          break;
      case -6:
          //not enough energy in target
          creep.say('Empty', false);
          break;
      case -7:
          //invalid target
          creep.say('Bad Target', false);
          break;
      case -8:
          //full target
          creep.say('Full', false);
          break;
      case -9:
          //move in
          creep.moveTo(to);
          if(creep.transfer(to, creep.memory.resourceType) === 0){
            to.debrief();
            return true;
          }
      case -12:
          //no work body parts
          creep.say('¯\\_(ツ)_/¯', false);
          break;
  }
}
