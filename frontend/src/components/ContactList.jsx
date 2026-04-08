import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  // 1. Destructure with default values [] to prevent .map and .includes crashes
  const { getAllContacts, allContacts = [], setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers = [] } = useAuthStore(); 

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  // 2. Handle the loading state
  if (isUsersLoading) return <UsersLoadingSkeleton />;

  // 3. Safety check: If allContacts isn't an array or is empty, show a message instead of crashing
  if (!Array.isArray(allContacts) || allContacts.length === 0) {
    return <div className="p-4 text-center text-zinc-500">No contacts found</div>;
  }

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            {/* 4. Safe check for online status */}
            <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img 
                  src={contact.profilePic || "/avatar.png"} 
                  alt={contact.fullName} 
                  onError={(e) => { e.target.src = "/avatar.png"; }} // Fallback if image fails
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
}

export default ContactList;