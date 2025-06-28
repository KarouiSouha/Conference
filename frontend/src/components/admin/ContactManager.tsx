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
  const EMAIL_API_URL = 'http://localhost:8000/api/Contact'; // Base URL pour l'envoi d'emails

  // Charger les messages depuis l'API
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
      case 'nouveau': return <Circle className="w-4 h-4 text-blue-500" />;
      case 'en attente': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'traité': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'en attente': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'traité': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
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

  // Fonction pour gérer la visualisation d'un message
  const handleView = async (message: Message) => {
    setSelectedMessage(message);
    setNotes(message.notes || '');
    
    // Si le message est "nouveau", le passer automatiquement à "en attente"
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

  // Fonction pour envoyer un email de réponse
  const handleReply = async () => {
    if (!selectedMessage || !replyMessage.trim()) return;

    setSending(true);
    
    try {
      // Préparer les données de l'email
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

      // Envoyer l'email
      const emailResponse = await fetch(`${EMAIL_API_URL}/${selectedMessage.id}/send-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (emailResponse.ok) {
        showNotification('success', content[language].emailSent);
        
        // Réinitialiser le formulaire
        setReplyMessage('');
        setReplySubject('');
        setShowReplyModal(false);
        
        // Actualiser la liste des messages
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

  // Fonction pour changer le statut d'un message
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
        // Mettre à jour l'état local
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

  // Préparer le sujet de réponse quand on ouvre le modal
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
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? 
              <CheckSquare className="w-5 h-5" /> : 
              <AlertCircle className="w-5 h-5" />
            }
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{content[language].title}</h1>
          <p className="text-gray-600">{content[language].subtitle}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{content[language].totalMessages}</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{content[language].newMessages}</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Circle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{content[language].pending}</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{content[language].resolved}</p>
                  <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder={content[language].search}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(content[language].filters).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>{content[language].noMessages}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredMessages.map(message => (
                      <div
                        key={message.id}
                        className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                        } ${message.status === 'nouveau' ? 'border-l-4 border-l-blue-400' : ''}`}
                        onClick={() => handleView(message)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(message.status)}
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                                {content[language].statuses[message.status]}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                              {message.subject || 'Sans sujet'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>{message.name || 'Anonyme'}</strong> - {message.email || 'Pas d\'email'}
                            </p>
                            <p className="text-sm text-gray-500">{formatDate(message.created_at)}</p>
                          </div>
                          <div className="flex gap-1 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(message.id);
                              }}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* Message Details */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <Card className="border-0 shadow-sm bg-white sticky top-6">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{content[language].messageDetails}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedMessage(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">{selectedMessage.subject || 'Sans sujet'}</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium text-gray-600">{content[language].from}:</span> {selectedMessage.name || 'Anonyme'}</p>
                      <p><span className="font-medium text-gray-600">Email:</span> {selectedMessage.email || 'Pas d\'email'}</p>
                      <p><span className="font-medium text-gray-600">{content[language].date}:</span> {formatDate(selectedMessage.created_at)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Message</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message || 'Pas de message'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Statut</h4>
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value as Message['status'])}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(content[language].statuses).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={openReplyModal}
                    className="w-full"
                    disabled={!selectedMessage.email}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {content[language].actions.reply}
                  </Button>
                  
                  {!selectedMessage.email && (
                    <p className="text-xs text-gray-500 text-center">
                      Email non disponible pour ce message
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-12 text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Sélectionnez un message pour voir les détails</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Reply Modal */}
        {showReplyModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle>Répondre à: {selectedMessage.name || 'Anonyme'}</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyMessage('');
                      setReplySubject('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Message original */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">{content[language].originalMessage}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>De:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                      <p><strong>Sujet:</strong> {selectedMessage.subject}</p>
                      <p><strong>Date:</strong> {formatDate(selectedMessage.created_at)}</p>
                      <div className="mt-2 p-3 bg-white rounded border-l-4 border-blue-300">
                        <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Formulaire de réponse */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {content[language].replySubject}
                      </label>
                      <input
                        type="text"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={content[language].subjectPlaceholder}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {content[language].yourReply}
                      </label>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    >
                      {content[language].actions.close}
                    </Button>
                    <Button 
                      onClick={handleReply}
                      disabled={sending || !replyMessage.trim()}
                      className="min-w-[120px]"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {content[language].sending}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {content[language].actions.send}
                        </>
                      )}
                    </Button>
                  </div>
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