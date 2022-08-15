const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const favoriteRouter = express.Router();
const cors = require("./cors");

favoriteRouter.route("/")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
    Favorite.find({
        user: req.user_.id,
    })
        .populate("user")
        .populate("campsites")
        .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
        })
        .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findById({
        user: req.user._id,
    })
        .then((favorite) => {
        if (favorite) {
            if (favorite.campsites.indexOf(favorite._id) === -1) {
            favorite.campsites.push(favorite._id);
            }
            favorite
            .save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
            Favorite.create({
            user: req.user._id,
            campsites: req.body,
            })
            .then((favorite) => {
                console.log("Favorite Created ", favorite);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch((err) => next(err));
        }
    })
    .catch((err) => next(err));
})
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
})
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({
        user: req.user._id,
    })
    .then((favorite) => {
        if (favorite) {
        if (favorite.campsites.indexOf(req.user._id !== 1)) {
            favorite.campsites
                .splice(favorite.campsites.indexOf(req.user._id), 1)
                .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(response);
                })
                .catch((err) => next(err));
            } else {
            res.end("There are no favorites to delete from this user");
            }
        }
    })
    .catch((err) => next(err));
});

favoriteRouter.route("/:campsiteId")
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /favorites/:campsiteId");
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.create(req.body);
    if (favorite) {
        if (favorite.campsites.indexOf(favorite._id) == -1) {
        req.body.forEach((fav) => {
            if (!favorite.campsites.includes(fav._id)) {
            favorite.campsites.push(fav._id);
            }
        });
    }
    Favorite.save()
        .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
        })
        .catch((err) => next(err));
    } else {
        Favorite.create({
            user: req.user._id,
            campsites: req.body,
        })
        .then((favorite) => {
            console.log("Favorite Created ", favorite);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
        })
        .catch((err) => next(err));
    }
})
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites/:campsiteId");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findByIdAndDelete(req.params.favoriteId)
        .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
        })
        .catch((err) => next(err)
    );
    
});

module.exports = favoriteRouter;
