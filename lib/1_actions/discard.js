function discard(creep) {
  switch (creep.drop(creep.memory.resourceType)) {
      case 0:
          //creep successfuly mined
          creep.say('plop', true);
          break;
      case -1:
          //don't own the creep
          console.log('You do not own the creep being told to discard')
          break;
      case -4:
          //creep is being spawned
          creep.say('Spawning', false);
          break;
      case -6:
          //not enough energy in target
          creep.say('Empty', false);
          break;
  }
}
