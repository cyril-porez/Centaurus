export default function SocialButton({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center 
        justify-center 
        gap-3 px-4 py-2 
        border border-gray-300 
        rounded-md 
        bg-white 
        text-gray-800 
        font-medium 
        text-sm
        hover:bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
        transition"
    >
      <img src={icon} alt="logo network" className="w-5 h-5" />
      <span>{text}</span>
    </button>
  );
}
