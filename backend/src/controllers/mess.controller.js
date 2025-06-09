import User from "../models/User.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io} from "../lib/socket.js";
export const getUsers = async (req, res) => {
    try {
        const loggedInUser = req.user; // Assuming user is set in the request by auth middleware
        const filteredUser = await User.find({ _id: { $ne: loggedInUser._id } }).select("-password -__v");
        res.status(200).json(filteredUser);

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getMessages = async (req, res) => {
    try {
       const{id:UserToChatID} = req.params;
       const sender = req.user._id; // Assuming user is set in the request by auth middleware
       const messages = await Message.find({
            $or: [
                { sender: sender, receiver: UserToChatID },
                { sender: UserToChatID, receiver: sender }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error in getmessages" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const{text , image} = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id; 
        let imageUrl;
        if (image) {
            const upload = await cloudinary.uploader.upload(image); 
            imageUrl = upload.secure_url;
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            text: text,
            image: imageUrl
        });

        await newMessage.save();
        const ReceiverSocketId = getReceiverSocketId(receiverId);
        if(ReceiverSocketId)
        {
            io.to(ReceiverSocketId).emit("newMessage", newMessage)
        }
        res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error in sendMessage" });
        
    }
}