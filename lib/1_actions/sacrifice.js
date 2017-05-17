function sacrifice(spawn, offering) {
    switch (spawn.recycleCreep(offering)) {
        case 0:
            //offering successfuly sacrificed
            offering.say('CROAK', true);
            break;
        case -1:
            //don't own the spawn
            offering.say('¯\\_(ツ)_/¯', false);
            break;
        case -7:
            //invalid target
            creep.say('Bad Target', false);
            break;
        case -9:
            //offering is out of range
            offering.moveTo(spawn);
            spawn.recycleCreep(offering);
            break;
    }
}
