Game.market.createOrder(ORDER_SELL, RESOURCE_GHODIUM, 9.95, 10000, "W1N1");

//send Kyle Energy
Game.rooms['E34S8'].terminal.send(RESOURCE_ENERGY, 100000, 'E27S8');
