import Food from '../models/Food.js';

// @desc    Add a new food item
// @route   POST /api/food
// @access  Private (Donor only)
export const addFood = async (req, res) => {
  try {
    const { name, quantity, longitude, latitude, expiryTime } = req.body;

    if (req.user.role !== 'Donor' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Donors can add food' });
    }

    const food = await Food.create({
      name,
      quantity,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      expiryTime,
      donorId: req.user._id
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby available food
// @route   GET /api/food/nearby?lng=...&lat=...&distance=...
// @access  Private (Receiver)
export const getNearbyFood = async (req, res) => {
  try {
    const { lng, lat, distance = 5000 } = req.query; // default 5km

    if (!lng || !lat) {
      return res.status(400).json({ message: 'Please provide longitude and latitude' });
    }

    const foodListing = await Food.find({
      status: 'Available',
      expiryTime: { $gt: new Date() }, // Only food that hasn't expired
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance)
        }
      }
    }).populate('donorId', 'name rating'); // sort by nearest is done by $near automatically
    
    // Sort logic modification (nearest first + expiry soonest first)
    // MongoDB $near already sorts by nearest. To combine, we can sort in memory.
    const sortedFood = foodListing.sort((a, b) => {
      return new Date(a.expiryTime) - new Date(b.expiryTime);
    });

    res.json(sortedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Claim food
// @route   PUT /api/food/:id/claim
// @access  Private (Receiver)
export const claimFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    if (food.status === 'Claimed') {
      return res.status(400).json({ message: 'Food is already claimed' });
    }

    if (req.user.role !== 'Receiver' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Receivers can claim food' });
    }

    food.status = 'Claimed';
    food.receiverId = req.user._id;

    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get donor's own food listings
// @route   GET /api/food/donor
// @access  Private (Donor only)
export const getDonorListings = async (req, res) => {
  try {
    if (req.user.role !== 'Donor' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Donors can access their listings' });
    }

    const listings = await Food.find({ donorId: req.user._id })
      .populate('receiverId', 'name email')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
