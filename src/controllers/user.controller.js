// src/controllers/user.controller.js

const admin = require('../config/firebaseAdmin');

const getUserDetails = async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.params.uid);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getUserDetails };
