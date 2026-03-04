import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers); // Exclude the logged-in user from the contacts list


    } catch (error) {
        console.log("Error in getAllContacts controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getMessagesByUserId = async (req, res) => {  // this is for fetching the chat history between the logged-in user and another user (contact)
    try {
        const myId = req.user._id;
        const {id:userToChatId} = req.params;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ],
        }).sort({createdAt: 1}); // Sort messages by creation time in ascending order

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessagesByUserId controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}


export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;  // receive text and image (if any) from the request body
        const {id:receiverId} = req.params;
        const senderId = req.user._id;  

        let imageUrl;
        if(image) {
            // upload base64 image to cloudinary and get the URL
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl, // Save the image URL in the message document
        });

        await newMessage.save();

        // todo - send message in real time if user is online using socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // find all messages where the logged-in user is either the sender or receiver
        const messages = await Message.find({
            $or: [
                {senderId: loggedInUserId},
                {receiverId: loggedInUserId}
            ]
        });

        // we want to find all unique user IDs that the logged-in user has chatted with (either sent or received messages)
        const chatPartnerIds = [
            ...new Set (
                messages.map((msg) => 
                 msg.senderId.toString() === loggedInUserId.toString()
                  ? msg.receiverId.toString() 
                  : msg.senderId.toString()
                )
            ),
        ];

        // fetch user details of all chat partners
        const chatPartners = await User.find({_id: {$in: chatPartnerIds}}).select("-password");

        res.status(200).json(chatPartners);
    } catch (error) {
        console.error("Error in getChatPartners controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}  