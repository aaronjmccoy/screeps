function construct(creep, target) {
  let project = Game.getObjectById(target);
  switch (creep.build(project)) {
      case 0:
          //creep successfuly mined
          creep.say('werkwerk', true);
          break;
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
          return creep.build(project);
      case -12:
          //no work body parts
          creep.say('¯\\_(ツ)_/¯', false);
          break;
  }
}
