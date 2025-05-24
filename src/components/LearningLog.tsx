import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Search, Trash2 } from 'lucide-react';
import { useLearningEntries } from '@/hooks/useLearningEntries';

interface LearningEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  tags: string[];
}

export function LearningLog() {
  const { entries, addEntry, deleteEntry } = useLearningEntries();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    content: ''
  });

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      addEntry({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
      setFormData({ title: '', category: '', tags: '', content: '' });
      setShowAddForm(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this learning entry?')) {
      deleteEntry(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Learning Log</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search learning entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-700"
        />
      </div>

      <div className="space-y-6">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{entry.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{entry.date}</span>
                    </div>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                      {entry.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(entry.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-slate-300">{entry.content}</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add Learning Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  placeholder="What did you learn today?" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-slate-800 border-slate-700" 
                />
                <Input 
                  placeholder="Category (e.g., JavaScript, CSS, React)" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="bg-slate-800 border-slate-700" 
                />
                <Input 
                  placeholder="Tags (comma separated)" 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="bg-slate-800 border-slate-700" 
                />
                <Textarea 
                  placeholder="Write your learning notes here... (Markdown supported)"
                  rows={15}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="bg-slate-800 border-slate-700 font-mono"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Entry</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
