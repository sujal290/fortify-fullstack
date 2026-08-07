// PATH: server/controllers/userController.js  (NEW FILE)
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// GET /api/users/addresses
const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.addresses);
});

// POST /api/users/addresses
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { label, fullName, phone, line1, city, state, pin, isDefault } = req.body;

  // First saved address is always the default, regardless of what was sent.
  const makeDefault = isDefault || user.addresses.length === 0;
  if (makeDefault) user.addresses.forEach((a) => (a.isDefault = false));

  user.addresses.push({ label, fullName, phone, line1, city, state, pin, isDefault: makeDefault });
  await user.save();
  res.status(201).json(user.addresses);
});

// PUT /api/users/addresses/:addressId
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  const { label, fullName, phone, line1, city, state, pin, isDefault } = req.body;
  Object.assign(address, {
    label: label ?? address.label,
    fullName: fullName ?? address.fullName,
    phone: phone ?? address.phone,
    line1: line1 ?? address.line1,
    city: city ?? address.city,
    state: state ?? address.state,
    pin: pin ?? address.pin,
  });

  if (isDefault) {
    user.addresses.forEach((a) => (a.isDefault = a._id.equals(address._id)));
  }

  await user.save();
  res.json(user.addresses);
});

// DELETE /api/users/addresses/:addressId
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  const wasDefault = address.isDefault;
  address.deleteOne();

  // If the deleted address was the default, promote whichever is left first.
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  res.json(user.addresses);
});

// PUT /api/users/addresses/:addressId/default
const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  user.addresses.forEach((a) => (a.isDefault = a._id.equals(address._id)));
  await user.save();
  res.json(user.addresses);
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };