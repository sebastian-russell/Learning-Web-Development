var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW
router.get("/:id", function(req, res){
	// find the campground with the correct id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash('error', "Campground not found!")
			res.redirect("back");
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Edited successfully!");
			res.redirect("/campgrounds/" + req.params.id);	
		}
	});
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else{
			req.flash("success", "Campground deleted!");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;