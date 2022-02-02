import Sequelize, { DataTypes, where } from 'sequelize';
import dotenv from 'dotenv'


dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT



export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: "postgres",
  host: dbHost,
  port: dbPort,
  define: {
    freezeTableName: true
  }

});
// export const User = sequelize.define('User', {
//   id: {
//     type: Sequelize.STRING(8),
//     primaryKey: true
//   },
//   username: {
//     type: Sequelize.STRING(128),
//     allowNull: false,
//     validate: {
//       notEmpty: true
//     }
//   },
//   email: {
//     type: Sequelize.STRING(128),
//     unique: true,
//     allowNull: false,
//     validate: {
//       notEmpty: true,
//       isEmail: true
//     }
//   },
//   password: {
//     type: Sequelize.STRING(128),
//     allowNull: false,
//     // validate: {
//     //   notEmpty: true,
//     // },
//   },
//   active: {
//     type: Sequelize.BOOLEAN,
//     defaultValue: false
//   },
//   roles: {
//     type: Sequelize.STRING(8)
//   }
// }, {
//   timestamps: false,
// });

// export const UserProfile = sequelize.define('UserProfile', {
//   userId: {
//     type: Sequelize.STRING(8),
//     references: {
//       model: 'User', // 'fathers' refers to table name
//       key: 'id', // 'id' refers to column name in fathers table
//     },
//     primaryKey: true
//   },
//   gender: {
//     type: Sequelize.INTEGER
//   },
//   birthday: {
//     type: Sequelize.DATE
//   },
//   avatar: {
//     type: Sequelize.STRING
//   },
//   height: {
//     type: Sequelize.REAL
//   },
//   weight: {
//     type: Sequelize.REAL
//   }
// }, {
//   timestamps: false
// });

// export const Food = sequelize.define('Food', {
//   id: {
//     type: Sequelize.STRING(10),
//     primaryKey: true
//   },
//   name: {
//     type: Sequelize.STRING(128),
//     allowNull: false,
//     validate: {
//       notEmpty: true
//     }
//   },
//   foodGroup: {
//     type: Sequelize.INTEGER,
//     allowNull: true,
//     references: {
//       model: 'FoodGroup',
//       key: 'id',
//     }
//   },
//   language: {
//     type: Sequelize.STRING(32)
//   },
//   image: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   owner: {
//     type: Sequelize.STRING(8),
//   },
//   scope: {
//     type: Sequelize.BOOLEAN
//   },
//   isIngredient: {
//     type: Sequelize.BOOLEAN
//   }
// })

// export const FoodGroup = sequelize.define('FoodGroup', {
//   groupName: {
//     type: Sequelize.STRING(32),
//   }
// },
//   {
//     timestamps: false
//   })

// export const NutritionFact = sequelize.define('NutritionFact', {
//   foodId: {
//     type: Sequelize.STRING(10),
//     references: {
//       model: 'Food',
//       key: 'id',
//     },
//     primaryKey: true
//   },
//   serving_unit: {
//     type: Sequelize.STRING(128)
//   },
//   serving_weight_grams: {
//     type: Sequelize.REAL
//   },
//   Calories: {
//     type: Sequelize.REAL,
//   },
//   Fat: {
//     type: Sequelize.REAL,
//   },
//   SaturatedFat: {
//     type: Sequelize.REAL
//   },
//   TransFat: {
//     type: Sequelize.REAL
//   }
//   ,
//   Protein: {
//     type: Sequelize.REAL,
//   },
//   Cholesterol: {
//     type: Sequelize.REAL,
//   },
//   Sodium: {
//     type: Sequelize.REAL,
//   },
//   Potassium: {
//     type: Sequelize.REAL,
//   },
//   Carbohydrates: {
//     type: Sequelize.REAL,
//   },
//   DiateryFiber: {
//     type: Sequelize.REAL
//   },
//   Sugars: {
//     type: Sequelize.REAL
//   },
//   VitaminA: {
//     type: Sequelize.REAL,
//   },
//   VitaminC: {
//     type: Sequelize.REAL,
//   },
//   Calcium: {
//     type: Sequelize.REAL,
//   },
//   Iron: {
//     type: Sequelize.REAL,
//   }
// })

// export const Components = sequelize.define('Components', {
//   foodId: {
//     type: Sequelize.STRING(10),
//     references: {
//       model: 'Food',
//       key: 'id',
//     },
//     primaryKey: true
//   },
//   ComponentId: {
//     type: Sequelize.STRING(10),
//     references: {
//       model: 'Food',
//       key: 'id',
//     },
//     primaryKey: true
//   },
//   value: {
//     type: Sequelize.REAL
//   }
// },
//   { timestamps: false }

// )

// export const Nutrients = sequelize.define('Nutrients', {
//   nutrientName: {
//     type: Sequelize.STRING(128),
//   },
//   unit: {
//     type: Sequelize.STRING(8)
//   },
//   tagname: {
//     type: Sequelize.STRING(32)
//   }
// },
//   {
//     timestamps: false
//   })

// export const ExtraNutrition = sequelize.define('ExtraNutrition', {
//   foodId: {
//     type: Sequelize.STRING(10),
//     references: {
//       model: 'Food',
//       key: 'id',
//     },
//     primaryKey: true,
//   },
//   nutrientId: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'Nutrients',
//       key: 'id',
//     },
//     primaryKey: true
//   },
//   value: {
//     type: Sequelize.REAL,
//   }

// })

// export const Tracking = sequelize.define('Tracking', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   userId: {
//     type: Sequelize.STRING(8),
//     references: {
//       model: 'User', // 'fathers' refers to table name
//       key: 'id', // 'id' refers to column name in fathers table
//     }
//   },
//   foodId: {
//     type: Sequelize.STRING(10),
//     references: {
//       model: 'Food',
//       key: 'id',
//     }
//   },
//   meal: {
//     type: Sequelize.STRING(10)
//   },
//   date: {
//     type: Sequelize.DATE
//   },
//   weight: {
//     type: Sequelize.REAL
//   }
// },
//   {
//     timestamps: false
//   })



// sequelize.sync().then(() => console.log("Khoi tao bang product")).catch(err => console.log(err.message))


export default sequelize
