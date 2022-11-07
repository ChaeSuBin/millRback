import { 
    sequelize, Players, TokenIdx, Items, tempUser } from "./models.js";

//await sequelize.sync({ force: true }); //all table initilizing
//   TokenIdx.sync({force: true});
//   Items.sync({force: true});
//   tempUser.sync({force: true});
//await Teams.sync({alter: true});

console.log('o------------SYNC');