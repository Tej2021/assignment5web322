const Sequelize = require('sequelize');

var sequelize = new Sequelize('d56krms2phopcf', 'yuuwkncxowtufo', '545ccd0e7b909fd8ef1335e804856e5b7c87dc3e2b9f6687ae82aa721cd4446c', {
    host: 'ec2-34-193-232-231.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432, dialectOptions: {
    ssl: { rejectUnauthorized: false }
    }
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName:          Sequelize.STRING,
    lastName:           Sequelize.STRING,
    email:              Sequelize.STRING,
    SSN:                Sequelize.STRING,
    addressStreet:      Sequelize.STRING,
    addressCity:        Sequelize.STRING,
    addressState:       Sequelize.STRING,
    addressPostal:      Sequelize.STRING,
    isManager:          Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status:             Sequelize.STRING,
    hireDate:           Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

Department.hasMany(Employee, {foreignKey: 'department'});

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(()=>{
            resolve();
        }).catch(()=>{
            reject("unable to sync the database");
        });
    });
}

module.exports.getAllEmployees = function(){
    return new Promise(function (resolve, reject) {
        Employee.findAll().then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch(()=>{
            reject("no results returned");
        });
    });
}

module.exports.getDepartments = function(){
    return new Promise(function (resolve, reject) {
        Department.findAll().then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch(()=>{
            reject("no results returned");
        });
    });
}

module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            //attributes: ['employeeNum'],
            where: {
                employeeNum: num
            }
        }).then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data[0]);
        }).catch(function(){
            reject("no results returned");
        });
    });
};

module.exports.getDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        Department.findAll({
            //attributes: ['departmentId'],
            where: {
                departmentId: id
            }
        }).then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data[0]);
        }).catch(function(){
            reject("no results returned");
        });
    });
};

module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            //attributes: ['department'],
            where: {
                departmentId: department
            }
        }).then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
    });
};

module.exports.deleteDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {

        Department.destroy({
            where: { departmentId : id }
        }).then(function () { 
            console.log("successfully deleted department " + id);
            resolve();
        }).catch(function(){
            reject("Failed to delete department " + id);
        });
        
    })
}

module.exports.deleteEmployeeByNum = function (empNum) {
    return new Promise(function (resolve, reject) {

        Employee.destroy({
            where: { employeeNum: empNum }
        }).then(function () { 
            console.log("successfully deleted employee " + empNum);
            resolve();
        }).catch(function(){
            reject("Failed to delete employee " + empNum);
        });
        
    })
}

module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;
        
        for (const prop in employeeData) {
            if (employeeData[prop] == ""){
                employeeData[prop] = null;
            }
        }

        Employee.create({
            firstName : employeeData.firstName,
            lastName : employeeData.lastName,
            email : employeeData.email,
            SSN : employeeData.SSN,
            addressStreet : employeeData.addressStreet,
            addressCity : employeeData.addressCity,
            addressState : employeeData.addressState,
            addressPostal : employeeData.addressPostal,
            isManager : employeeData.isManager,
            employeeManagerNum : employeeData.employeeManagerNum,
            status : employeeData.status,
            hireDate : employeeData.hireDate
        }).then(function(){
            resolve();
        }).catch(function(){
            reject("unable to create employee");
        });
    });
};

module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (const prop in employeeData) {
            if (employeeData[prop] == ""){
                employeeData[prop] = null;
            }
        }

        Employee.update({
            firstName : employeeData.firstName,
            lastName : employeeData.lastName,
            email : employeeData.email,
            SSN : employeeData.SSN,
            addressStreet : employeeData.addressStreet,
            addressCity : employeeData.addressCity,
            addressState : employeeData.addressState,
            addressPostal : employeeData.addressPostal,
            isManager : employeeData.isManager,
            employeeManagerNum : employeeData.employeeManagerNum,
            status : employeeData.status,
            hireDate : employeeData.hireDate
        },
        {
            where: { employeeNum: employeeData.employeeNum }
        }).then(function () { 
            resolve();
        }).catch(function(){
            reject("unable to update employee");
        });
    });
};

module.exports.addDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {

        if (departmentData.departmentName == ""){
            departmentData.departmentName = null;
        }

        Department.create({
            departmentName: departmentData.departmentName
        }).then(function(){
            resolve();
        }).catch(function(){
            reject("unable to create department");
        });
    });
};

module.exports.updateDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        
        if (departmentData.departmentName == ""){
            departmentData.departmentName = null;
        }
        
        Department.update({
            departmentName: departmentData.departmentName
        },
        {
            where: { departmentId: departmentData.departmentId }
        }).then(()=>{ 
            resolve();
        }).catch(function(){
            reject("unable to update department");
        });
    });
};