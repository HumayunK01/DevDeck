
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Github, Globe, Calendar, Trash2, Edit } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Projects() {
  const { projects, addProject, deleteProject, updateProject } = useProjects();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planning' as 'planning' | 'in-progress' | 'completed' | 'paused',
    technologies: '',
    githubUrl: '',
    liveUrl: ''
  });

  const getStatusColor = (status: 'planning' | 'in-progress' | 'completed' | 'paused') => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'in-progress': return 'bg-blue-600';
      case 'planning': return 'bg-yellow-600';
      case 'paused': return 'bg-gray-600';
    }
  };

  const getStatusText = (status: 'planning' | 'in-progress' | 'completed' | 'paused') => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'planning': return 'Planning';
      case 'paused': return 'Paused';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      if (currentProjectId) {
        // Update existing project
        updateProject(currentProjectId, {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
          githubUrl: formData.githubUrl || undefined,
          liveUrl: formData.liveUrl || undefined
        });
        setShowEditForm(false);
      } else {
        // Add new project
        addProject({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
          githubUrl: formData.githubUrl || undefined,
          liveUrl: formData.liveUrl || undefined
        });
        setShowAddForm(false);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'planning',
        technologies: '',
        githubUrl: '',
        liveUrl: ''
      });
      setCurrentProjectId(null);
    }
  };

  const handleEdit = (project: typeof projects[0]) => {
    setCurrentProjectId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      status: project.status,
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || ''
    });
    setShowEditForm(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the project "${title}"? This action cannot be undone.`)) {
      deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <Badge className={`${getStatusColor(project.status)} text-white mt-2`}>
                    {getStatusText(project.status)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(project)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(project.id, project.title)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Started: {project.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Updated: {project.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Project Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Input 
                    placeholder="Project title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-slate-800 border-slate-700 w-full" 
                  />
                  
                  <Textarea 
                    placeholder="Project description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-slate-800 border-slate-700 w-full min-h-[100px]" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 block">Project Status</label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({...formData, status: value as 'planning' | 'in-progress' | 'completed' | 'paused'})}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Input 
                  placeholder="Technologies (comma separated)" 
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  className="bg-slate-800 border-slate-700 w-full" 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="GitHub URL (optional)" 
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                    className="bg-slate-800 border-slate-700" 
                  />
                  <Input 
                    placeholder="Live URL (optional)" 
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                    className="bg-slate-800 border-slate-700" 
                  />
                </div>
                
                <div className="flex gap-4 justify-end mt-6">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700 px-6"
                  >
                    Add Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Project Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Edit Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Input 
                    placeholder="Project title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-slate-800 border-slate-700 w-full" 
                  />
                  
                  <Textarea 
                    placeholder="Project description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-slate-800 border-slate-700 w-full min-h-[100px]" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 block">Project Status</label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({...formData, status: value as 'planning' | 'in-progress' | 'completed' | 'paused'})}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Input 
                  placeholder="Technologies (comma separated)" 
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  className="bg-slate-800 border-slate-700 w-full" 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="GitHub URL (optional)" 
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                    className="bg-slate-800 border-slate-700" 
                  />
                  <Input 
                    placeholder="Live URL (optional)" 
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                    className="bg-slate-800 border-slate-700" 
                  />
                </div>
                
                <div className="flex gap-4 justify-end mt-6">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setShowEditForm(false)}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700 px-6"
                  >
                    Update Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
