const prisma = require("../config/DbConfig")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET

const createUser = async (req, h) => {
    try {
        const { name, email, gender, contact_no, location, password, date_of_birth, } = req.payload;

        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
            }
        });
        if (existingUser) {
            return h.response({ message: "This user already exists.Please login" }).code(400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name, email, gender, contact_no, location, password: hashedPassword, date_of_birth
            }
        });

        return h.response({ success: true, message: "User created successfully", data: user });
    } catch (error) {
        console.log(error);
        return h.response({ message: "Something went wrong", error }).code(500);
    }
};

const userLogin = async (req, h) => {
    try {
        const { email, password } = req.payload;

        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        });
        if (!user) {
            return h.response({ message: "User not found" }).code(404);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return h.response({ message: "Invalid password" });
        }
        const token = jwt.sign({ email: user.email }, SECRET, {
            expiresIn: "1d"
        });

        return h.response({ message: "Login sucessfully", data: user, token: token }).code(200);

    } catch (error) {
        console.log(error);
        return h.response({ message: "Something went wrong", error }).code(500);
    }
}

module.exports = {
    createUser,
    userLogin
}