
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, BookOpen, FolderOpen, TrendingUp } from 'lucide-react';
import { useSnippets } from '@/hooks/useSnippets';
import { useLearningEntries } from '@/hooks/useLearningEntries';
import { useProjects } from '@/hooks/useProjects';
import { loadData, saveData } from '@/utils/dataManager';

export function Dashboard({ setActiveTab, openSnippetModal, openLearningModal, openProjectModal }) {
  const { snippets } = useSnippets();
  const { entries } = useLearningEntries();
  const { projects } = useProjects();

  // Track user visits
  useEffect(() => {
    const trackVisit = () => {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const visits = loadData('visitDates', []);
      
      // Check if we already recorded a visit for today
      if (!visits.includes(today)) {
        const updatedVisits = [...visits, today];
        saveData('visitDates', updatedVisits);
      }
    };
    
    trackVisit();
  }, []); // Run once when component mounts

  // Calculate streak days based on daily visits
  const calculateStreakDays = () => {
    const visits = loadData('visitDates', []);
    if (visits.length === 0) return 0;
    
    // Sort visits by date (newest first)
    const sortedVisits = [...visits].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
    
    for (let i = 0; i < sortedVisits.length; i++) {
      const visitDate = new Date(sortedVisits[i]);
      visitDate.setHours(0, 0, 0, 0); // Set to beginning of day
      
      const daysDiff = Math.floor((today.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff < streak) {
        // This handles the case where there are multiple visits on the same day
        continue;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const stats = [
    { label: 'Code Snippets', value: snippets.length.toString(), icon: Code, color: 'text-blue-400' },
    { label: 'Learning Entries', value: entries.length.toString(), icon: BookOpen, color: 'text-green-400' },
    { label: 'Projects', value: projects.length.toString(), icon: FolderOpen, color: 'text-yellow-400' },
    { label: 'Streak Days', value: calculateStreakDays().toString(), icon: TrendingUp, color: 'text-purple-400' },
  ];

  // Get actual recent activity from all data sources
  const recentActivity = [
    ...snippets.slice(-3).map(snippet => ({
      type: 'snippet',
      title: snippet.title,
      time: `Created ${snippet.createdAt}`,
      date: new Date(snippet.createdAt)
    })),
    ...entries.slice(-3).map(entry => ({
      type: 'learning',
      title: entry.title,
      time: `Learned ${entry.date}`,
      date: new Date(entry.date)
    })),
    ...projects.slice(-3).map(project => ({
      type: 'project',
      title: project.title,
      time: `Updated ${project.lastUpdated}`,
      date: new Date(project.lastUpdated)
    }))
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-slate-400">Here's what's happening with your development journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'snippet' ? 'bg-blue-400' :
                    activity.type === 'learning' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-400 py-8">
                  <p>No recent activity</p>
                  <p className="text-xs mt-1">Start by adding some snippets or learning entries!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                className="w-full p-3 rounded-lg bg-slate-800 hover:bg-purple-700 transition-colors text-left"
                onClick={() => {
                  if (openSnippetModal) {
                    openSnippetModal();
                  } else if (setActiveTab) {
                    setActiveTab('snippets');
                  }
                }}
              >
                <div className="text-sm font-medium">Add Code Snippet</div>
                <div className="text-xs text-slate-400">Save your latest code discovery</div>
              </button>
              <button
                className="w-full p-3 rounded-lg bg-slate-800 hover:bg-purple-700 transition-colors text-left"
                onClick={() => {
                  if (openLearningModal) {
                    openLearningModal();
                  } else if (setActiveTab) {
                    setActiveTab('learning');
                  }
                }}
              >
                <div className="text-sm font-medium">Log Learning</div>
                <div className="text-xs text-slate-400">Document what you learned today</div>
              </button>
              <button
                className="w-full p-3 rounded-lg bg-slate-800 hover:bg-purple-700 transition-colors text-left"
                onClick={() => {
                  if (openProjectModal) {
                    openProjectModal();
                  } else if (setActiveTab) {
                    setActiveTab('projects');
                  }
                }}
              >
                <div className="text-sm font-medium">Create Project</div>
                <div className="text-xs text-slate-400">Start tracking a new project</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
