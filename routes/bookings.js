const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail')
const generateInvoice = require('../utils/generateInvoice')

// POST /api/bookings
router.post('/', protect, async (req, res) => {
  try {
    const { tourId, bookingDate, travelers, specialRequests } = req.body;
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });

    const totalPrice = tour.price * (travelers || 1);
    const booking = await Booking.create({
      user: req.user._id,
      tour: tourId,
      bookingDate,
      travelers: travelers || 1,
      totalPrice,
      specialRequests
    });

    await booking.populate(['user', 'tour']);
    await sendEmail(
      req.user.email,
      '🎉 Booking Confirmed - TravelNest AI',

      `
      <div style="font-family: Arial; padding: 20px;">
      <h2>Booking Confirmed 🎉</h2>

      <p>Hello ${req.user.name},</p>

      <p>Your booking has been confirmed successfully.</p>

      <h3>Booking Details</h3>

      <ul>
        <li><strong>Tour:</strong> ${tour.title}</li>
        <li><strong>Date:</strong> ${bookingDate}</li>
        <li><strong>Travelers:</strong> ${travelers}</li>
        <li><strong>Total Price:</strong> ₹${totalPrice}</li>
      </ul>

      <p>Thank you for choosing TravelNest AI ✈️</p>
      </div>
      `
      )
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/my
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('tour')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//Invoice /Download /route
router.get('/invoice/:id', async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.id)
      .populate('user')
      .populate('tour')

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      })
    }

    generateInvoice(
      booking,
      booking.user,
      booking.tour,
      res
    )

  } catch (err) {

    res.status(500).json({
      message: 'Invoice generation failed'
    })
  }
})

module.exports = router;
