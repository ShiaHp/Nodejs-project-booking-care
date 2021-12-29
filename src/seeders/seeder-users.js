'use strict';


module.exports = {


  up: async (queryInterface, Sequelize) => {
// them du lieu
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
      address: 'USA',
      gender:'1',
      roleId: '',
      typeRole: 'ROLE',
      keyRole:'R1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    //  cancel them du lieu 
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
