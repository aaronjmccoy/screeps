function gather(creep, target) {
  let from = Game.getObjectById(target);
  switch (creep.withdraw(from)) {
      case 0:
          //creep successfuly mined
          creep.say('ka-ching', true);
          from.debrief();
          break;
      case -1:
          //don't own the creep
          console.log('You do not own the creep being told to gather')
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
      case -9:
          //move in
          creep.moveTo(from);
          return creep.withdraw(from);
      case -12:
          //no work body parts
          creep.say('¯\\_(ツ)_/¯', false);
          break;
  }
}
