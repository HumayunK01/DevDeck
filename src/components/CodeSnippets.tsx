import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Copy, Edit, Trash2 } from 'lucide-react';
import { useSnippets } from '@/hooks/useSnippets';

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  description: string;
  createdAt: string;
}

export function CodeSnippets() {
  const { snippets, addSnippet, updateSnippet, deleteSnippet } = useSnippets();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<string | null>(null);
  const [copyAnimation, setCopyAnimation] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    language: '',
    tags: '',
    description: '',
    code: ''
  });

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const copyToClipboard = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopyAnimation(id);
    setTimeout(() => setCopyAnimation(null), 1000);
  };

  const handleEdit = (snippet: Snippet) => {
    setFormData({
      title: snippet.title,
      language: snippet.language,
      tags: snippet.tags.join(', '),
      description: snippet.description,
      code: snippet.code
    });
    setEditingSnippet(snippet.id);
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.code) {
      const snippetData = {
        title: formData.title,
        code: formData.code,
        language: formData.language,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        description: formData.description
      };

      if (editingSnippet) {
        updateSnippet(editingSnippet, snippetData);
      } else {
        addSnippet(snippetData);
      }

      setFormData({ title: '', language: '', tags: '', description: '', code: '' });
      setShowAddForm(false);
      setEditingSnippet(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      deleteSnippet(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Code Snippets</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Snippet
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search snippets or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSnippets.map((snippet) => (
          <Card key={snippet.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{snippet.title}</CardTitle>
                  <p className="text-slate-400 text-sm mt-1">{snippet.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(snippet.id, snippet.code)}
                    className={`transition-transform ${copyAnimation === snippet.id ? 'scale-125' : ''}`}
                  >
                    <Copy className={`w-4 h-4 ${copyAnimation === snippet.id ? 'text-green-500' : ''}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(snippet)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(snippet.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                    {snippet.language}
                  </Badge>
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-300">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
                <p className="text-xs text-slate-500">Created: {snippet.createdAt}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>{editingSnippet ? 'Edit Snippet' : 'Add New Snippet'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  placeholder="Snippet title" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-slate-800 border-slate-700" 
                />
                <Input 
                  placeholder="Language (e.g., javascript, css, python)" 
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="bg-slate-800 border-slate-700" 
                />
                <Input 
                  placeholder="Tags (comma separated)" 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="bg-slate-800 border-slate-700" 
                />
                <Textarea 
                  placeholder="Description" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-slate-800 border-slate-700" 
                />
                <Textarea 
                  placeholder="Your code here..." 
                  rows={10} 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="bg-slate-800 border-slate-700 font-mono" 
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Snippet</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
