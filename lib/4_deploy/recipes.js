//first set memory structures
if (!Memory.recipes) {
  Memory.recipes = {};
  Memory.recipes.frog = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CARRY, MOVE, WORK
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CARRY, MOVE, WORK
      ],
      //rcl3 550 - 800
      3: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 8 5600 - 12900
      8: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ]

    },
    options: {
      //add role for creep function call
      role: 'frog',
      //limit resource type to avoid chemical poisoning
      resourceType: RESOURCE_ENERGY,
      tasks: {
        construct: null,
        collect: null,
        fix: null,
        sweep: null,
        mine: null,
        eat: null,
        upgrade: null
      }
    }
  };
  Memory.recipes.newt = {
    parts: {
      //rcl1 300 energy
      1: [MOVE, CARRY, MOVE, CARRY],
      //rcl2 300 - 550
      2: [MOVE, CARRY, MOVE, CARRY],
      //rcl3 550 - 800
      3: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
      //rcl 4 800 - 1300
      4: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,MOVE,CARRY],
      //rcl 5 1300 - 1800
      5: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
      //rcl 6 1800 - 2300
      6: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
      //rcl 7 2300 - 5600
      7: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
      //rcl 8 5600 - 12900
      8: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY]
    },
    options: {
      //add role for creep function call
      role: 'newt',
      //limit resource type to avoid chemical poisoning
      resourceType: RESOURCE_ENERGY,
      tasks: {
        deposit: null,
        collect: null,
        sweep: null,
        eat: null
      }
    }
  };
  Memory.recipes.minnow = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CARRY, MOVE, CARRY
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CARRY, MOVE, CARRY
      ],
      //rcl3 550 - 800
      3: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 8 5600 - 12900
      8: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY
      ]

    },
    options: {
      //add role for creep function call
      role: 'minnow',
      tasks: {
        eat: null
      },
      to: null,
      from: null
    }
  };
  Memory.recipes.claimer = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CLAIM
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CLAIM
      ],
      //rcl3 550 - 800
      3: [
        MOVE, CLAIM
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE, CLAIM, CLAIM
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE, CLAIM, CLAIM
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE, CLAIM, CLAIM
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE, CLAIM, CLAIM
      ],
      //rcl 8 5600 - 12900
      8: [MOVE, CLAIM, CLAIM]
    },
    options: {
      //add role for creep function call
      role: 'claimer',
      tasks: {
        claim: null
      }
    }
  };
  Memory.recipes.shark = {
    parts: {
      //rcl1 300 energy
      1: [
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        ATTACK
      ],
      //rcl2 300 - 550
      2: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl3 550 - 800
      3: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl 4 800 - 1300
      4: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl 5 1300 - 1800
      5: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl 6 1800 - 2300
      6: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl 7 2300 - 5600
      7: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl 8 5600 - 12900
      8: [
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        HEAL,
        MOVE,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL
      ]
    },
    options: {
      //add role for creep function call
      role: 'shark',
      tasks: {
        whack: null,
        eat: null,
        defend: null
      }
    }
  };
  Memory.recipes.squatter = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CLAIM
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CLAIM
      ],
      //rcl3 550 - 800
      3: [
        MOVE, CLAIM
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE, CLAIM
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE, CLAIM
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE, CLAIM
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE, CLAIM
      ],
      //rcl 8 5600 - 12900
      8: [MOVE, CLAIM]
    },
    options: {
      //add role for creep function call
      role: 'squatter',
      tasks: {
        squat: null
      },
      squatTarget: ''
    }
  };
  Memory.recipes.toad = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, WORK, CARRY, WORK
      ],
      //rcl2 300 - 550
      2: [
        MOVE, WORK, CARRY, WORK
      ],
      //rcl3 550 - 800
      3: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        CARRY
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        CARRY
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        CARRY
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        CARRY,
        CARRY
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        MOVE,
        CARRY
      ],
      //rcl 8 5600 - 12900
      8: [
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE
      ]

    },
    options: {
      //add role for creep function call
      role: 'toad',
      //limit resource type to avoid chemical poisoning
      resourceType: RESOURCE_ENERGY,
      builtcontainer: 0,
      tasks: {
        construct: null,
        fix: null,
        sweep: null,
        mine: null,
        eat: null,
        upgrade: null
      }
    }
  };
}
