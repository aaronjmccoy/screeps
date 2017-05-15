function poliwog(creep) {
  gatherAura(creep);
    if (creep.carry.energy === 0) {
        creep.memory.important = 'mine';
    } else if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.important = 'colonize';
    }
    act(creep);
}
