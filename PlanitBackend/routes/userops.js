const UserDao = require("../models/userDao");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserOps {
   /**
    * Handles the various APIs for displaying and managing tasks
    * @param {TaskDao} userDao
    */
    constructor(userDao) {
        this.userDao = userDao;
    }

    async signUpUser(req, res) {
        var item = req.body;

        if (item.email == "" || item.password == "") {
            res.send("Failure: Invalid Email or Password");
        } else {
            const querySpec = {
                query: "SELECT * FROM c WHERE c.email=@email",
                parameters: [
                  {
                    name: "@email",
                    value: item.email
                  }
                ]
            };

            const items = await this.userDao.find(querySpec);
            
            if (items.length == 0) {
                //salt + hash the password
                const hash = bcrypt.hashSync(item.password, saltRounds);

                item.password = hash;
                item.signUpTime = Date.now();
                item.lastSignIn = Date.now();

                //save in database
                await this.userDao.addItem(item);
                res.send("Success: User Signed Up!");
            } else {
                res.send("Failure: User with that email already exists");
            }
        }
    }

    async loginUser(req, res) {
        var item  = req.body;

        if (item.email == "" || item.password == "") {
            res.send("Failure: Invalid Email or Password");
        } else {
            const querySpec = {
                query: "SELECT * FROM c WHERE c.email=@email",
                parameters: [
                {
                    name: "@email",
                    value: item.email
                }
                ]
            };

            const items = await this.userDao.find(querySpec);

            if (items.length == 1){
                if (bcrypt.compareSync(item.password, items[0].password)) {
                    await this.userDao.updateItem(items[0].id);
                    res.send(items[0].id);
                } else {
                    res.send("Failure: Invalid Email or Password");
                }
            } else {
                res.send("Failure: Invalid Email or Password");
            }
        }
    }
}
 module.exports = UserOps;