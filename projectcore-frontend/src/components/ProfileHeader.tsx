interface ProfileHeaderProps {
  fullName: string;
  description: string;
  profilePic: string;
}

export default function ProfileHeader({ fullName, description, profilePic }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img 
            src={profilePic} 
            alt="Profile picture" 
            className="w-full h-full object-cover"
          />
        </div>
        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14"></path>
            <circle cx="16" cy="8" r="2"></circle>
          </svg>
        </button>
      </div>
      <h2 className="text-2xl font-bold">{fullName}</h2>
      <p className="text-slate-600">{description}</p>
      
      <div className="flex space-x-4 mt-4">
        <button className="py-2 px-4 bg-[hsl(var(--primary))] text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow">
          Editar perfil
        </button>
        <button className="py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow">
          Compartir perfil
        </button>
      </div>
    </div>
  );
}
