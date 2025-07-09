import { FaFacebook, FaLinkedin, FaWhatsapp, FaInstagram } from "react-icons/fa";
import Image from "next/image";

const BoardTeamCard = ({ member }) => {
    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    const {
        userId,
        designation,
        socialLinks = {},
    } = member || {};


  return (
    <div
    style={{
      width: "378px",
      height: "450px",
      backgroundImage: 'url("./image/boardTeamCard.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      fontFamily: "sans-serif",
    }} 
    className="rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 flex flex-col items-center text-center mx-auto">
     <div
          style={{
            width: "190px",
            height: "190px",
            borderRadius: "100%",
            overflow: "hidden",
            position: "absolute",
            top: "36px",
            left: "95px",
          }}
        >
          <img
            src={
              userId?.profileImage
                ? `${imageUrl}/${userId?.profileImage}`
                : "/image/user-male.png"
            }
            alt="profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

      {/* Name + Designation */}
      
      <div
          style={{
            position: "absolute",
            top: "273px",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: "18px",
            fontWeight: "800",
          }}
        >
          {userId?.name}
        </div>
      
      <div
          style={{
            position: "absolute",
            top: "320px",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {designation}
        </div>

      {/* Social Icons */}
      {(socialLinks.facebook || socialLinks.whatsapp || socialLinks.linkedin || socialLinks.instagram) && (
  <div 
    style={{
      position: "absolute",
      top: "368px",
    }}
    className="flex justify-center gap-4 mb-2 text-primary text-2xl bg-white px-4 py-2 rounded-full"
  >
    {socialLinks.facebook && (
      <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
        <FaFacebook className="hover:text-blue-600" />
      </a>
    )}
    {socialLinks.whatsapp && (
      <a href={`https://wa.me/${socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer">
        <FaWhatsapp className="hover:text-green-500" />
      </a>
    )}
    {socialLinks.linkedin && (
      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
        <FaLinkedin className="hover:text-blue-700" />
      </a>
    )}
    {socialLinks.instagram && (
      <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
        <FaInstagram className="hover:text-pink-500" />
      </a>
    )}
  </div>
)}

    </div>
  );
};

export default BoardTeamCard;
