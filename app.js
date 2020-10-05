const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
//const expressHbs = require("express-handlebars");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

/*app.engine("hbs", expressHbs({
   layoutsDir: 'views/layouts/',
   defaultLayout: "main-layout",
   extname: 'hbs'
}));
*/
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findAll({ where: { id: 1 } })
    .then(user => {
      req.user = user[0]; // User
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

// Initialize the Associations
Product.belongsTo(User, { constraints: true });
User.hasMany(Product);
// create relationship between User and Cart
User.hasOne(Cart); // 
Cart.belongsTo(User);
// create relationship between Product and Cart
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
// create relationship between User and Order
Order.belongsTo(User);
User.hasMany(Order);
// create relationship between Order and Product
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  //.sync({ force: true })
  .sync()
  .then((result) => {
    return User.findAll({ where: { id: 1 } });
    //console.log(result);
  })
  .then((user) => {
    if (user.length <= 0) {
      return User.create({ name: "Ahmad", email: "ahmad@example.com" });
    }
    return user;
  })
  .then((user) => {
    //console.log(user);
    return user[0].createCart();
  }).then(cart => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
