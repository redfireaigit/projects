const Restaurant = require("./restaurant.model");
const _ = require("lodash");
const {ResponseHandler} = require('./../../httpStatusCodes')

// Get list of restaurants by manager
exports.getManagerRestaurants = function(req, res) {
  let perPage = parseInt(req.query.perPage, 10), page = Math.max(0, req.query.page)

  Restaurant.find({isActive:1, user: req.user._id})
      .skip(perPage * page)
      .limit(perPage)
      .exec(function(err, restaurants) {
        if (err) {
          ResponseHandler(res, 500, null, err)
        }
        else if (!restaurants) {
          ResponseHandler(res, 404)
        } else {

        restaurants = restaurants.filter(f => f.isActive == 1);

        Restaurant.count({isActive: 1, user: req.user._id}).exec(function (err, count) {
          let result = {
            totalCount: count,
            currentPage: page,
            restaurants: restaurants
          }
          ResponseHandler(res, 200, result)
        })
       }
      })
};

// Get list of restaurants
exports.index = function(req, res) {
  let perPage = parseInt(req.query.perPage, 10), page = Math.max(0, req.query.page)
  Restaurant.find({ isActive: 1, blockList: { "$ne" : [req.user._id] } })
      .skip(perPage * page)
      .limit(perPage)
      .exec(function(err, restaurants) {
        if (err) {
          ResponseHandler(res, 500, null, err)
        }
        else if (!restaurants) {
          ResponseHandler(res, 404)
        }
        else {
          restaurants = restaurants.filter(f => f.isActive == 1);
          Restaurant.count({ isActive: 1, blockList: { "$ne" : [req.user._id] } }).exec(function(err, count) {
            let result = {
              totalCount: count,
              currentPage: page,
              restaurants: restaurants
            }
            ResponseHandler(res, 200, result )
          })
        }
      })
};

// Get a single restaurant
exports.show = function(req, res) {
  Restaurant.findById(req.params.id)
    .populate("_meals")
    .exec(function(err, restaurant) {

      if (err) {
        ResponseHandler(res, 500, null, err)
      }
      else if (!restaurant) {
        ResponseHandler(res, 404)
      }
      else {
        ResponseHandler(res, 200, restaurant )
      }
    });
};

exports.create = function(req, res) {
  const _meals = [];

  const _restaurant = req.body;
  _restaurant.isActive = 1;
  _restaurant.user = req.user._id;

  _restaurant._meals = _meals;

  Restaurant.create(_restaurant, function(err, restaurant) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    } else {
      restaurant.populate();
      ResponseHandler(res, 200, restaurant )
    }
  });
};

// Updates an existing restaurant in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Restaurant.findById(req.params.id, function(err, restaurant) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    }
    else if (!restaurant) {
      ResponseHandler(res, 404)
    }
    else if (restaurant.user != req.user._id) {
      ResponseHandler(res, 401)
    }
    else {
      const updated = _.merge(restaurant, req.body);
      updated.save(function(err) {
        if (err) {
          ResponseHandler(res, 500, null, err)
        }
        else
          ResponseHandler(res, 200, restaurant )
      });
    }

  });
};

// Deletes a restaurant from the DB.
exports.destroy = function(req, res) {
  Restaurant.findById(req.params.id, function(err, restaurant) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    }
    else if (!restaurant) {
      ResponseHandler(res, 404)
    }

    else if (restaurant.user != req.user._id) {
      ResponseHandler(res, 401)
    }
    else {
      restaurant.isActive = 0;
      restaurant.save(function(err) {
        if (err) {
          ResponseHandler(res, 500, null, err)
        } else
          ResponseHandler(res, 200, restaurant)
      });
    }
  });
};
// block User for a restaurant from the DB.
exports.blockUser = function(req, res) {
  Restaurant.findById(req.params.id, function(err, restaurant) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    }
    else if (!restaurant) {
      ResponseHandler(res, 404)
    }

    else if (restaurant.user != req.user._id) {
      ResponseHandler(res, 401)
    } else {
      let userExist = restaurant.blockList.filter(f => f == req.body.id);
      if(userExist.length){
        restaurant.blockList = restaurant.blockList.filter(f => f != req.body.id)
      } else {
        restaurant.blockList.push(req.body.id)
      }

      restaurant.save(function(err) {
        if (err) {
          ResponseHandler(res, 500, null, err)
        } else
        ResponseHandler(res, 200, restaurant)
      });
    }

  });
};
