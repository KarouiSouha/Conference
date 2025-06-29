import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Send, Edit, Trash2, Filter, FileText, Search, Clock, CheckCircle, Circle, AlertCircle, Archive, X, Plus, Loader2, CheckSquare } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'nouveau' | 'en attente' | 'traité';
  created_at: string;
  updated_at: string;
  notes?: string;
}

interface ContactManagerProps {
  language: 'fr' | 'en';
}

const ContactManager: React.FC<ContactManagerProps> = ({ language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const API_BASE_URL = 'http://localhost:8000/api/Contact';
  const EMAIL_API_URL = 'http://localhost:8000/api/Contact';

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Erreur lors du chargement des messages:', response.statusText);
        showNotification('error', 'Erreur lors du chargement des messages');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      showNotification('error', 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const content = {
    fr: {
      title: 'Gestion des Messages',
      subtitle: 'Gérez efficacement tous vos messages de contact',
      overview: 'Vue d\'ensemble',
      totalMessages: 'Total',
      newMessages: 'Nouveaux',
      pending: 'En attente',
      resolved: 'Traités',
      actions: {
        view: 'Voir',
        reply: 'Répondre',
        edit: 'Modifier',
        delete: 'Supprimer',
        close: 'Fermer',
        send: 'Envoyer'
      },
      statuses: {
        nouveau: 'Nouveau',
        'en attente': 'En attente',
        traité: 'Traité',
      },
      filters: {
        all: 'Tous les messages',
        nouveau: 'Nouveaux',
        'en attente': 'En attente',
        traité: 'Traités',
      },
      search: 'Rechercher...',
      noMessages: 'Aucun message trouvé',
      from: 'De',
      date: 'Date',
      yourReply: 'Votre réponse',
      replySubject: 'Sujet de la réponse',
      messageDetails: 'Détails du message',
      sending: 'Envoi en cours...',
      emailSent: 'Email envoyé avec succès !',
      emailError: 'Erreur lors de l\'envoi de l\'email',
      statusUpdated: 'Statut mis à jour',
      replyPlaceholder: 'Tapez votre réponse ici...',
      subjectPlaceholder: 'Re: ',
      originalMessage: 'Message original'
    },
    en: {
      title: 'Message Management',
      subtitle: 'Efficiently manage all your contact messages',
      overview: 'Overview',
      totalMessages: 'Total',
      newMessages: 'New',
      pending: 'Pending',
      resolved: 'Resolved',
      actions: {
        view: 'View',
        reply: 'Reply',
        edit: 'Edit',
        delete: 'Delete',
        close: 'Close',
        send: 'Send'
      },
      statuses: {
        nouveau: 'New',
        'en attente': 'Pending',
        traité: 'Resolved',
      },
      filters: {
        all: 'All messages',
        nouveau: 'New',
        'en attente': 'Pending',
        traité: 'Resolved',
      },
      search: 'Search...',
      noMessages: 'No messages found',
      from: 'From',
      date: 'Date',
      yourReply: 'Your reply',
      replySubject: 'Reply subject',
      messageDetails: 'Message Details',
      sending: 'Sending...',
      emailSent: 'Email sent successfully!',
      emailError: 'Error sending email',
      statusUpdated: 'Status updated',
      replyPlaceholder: 'Type your reply here...',
      subjectPlaceholder: 'Re: ',
      originalMessage: 'Original message'
    },
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nouveau': return <Circle className="w-4 h-4 text-blue-600" />;
      case 'en attente': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'traité': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'en attente': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'traité': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleView = async (message: Message) => {
    setSelectedMessage(message);
    setNotes(message.notes || '');
    
    if (message.status === 'nouveau') {
      try {
        const response = await fetch(`${API_BASE_URL}/${message.id}/view`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const updatedMessage = await response.json();
          setMessages(messages.map(m => m.id === message.id ? updatedMessage.data : m));
          setSelectedMessage(updatedMessage.data);
        } else {
          console.error('Erreur lors de la mise à jour du statut');
          showNotification('error', 'Erreur lors de la mise à jour du statut');
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
        showNotification('error', 'Erreur de connexion');
      }
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyMessage.trim()) return;

    setSending(true);
    
    try {
      const emailData = {
        to: selectedMessage.email,
        subject: replySubject || `Re: ${selectedMessage.subject || 'Votre message'}`,
        message: replyMessage,
        originalMessage: {
          name: selectedMessage.name,
          email: selectedMessage.email,
          subject: selectedMessage.subject,
          message: selectedMessage.message,
          date: selectedMessage.created_at
        }
      };

      const emailResponse = await fetch(`${EMAIL_API_URL}/${selectedMessage.id}/send-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (emailResponse.ok) {
        showNotification('success', content[language].emailSent);
        
        setReplyMessage('');
        setReplySubject('');
        setShowReplyModal(false);
        
        fetchMessages();
      } else {
        const errorData = await emailResponse.json();
        showNotification('error', errorData.message || content[language].emailError);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      showNotification('error', content[language].emailError);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: Message['status'], showNotif: boolean = true) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
        
        if (showNotif) {
          showNotification('success', content[language].statusUpdated);
        }
      } else {
        console.error('Erreur lors de la mise à jour du statut');
        showNotification('error', 'Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      showNotification('error', 'Erreur de connexion');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessages(messages.filter(m => m.id !== id));
          if (selectedMessage?.id === id) {
            setSelectedMessage(null);
          }
          showNotification('success', 'Message supprimé');
        } else {
          console.error('Erreur lors de la suppression');
          showNotification('error', 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
        showNotification('error', 'Erreur de connexion');
      }
    }
  };

  const openReplyModal = () => {
    if (selectedMessage) {
      setReplySubject(`Re: ${selectedMessage.subject || 'Votre message'}`);
      setShowReplyModal(true);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesSearch = message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'nouveau').length,
    pending: messages.filter(m => m.status === 'en attente').length,
    resolved: messages.filter(m => m.status === 'traité').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">{content[language].sending}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {notification && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? 
              <CheckSquare className="w-5 h-5" /> : 
              <AlertCircle className="w-5 h-5" />
            }
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{content[language].title}</h1>
          <p className="text-lg text-gray-600">{content[language].subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: content[language].totalMessages, value: stats.total, icon: Mail, color: 'blue' },
            { label: content[language].newMessages, value: stats.new, icon: Circle, color: 'blue' },
            { label: content[language].pending, value: stats.pending, icon: Clock, color: 'orange' },
            { label: content[language].resolved, value: stats.resolved, icon: CheckCircle, color: 'green' },
          ].map((stat, index) => (
            <Card key={index} className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                    <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="border-b border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={content[language].search}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {Object.entries(content[language].filters).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredMessages.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">
                    <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">{content[language].noMessages}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredMessages.map(message => (
                      <div
                        key={message.id}
                        className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          selectedMessage?.id === message.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                        } ${message.status === 'nouveau' ? 'border-l-4 border-blue-600' : ''}`}
                        onClick={() => handleView(message)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(message.status)}
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(message.status)}`}>
                                {content[language].statuses[message.status]}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{message.subject || 'Sans sujet'}</h3>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>{message.name || 'Anonyme'}</strong> - {message.email || 'Pas d\'email'}
                            </p>
                            <p className="text-sm text-gray-500">{formatDate(message.created_at)}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(message.id);
                              }}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {selectedMessage ? (
              <Card className="border-none shadow-lg bg-white sticky top-8">
                <CardHeader className="border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">{content[language].messageDetails}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedMessage(null)}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-3">{selectedMessage.subject || 'Sans sujet'}</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><span className="font-medium text-gray-600">{content[language].from}:</span> {selectedMessage.name || 'Anonyme'}</p>
                      <p><span className="font-medium text-gray-600">Email:</span> {selectedMessage.email || 'Pas d\'email'}</p>
                      <p><span className="font-medium text-gray-600">{content[language].date}:</span> {formatDate(selectedMessage.created_at)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Message</h4>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message || 'Pas de message'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Statut</h4>
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value as Message['status'])}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {Object.entries(content[language].statuses).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={openReplyModal}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all"
                    disabled={!selectedMessage.email}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {content[language].actions.reply}
                  </Button>
                  
                  {!selectedMessage.email && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Email non disponible pour ce message
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-lg bg-white">
                <CardContent className="p-12 text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-500">Sélectionnez un message pour voir les détails</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {showReplyModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto border-none shadow-xl bg-white">
              <CardHeader className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Répondre à: {selectedMessage.name || 'Anonyme'}</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyMessage('');
                      setReplySubject('');
                    }}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">{content[language].originalMessage}</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>De:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                    <p><strong>Sujet:</strong> {selectedMessage.subject}</p>
                    <p><strong>Date:</strong> {formatDate(selectedMessage.created_at)}</p>
                    <div className="mt-3 p-4 bg-white rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {content[language].replySubject}
                    </label>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={content[language].subjectPlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {content[language].yourReply}
                    </label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={8}
                      placeholder={content[language].replyPlaceholder}
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyMessage('');
                      setReplySubject('');
                    }}
                    disabled={sending}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    {content[language].actions.close}
                  </Button>
                  <Button 
                    onClick={handleReply}
                    disabled={sending || !replyMessage.trim()}
                    className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {content[language].sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {content[language].actions.send}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManager;