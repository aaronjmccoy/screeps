wfunction sweep(creep) {
  let dust = Game.getObjectById(creep.room.memory.sweep[creep.room.memory.jobs.sweep[creep.id]]);
  switch (creep.pickup(dust)) {
      case 0:
          //creep successfuly swept
          creep.say('ka-ching', true);
          dust.debrief();
          return true;
      case -1:
          //don't own the creep
          console.log('You do not own the creep being told to sweep')
          break;
      case -4:
          //creep is being spawned
          creep.say('Spawning', false);
          break;
      case -7:
          //invalid target
          creep.say('Bad Target', false);
          console.log('creep errors when attempting to sweep '+target+' at '+JSON.stringify(dust.pos));
          break;
      case -9:
          //move in
          creep.moveTo(dust);
          if(creep.pickup(dust) === 0){
            dust.debrief();
            return true;
          }
          break;
      case -8:
          //creep is full
          creep.say('Full', false);
          break;
  }
}
