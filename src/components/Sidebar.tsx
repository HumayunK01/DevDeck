
import { Home, Code, BookOpen, FolderOpen, User, Github, Globe, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'snippets', label: 'Code Snippets', icon: Code },
    { id: 'learning', label: 'Learning Log', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-white text-lg font-bold">
          <User size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">DevDeck</h1>
          <p className="text-slate-400 text-sm">Your Dev Dashboard</p>
        </div>
      </div>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 transform hover:scale-[1.03] hover:shadow-md",
                activeTab === item.id
                  ? "bg-purple-600 text-white shadow-lg border-l-4 border-purple-300"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Social Icons */}
      <div className="mt-auto pt-4 border-t border-slate-800 flex justify-around items-center">
        <a href="https://github.com/HumayunK01" target='_blank' className="text-slate-400 hover:text-white transition-colors">
          <Github size={24} />
        </a>
        <a href="https://www.linkedin.com/in/devhumayun/" target='_blank' className="text-slate-400 hover:text-white transition-colors">
          <Globe size={24} />
        </a>
        <a href="https://www.linkedin.com/in/devhumayun/" target='_blank' className="text-slate-400 hover:text-white transition-colors">
          <Linkedin size={24} />
        </a>
      </div>

      {/* Contribute Button */}
      <div className="mt-4">
        <a
          href="https://github.com/HumayunK01/DevDeck" // Replace # with the actual contribution URL
          className="w-full p-3 rounded-lg bg-purple-700 hover:bg-purple-600 transition-colors text-white text-center font-semibold block"
          target="_blank" // Optional: Opens link in a new tab
          rel="noopener noreferrer" // Optional: Security best practice for target="_blank"
        >
          Contribute to Project
        </a>
      </div>
    </div>
  );
}
