import jwt from "jsonwebtoken";

export const generateToken = (userId,res) => {
    const token = jwt.sign({ userId },process.env.JWT_SECRET,{
        expiresIn: "7d",
    });

    // set token in http-only cookie
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, // 7 days in milliseconds
        httpOnly: true, // cookie cannot be accessed by client-side JavaScript so it prevents XSS attacks 
        sameSite: "strict", // CSRF attacks prevention, cookie will only be sent in same site requests 
        secure: process.env.NODE_ENV === "production", // cookie will only be sent over HTTPS in production
    });

    return token;
};