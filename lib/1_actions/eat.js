function eat(creep) {
    var spawn = Game.getObjectById(creep.memory.home);
    switch (spawn.renewCreep(creep)) {
        case 0:
            //creep successfuly eats
            creep.say('NOM', true);
            break;
        case -1:
            //don't own the spawn
            creep.say('¯\\_(ツ)_/¯', false);
            break;
        case -4:
            //spawn is busy
            creep.say('Waiting', false);
            break;
        case -6:
            //out of energy in spawn array
            creep.say('Empty', false);
            break;
        case -7:
            //invalid target
            creep.say('Bad Target', false);
            break;
        case -8:
            //creep is full
            creep.say('YUM', true);
            break;
        case -9:
            //creep is out of range
            creep.moveTo(spawn);
            spawn.renewCreep(creep);
            break;
    }
}
