import bcrypt from 'bcrypt';
import { findUserByUsername, findUserByEmail, createUser } from '../services/user.service.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    console.log("Registering user:", req.body);
    if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'username, email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        console.log("Invalid email format:", req.body.email);
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
        console.error("Invalid password format:", req.body.password);
        return res.status(400).json({ message: 'Invalid password format.' });
    }

    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const savedUser = await createUser({
            username,
            email,
            password: hashedPassword,
        });
        console.log("User saved:", savedUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error saving user:", error);
        return res.status(500).json({ message: `Error saving user: ${error}` });
    }
};

const login = async (req, res) => {
    console.log("Logging in user:", req.body);

    const { email, password, username } = req.body;

    // Aceita login com email+password OU username+password
    if ((!email && !username) || !password) {
        return res.status(400).json({ message: 'Email (ou username) e password são obrigatórios' });
    }

    try {
        let user;

        // Busca por email ou username
        if (email) {
            user = await findUserByEmail(email);
        } else if (username) {
            user = await findUserByUsername(username);
        }

        if (!user) {
            console.log("User not found", email || username);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);
        if (!isMatch) {
            console.log("Invalid password for this user", email || username);
            return res.status(401).json({ message: 'Senha inválida' });
        }

        console.log("User logged in successfully", user.username);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: `Error logging in user: ${error}` });
    }
}

export default {
    register,
    login
};