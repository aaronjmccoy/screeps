function sweep(creep, target) {
  let dust = Game.getObjectById(target);
  switch (creep.pickup(dust)) {
      case 0:
          //creep successfuly mined
          creep.say('ka-ching', true);
          dust.debrief();
          break;
      case -1:
          //don't own the creep
          console.log('You do not own the creep being told to gather')
          break;
      case -4:
          //creep is being spawned
          creep.say('Spawning', false);
          break;
      case -7:
          //invalid target
          creep.say('Bad Target', false);
          break;
      case -9:
          //move in
          creep.moveTo(dust);
          return creep.withdraw(dust);
      case -8:
          //creep is full
          creep.say('Full', false);
          break;
  }
}
