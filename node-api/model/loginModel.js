'user strict';
var sql = require('./db.js');
// const bCrypt = require('bcrypt');
const { To, ResponseError, ResponseSuccess } = require("../helper/util");
const CONFIG = require('../config/config');
const jwt = require('jsonwebtoken');
const { request } = require('express');



//Task object constructor
var User = function(task){
    this.user_id=task.user_id;
    this.username=task.username;
    this.password=task.password;
    this.role=task.role;
};

//save vendor details
User.registerUser = (vendorInp, result) => {   
    sql.query("INSERT INTO `HisabKitab`.`Register` (`Name`, `Email`, `Passowrd`, `Monthly-income`, `Monthly-expenditure`) VALUES (?,?,?,?,?)", [vendorInp.name, vendorInp.email, vendorInp.password, vendorInp.income, vendorInp.expenditure], function (err, res) {
            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });           
};
User.loginUser = (login, result) => {   
    console.log("email is",login.email);
    sql.query("SELECT * FROM `HisabKitab`.`Register` WHERE email=? AND passowrd=?",[login.email,login.password], function (err, user) {
            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            if(user[0])
            {
                console.log("Success!",user[0]);
                result(null,[{
                    username: user[0].Name,
                    id: user[0].id,
                    expenditure: user[0]['Monthly-expenditure'],
                    income: user[0]['Monthly-income']
                }])
            }
           else{
            console.log("Fail");
            result(null);
           }
        }
    });           
};
User.records = function (data,result) {
    sql.query("select Date,Amount,Reason from `HisabKitab`. `Monthly-Records` where Year=? AND Month=?",[data.year,data.month],function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log("Response is",res);
            result(null, res);
        }
    });   
};

//Creating a user
User.createUser = async (newUser, result) =>{
    try {
    //     let hashPassword;
    //     const saltRounds = 10;
    //     const salt = bCrypt.genSaltSync(saltRounds);
    //     [err, hashPassword] = await To(bCrypt.hash(newUser.password ? newUser.password : "superadmin@1", salt));  
    //     newUser.password = hashPassword;
    //     if (err) {
    //         return { success: false , message: "Failed to encrypt password" };
    //     }
        sql.query("INSERT INTO user_login set ?", [newUser], function (err, res) {

            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
                console.log(res.insertId);
                result("User Create Successfully", res.insertId);
            }
            
            // if(err) {
            //     result(err,{ success: false, message: "Something went wrong !!!" });
            // }
            // else{
            //     result(null,{ success: true, data: res.insertId, message: "User Created Successfully" });
            // }
        });                   
    } catch (error) {
        return { message: error} ;
    }
    
};
//Update a user last logged in
User.updateUserLastLogin = (useremail,lastlogin, result) => {    
    sql.query("UPDATE user_login set last_loggedin=? where username=?", [lastlogin,useremail], function (err, res) {
        
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });           
};

//list all users
User.getAllUsers = (result) => {
    sql.query("Select user_id as id, username, role, last_loggedin from user_login", function (err, res) {

        if (err) {
            result(null, err);
        } else {
            result(null, res);
        }
    });   
};
//Get user by name
User.getUserById = (userId, result) => {
    sql.query("Select user_id as id, username, role, last_loggedin from user_login where user_id = ? ", userId, function (err, res) {             
        
        if(err) {
            result(err, null);
        } else {
            result(null, res);
      
        }
    });   
};

//Validate User
User.validateUser = (username,password, result) => {
    try {
        const isValidPassword = function (userPassword, encPassword) {
            return userPassword == encPassword;
        }
        sql.query("Select * from user_login where username = lower(?) ", [username.includes("@bshg.com") ? username : username + "@bshg.com"], function (err, user) {
            if(err) {
                result(err, null);
            } else{
                if (user[0] && isValidPassword(password, user[0].password)){
                    var token = jwt.sign({user_id:user[0].user_id, userData : user[0]}, CONFIG.development.jwt_encryption)
                    result(null, [{
                        token: token,
                        username: user[0].username,
                        id: user[0].user_id,
                        role:user[0].role,
                        last_loggedin:user[0].last_loggedin
                    }]);
                } else {
                    result(null, { message: 'incorrect username or password' });
                }
            }
        });   
        // sql.query("Select * from user_login where username = lower(?) ", [username.includes("@bshg.com") ? username : username + "@bshg.com"] , function (err, user) {             
        //     if(err) {
        //         result({ message: err }, null);
        //     } else {
        //         if (user[0] && isValidPassword(password, user[0].password)){
        //             var token = jwt.sign({user_id:user[0].user_id, userData : user[0]}, CONFIG.development.jwt_encryption)
        //             result(null, {
        //                 token: token,
        //                 name: user[0].username,
        //                 id: user[0].user_id,
        //             });
        //         } else {
        //             result(null, { message: 'incorrect username or password' });
        //         }
        //     }
        // });  
    } catch (error) {
        return { message: error} ;
    }
       
};

//Get user by name
User.getRolesListUser = (username, result) => {
    sql.query("select * from userroles where user_login_id in ( select user_id from user_login where username= ?)", username, function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
      
        }
    });   
};

//save vendor details
User.save_vendor = (vendorInp, result) => {    
    sql.query("INSERT INTO `PMS`.`vendor_declaration` (`organization_name`, `pan`, `gstn`, `turnOver`, `authorized_person`, `authorized_person_designation`, `company_name`,`capturedDate`) VALUES (?,?,?,?,?,?,?,now())", [vendorInp.organization_name, vendorInp.pan, vendorInp.gstn, vendorInp.turnOver, vendorInp.authorized_person, vendorInp.authorized_person_designation, vendorInp.company_name], function (err, res) {
            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });           
};


User.panexistcount = (pan, result) => {
    sql.query("select count(*) as pancount from vendor_declaration where lower(pan)=lower(?)", pan, function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log("res pan: ", res);
            result(null, res);
      
        }
    });   
};

User.gstnexistcount = (gstn, result) => {
    sql.query("select count(*) as gstcount from vendor_declaration where lower(gstn)=lower(?)", gstn, function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
      
        }
    });   
};


User.getAdminVendorData = function (result) {
    sql.query("select * from vendor_declaration", function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });   
};

// Get Admin Vendor Data by id
User.getVendorDataById = function (vendorId, result) {
    console.log("vendor id", vendorId);
    sql.query("SELECT * FROM vendor_declaration vd WHERE vd.id = ? ", (vendorId), function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    }); 
};

//Delete Vendor Data by Vendor Id
User.deleteVendorDataById = function (vendorId,username,result) {

   
    sql.query("Select * FROM vendor_declaration vd  where vd.id= ? ", vendorId , function(err,data1) {
        if(err)
        {   
            console.log(err);
        }
        else
        {   
            var results=JSON.parse(JSON.stringify(data1))
            User.savelogs("Delete",username,results[0]);
        }
       sql.query("DELETE FROM vendor_declaration WHERE id= ? ", vendorId, function(err, data) {
            if (err) {
                result(err, null);
            } else {
            
                result(null, data);}
            });
    });
}


User.savelogs = function(action,username,data1) {
    
    console.log("data1 is coming",data1);
    var editversion=0;
    if(action === "Edit")
    {
        editversion=1;
    }
         sql.query("Select * FROM vendor_declaration_log vd  where vd.vendor_id = ?", (data1.id), function(err,data_log) {
               if(err)
               {
                  console.log(err);
                }
               else
               {    
                    if(action === "Delete")
                       editversion=0;
                    else
                    {
                        var result=JSON.parse(JSON.stringify(data_log));
                        ///console.log("last edited data",result);
                        if(result.length!==0)
                        {
                           if(result[result.length-1].Action==='Edit')
                              editversion=result[result.length-1].edit_version+1;
                        }
                    } 
                sql.query("INSERT INTO `PMS`.`vendor_declaration_log`(`vendor_id`,`organization_name`, `pan`, `gstn`, `turnOver`, `authorized_person`, `authorized_person_designation`, `company_name`,`capturedDate`,`Action`,`edit_version`,`Modified_by`,`Modified_on`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,now())", [data1.id,data1.organization_name,data1.pan, data1.gstn, data1.turnOver, data1.authorized_person, data1.authorized_person_designation, data1.company_name,data1.capturedDate,action,editversion,username], function (err, res) {
                    if(err)
                    {
                        console.log("error",err);
                    }
                    else
                    {
                        console.log("log saved successfully",res);
                    }
                  });
               }
            
             });
   
}
// Update Vendor Data by Vendor Id 
User.updateVendorDataById = function (vendorId, updateData,username,result) {

  
    sql.query("UPDATE vendor_declaration set turnOver= ? , authorized_person= ?, authorized_person_designation=?, organization_name=?  WHERE id= ?", [updateData.turnOver, updateData.authorized_person, updateData.authorized_person_designation, updateData.organization_name, vendorId], function(err, data) {
        if (err) {
            result(err, null);
        } else {
            sql.query("Select * FROM vendor_declaration vd  where vd.id= ? ", vendorId , function(err,data1) {
                if(err)
                {   
                    console.log(err);
                }
                else
                {   
                    var results=JSON.parse(JSON.stringify(data1))
                    User.savelogs("Edit",username,results[0]);
                }
            });
            result(null, data);
        }
    });
}

//fetch employee data by employee id

User.surveyemployeedata = function (empdetails, result) {
   
    if(isNaN(empdetails.emp_id)){
        console.log(empdetails.emp_id + " is not a number <br/>");
        sql.query("SELECT * FROM employee_master where employee_code=?",(empdetails.emp_id),function (err, res) {             
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
                //console.log("res res: ", res);
                result(null, res);
          
            }
        }); 
     }else{
        console.log(empdetails.emp_id + " is a number <br/>");
        sql.query("SELECT * FROM employee_master where cast(employee_code as unsigned)=?",parseInt(empdetails.emp_id),function (err, res) {             
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
               // console.log("res res: ", res);
                result(null, res);
          
            }
        }); 
     }

    console.log("emp id : "+empdetails.emp_id);
    
      
};


//save vendor details
User.save_event = function (vendorInp, result) {    
    sql.query("INSERT INTO `event_declaration` (`employeeCode`, `name`, `contactno`, `altcontactno`, `address`, `pincode`, `mealPreferance`,`allergiesStatus`,`allergiescomment`,`landmark`,`availableStatus`,`capturedDate`) VALUES (?,?,?,?,?,?,?,?,?,?,?,now())", [vendorInp.employeeCode, vendorInp.name, vendorInp.contactno, vendorInp.altcontactno, vendorInp.address, vendorInp.pincode, vendorInp.mealPreferance, vendorInp.allergiesStatus, vendorInp.allergiescomment, vendorInp.landmark, vendorInp.availableStatus], function (err, res) {
            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });           
};

User.audit_details = function (details, result) {
    let query;
    if (!details.action && !details.modified_by && !details.modified_on) {
      query = "select * from vendor_declaration_log";
    } else if (details.action && details.modified_by && details.modified_on) {
      query = `select * from vendor_declaration_log where action = "${details.action}" 
          and modified_by="${details.modified_by}" and cast(Modified_on as date) = "${details.modified_on}"`;
    } else if (!details.action && details.modified_by && details.modified_on) {
      query = `select * from vendor_declaration_log where modified_by="${details.modified_by}" and cast(Modified_on as date) = "${details.modified_on}"`;
    } else if (details.action && !details.modified_by && details.modified_on) {
      query = `select * from vendor_declaration_log where action = "${details.action}" 
          and cast(Modified_on as date) = "${details.modified_on}"`;
    } else if (details.action && details.modified_by && !details.modified_on) {
      query = `select * from vendor_declaration_log where action = "${details.action}" 
          and modified_by="${details.modified_by}"`;
    } else if (details.action && !details.modified_by && !details.modified_on) {
      query = `select * from vendor_declaration_log where action = "${details.action}"`;
    } else if (!details.action && details.modified_by && !details.modified_on) {
      query = `select * from vendor_declaration_log where modified_by="${details.modified_by}"`;
    } else if (!details.action && !details.modified_by && details.modified_on) {
      query = `select * from vendor_declaration_log where cast(Modified_on as date) = "${details.modified_on}"`;
    }
    sql.query(query, function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    });
  };

module.exports= User;