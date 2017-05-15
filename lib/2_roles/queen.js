function queen(spawn) {
    const r = spawn.room;
    if (!Memory.rooms[r.name]) {
        initialize(r);
    }
    const rcl = r.controller.level;
    //creep list
    spawn.memory.creepList = {
        //redspawns only upgrade controller to lvl 2 and then build extensions
        redspawn: {
            count: (rcl < 3 ? Memory.rooms[r.name].miningSpots + 1 : 2),
            parts: [MOVE, CARRY, MOVE, WORK],
            options: {
                role: 'redspawn',
                important: 'mine',
                upgrade: r.controller.id,
                resourceType: RESOURCE_ENERGY,
                max: (rcl < 3 ? Memory.rooms[r.name].miningSpots + 1 : 2),
                priority: 1
            }
        },

        //after redspawns build the first 5 extensions make tadpoles
        tadpole: {
            count: (r.miningSpots() <= Memory.rooms[r.name].sc * 6 ? r.miningSpots() : Memory.rooms[r.name].sc * 6),
            parts: [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK],
            options: {
                role: 'tadpole',
                important: 'mine',
                upgrade: r.controller.id,
                resourceType: RESOURCE_ENERGY,
                priority: 2
            }
        },
        //tadpoles build first extensions, then containers, then upgrade the controller

        //TIER I SPECIALIZATION : RCL3
        // 10 Extensions, 1 Spawn = 800 Energy
        // UPGRADE | HARVEST | CONSTRUCT | CARRY | COST

        //frogs build and upgrade
        //frogs are responsible for the first tower
        // 4 | 8 | 20 | 200 | 800

        frog: {
            count: ((Memory.rooms[r.name].sc * 2)+1),
            parts: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK],
            options: {
                role: 'frog',
                important: 'gather',
                upgrade: r.controller.id,
                resourceType: RESOURCE_ENERGY,
                priority: 3
            }
        },

        //toads harvest energy then transfer it to some adjacent storage
        //miners may upgrade during mining downtime if upgraders are within range
        //miners may be the single class that renewing is valuable on for uninterrupted mining
        // 6 | 12 | 30 | 50 | 800
        toad: {
            count: (Memory.rooms[r.name].sc),
            parts: (rcl < 6 ? [MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK] :
              [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]),
            options: {
                role: 'toad',
                important: 'mine',
                resourceType: RESOURCE_ENERGY,
                home: spawn.id,
                renew: true,
                priority: (r.rcl < 6 ? 3 : 4)
            }
        },

        //newts haul to extensions and spawn
        // 0 | 0 | 0 | 500 | 750
        newt: {
            count: 2,
            parts: [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
            options: {
                role: 'newt',
                important: 'gather',
                resourceType: RESOURCE_ENERGY,
                priority: 3
            }
        }
    };
    //spawn logic
    //rcl switch
    let rs = spawn.memory.creepList.redspawn;
    let tp = spawn.memory.creepList.tadpole;
    let frog = spawn.memory.creepList.frog;
    let toad = spawn.memory.creepList.toad;
    let newt = spawn.memory.creepList.newt;
    switch (rcl) {
        case 1:
            //console.log('spawner listed max redspawn: ' + rs.count);
            //if we haven't hit our creep count limit for redspawn, create more
            if (r.roleCount('redspawn') < rs.count) {
                spawn.createCreep(rs.parts, Game.time + '_' + rs.options.role, rs.options);
            }
            break;
        case 2:
            //if we haven't hit our creep count limit for redspawn, create more
            if (r.roleCount('redspawn') < rs.count - r.roleCount('tadpole')) {
                spawn.createCreep(rs.parts, Game.time + '_' + rs.options.role, rs.options);
            }
            //if we haven't hit our creep count limit for redspawn, create more
            if (r.roleCount('tadpole') < tp.count) {
                spawn.createCreep(tp.parts, Game.time + '_' + tp.options.role, tp.options);
            }
            break;
        case 3:
            if (r.roleCount('redspawn') < rs.count - r.roleCount('newt')) {
                spawn.createCreep(rs.parts, Game.time + '_' + rs.options.role, rs.options);
            }
            if (r.roleCount('tadpole') < (tp.count) - r.roleCount('toad') * 6) {
                spawn.createCreep(tp.parts, Game.time + '_' + tp.options.role, tp.options);
            }
            if (r.roleCount('toad') < toad.count) {
                spawn.createCreep(toad.parts, Game.time + '_' + toad.options.role, toad.options);
            } else
            if (r.roleCount('newt') < newt.count) {
                spawn.createCreep(newt.parts, Game.time + '_' + newt.options.role, newt.options);
            } else
            if (r.roleCount('frog') < frog.count) {
                spawn.createCreep(frog.parts, Game.time + '_' + frog.options.role, frog.options);
            }
            break;
        case 4:
            if (r.roleCount('toad') < toad.count) {
                spawn.createCreep(toad.parts, Game.time + '_' + toad.options.role, toad.options);
            } else
            if (r.roleCount('newt') < 2) {
                spawn.createCreep(newt.parts, Game.time + '_' + newt.options.role, newt.options);
            } else
            if (r.roleCount('frog') < frog.count) {
                spawn.createCreep(frog.parts, Game.time + '_' + frog.options.role, frog.options);
            }
            break;
        case 5:
            if (r.roleCount('toad') < toad.count) {
                spawn.createCreep(toad.parts, Game.time + '_' + toad.options.role, toad.options);
            } else
            if (r.roleCount('newt') < newt.count) {
                spawn.createCreep(newt.parts, Game.time + '_' + newt.options.role, newt.options);
            } else
            if (r.roleCount('frog') < frog.count) {
                spawn.createCreep(frog.parts, Game.time + '_' + frog.options.role, frog.options);
            }
            break;
        case 6:
        if (r.roleCount('toad') < toad.count) {
            spawn.createCreep(toad.parts, Game.time + '_' + toad.options.role, toad.options);
        } else
        if (r.roleCount('newt') < newt.count) {
            spawn.createCreep(newt.parts, Game.time + '_' + newt.options.role, newt.options);
        } else
        if (r.roleCount('frog') < frog.count) {
            spawn.createCreep(frog.parts, Game.time + '_' + frog.options.role, frog.options);
        }
            break;
        case 7:

            break;
    }
}
