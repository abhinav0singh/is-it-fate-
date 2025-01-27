const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// MongoDB Connection
mongoose.connect('YOUR_MONGODB_ATLAS_CONNECTION_STRING', { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    email: String,
    gender: String,
    interest: String,
    password: String,
    emailPrefix: String,
    verified: Boolean,
    verificationToken: String,
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com',
        pass: 'YOUR_EMAIL_PASSWORD',
    },
});

// Sign-Up Route
app.post('/signup', async (req, res) => {
    const { email, gender, interest, password } = req.body;

    const emailRegex = /^[a-zA-Z]+[a-zA-Z0-9._%+-]*@learner\.manipal\.edu$/;
    if (!emailRegex.test(email)) {
        return res.json({ success: false, message: 'Invalid email domain.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.json({ success: false, message: 'Email already registered.' });
    }

    const emailPrefix = email.split(/[\d.]/)[0];
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
        email,
        gender,
        interest,
        password,
        emailPrefix,
        verified: false,
        verificationToken,
    });

    await user.save();

    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
    transporter.sendMail({
        from: 'YOUR_EMAIL@gmail.com',
        to: email,
        subject: 'Verify your email',
        text: `Click the link to verify your email: ${verificationLink}`,
    });

    res.json({ success: true });
});

// Verify Email Route
app.get('/verify', async (req, res) => {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        return res.send('Invalid or expired token.');
    }

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    res.send('Email verified! You can now log in.');
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password, verified: true });
    if (!user) {
        return res.json({ success: false, message: 'Invalid credentials or email not verified.' });
    }

    res.json({ success: true, emailPrefix: user.emailPrefix });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
