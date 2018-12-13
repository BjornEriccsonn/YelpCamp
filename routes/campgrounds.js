var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res) {
        Campground.find({}, function(err,allCampgrounds){
            if(err){
                console.log(err);
            }
            else{
                
                res.render("campgrounds/index", {campgrounds:allCampgrounds});  
                
            }
            
        });
        //res.render("campgrounds", {campgrounds:campgrounds});
});



router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var img = req.body.image;
    var desc = req.body.description;
    var author =  {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {name: name, image: img, description: desc, author:author};
    Campground.create(newCamp, function(err){
        if(err){
        console.log(err);
        }else{
               res.redirect("/campgrounds"); 
        }
        
    });

});

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/new", {campground: campground});
        }
    });
    
});



router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else
        {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
        
        
    });
    
});


//edit campground route 
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
       Campground.findById(req.params.id, function(err, foundCampground){
                 res.render("campgrounds/edit", {campground: foundCampground});


    });
});

router.put("/:id", middleware.checkCampgroundOwnership ,function(req, res){
     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }  
     });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }  
     });
});



module.exports = router;