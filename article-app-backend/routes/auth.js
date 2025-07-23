const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Demo user (hardcoded)
const user = {
  id: 1,
  username: 'testuser',
  passwordHash: bcrypt.hashSync('password123', 10),
  avatar: `https://i.pravatar.cc/100?u=testuser`,
};

// POST Login User
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // Store token in HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 3600000,
  });

  res.json({ user: { username: user.username, avatar: user.avatar } });
});

// POST Logout User
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
});

module.exports = router;
