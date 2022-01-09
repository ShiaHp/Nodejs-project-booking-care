'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('markdowns', {     
        // contentHTML:DataTypes.TEXT('long'),
        // description:DataTypes.TEXT('long'),
        // contentMarkdown: DataTypes.TEXT('long'),
        // doctorId: DataTypes.INTEGER,   
        // specialtyId: DataTypes.INTEGER,
        // clinicId: DataTypes.STRING
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contentHTML:{
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      contentMarkdown:{
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      description:{
        allowNull: true,
        type: Sequelize.TEXT('long')
      },
      doctorId:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      specialtyId:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      clinicId :{
        allowNull: false,
        type: Sequelize.STRING
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('markdowns');
  }
};