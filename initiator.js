import { 
    sequelize, Players, TokenIdx, Items, tempUser } from "./models.js";

//await sequelize.sync({ force: true }); //all table initilizing
//   TokenIdx.sync({force: true});
//   await Items.sync({alter: true});
    await tempUser.sync({force: true});
// await Players.sync({alter: true});
//await Teams.sync({alter: true});

console.log('o------------SYNC');