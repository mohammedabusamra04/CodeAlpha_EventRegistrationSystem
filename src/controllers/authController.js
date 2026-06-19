const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, phone, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            name, 
            phone, 
            email, 
            password: hashedPassword,
            role: role || 'user'
        });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.status(201).json({ token, name: user.name, role: user.role });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.status(200).json({ token, name: user.name, role: user.role });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal server error occurred' });
    }
};

module.exports = { register, login };