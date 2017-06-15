//task chains

//only eat when there is nothing else to do

//frogs run out of tasks without energy
frog 0:
 withdraw - > mine - > pickup - > eat
frog 1:
 build - > upgrade

//toads have no tasks when sources are inactive
toad 0:
 mine - > eat
toad 1:
 mine - > upgrade - > drop / deposit

//newts run out of things to do when all structures are full or there is no energy to gather
newt 0:
 sweep - > withdraw
newt 1:
 deposit - > eat


functions alternate endpoints:

 collect - > mine / sweep
mine - > eat / sweep

aid - > aid / eat

sweep - > upgrade / eat
deposit - > upgrade / eat

eat - > random move
upgrade - > na

construct - > construct / upgrade

fix - > fix / state 0
