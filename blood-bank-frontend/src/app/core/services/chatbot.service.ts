import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface ChatbotRequest {
  message: string;
  sessionId?: string;
  context?: any;
}

interface ChatbotResponse {
  response: string;
  suggestions?: string[];
  context?: any;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiUrl = 'http://localhost:8080/api/chatbot';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, sessionId?: string): Observable<ChatbotResponse> {
    const request: ChatbotRequest = {
      message,
      sessionId: sessionId || this.generateSessionId()
    };

    // For now, return mock response - replace with actual API call when backend is ready
    return this.getMockResponse(message);
    
    // Uncomment when backend API is ready:
    /*
    return this.http.post<ChatbotResponse>(`${this.apiUrl}/chat`, request).pipe(
      catchError(error => {
        console.error('Chatbot API error:', error);
        return this.getFallbackResponse();
      })
    );
    */
  }

  private getMockResponse(userMessage: string): Observable<ChatbotResponse> {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';
    let suggestions: string[] = [];

    if (lowerMessage.includes('donner') || lowerMessage.includes('don')) {
      response = 'Pour donner du sang, vous devez:\n\n1️⃣ **Être en bonne santé**\n2️⃣ **Avoir entre 18 et 65 ans**\n3️⃣ **Peser plus de 50kg**\n4️⃣ **Avoir une pièce d\'identité**\n\nLe processus prend environ 45 minutes:\n- Inscription (10 min)\n- Questionnaire médical (15 min)\n- Prélèvement (10 min)\n- Collation (10 min)\n\nVoulez-vous trouver un centre de don près de chez vous?';
      suggestions = ['Où donner près de chez moi?', 'Préparer mon don', 'Questions médicales'];
    } else if (lowerMessage.includes('critère') || lowerMessage.includes('condition')) {
      response = 'Les critères principaux pour donner du sang:\n\n✅ **Âge**: 18-65 ans\n✅ **Poids**: Minimum 50kg\n✅ **Santé**: Bon état de santé général\n✅ **Identité**: Pièce d\'identité valide\n\n❌ **Contre-indications temporaires**:\n- Grossesse/allaitement\n- Chirurgie récente\n- Maladie infectieuse\n- Certains médicaments\n\n❌ **Contre-indications définitives**:\n- Maladies chroniques graves\n- Hépatites B/C\n- VIH\n\nBesoin de plus de détails sur un critère spécifique?';
      suggestions = ['Médicaments et don', 'Maladies et don', 'Après un voyage'];
    } else if (lowerMessage.includes('hôpital') || lowerMessage.includes('centre')) {
      response = 'Voici les principaux hôpitaux et centres de don:\n\n🏥 **Centre Hospitalier Casa**\n📍 Casablanca, Centre Ville\n📞 0522-123456\n⏰ Lundi-Vendredi 8h-18h\n\n🏥 **Hôpital Ibn Sina**\n📍 Rabat, Agdal\n📞 0537-987654\n⏰ Tous les jours 7h-20h\n\n🏥 **Centre de Transfusion Sanguine**\n📍 Marrakech, Guéliz\n📞 0524-456789\n⏰ Lundi-Samedi 8h-17h\n\nJe peux vous donner plus de détails sur un centre spécifique ou vous aider à trouver le plus proche de votre localisation.';
      suggestions = ['Centre le plus proche', 'Horaires précis', 'Prise de rendez-vous'];
    } else if (lowerMessage.includes('urgence') || lowerMessage.includes('urgent')) {
      response = '⚠️ **URGENCE MÉDICALE**\n\nEn cas d\'urgence vitale:\n🚑 **Appelez le 15** (SAMU)\n🚑 **Composez le 112** (Europe)\n\nPour les besoins urgents en sang:\n🏥 **Contactez directement l\'hôpital** le plus proche\n📞 **Appelez le centre de transfusion** de votre région\n\nLes hôpitaux disposent de stocks d\'urgence pour:\n- Accidents graves\n- Chirurgies d\'urgence\n- Complications obstétricales\n\n**N\'attendez pas** - chaque minute compte en situation d\'urgence!';
      suggestions = ['Numéros d\'urgence', 'Hôpitaux d\'urgence', 'Stocks d\'urgence'];
    } else if (lowerMessage.includes('profil') || lowerMessage.includes('compte')) {
      response = 'Pour gérer votre profil donneur:\n\n📱 **Via l\'application mobile**\n- Consultez votre historique de dons\n- Mettez à jour vos informations\n- Prenez rendez-vous\n\n💻 **Via le site web**\n- Connectez-vous à votre espace personnel\n- Accédez à votre tableau de bord\n- Téléchargez votre carte de donneur\n\n📞 **Par téléphone**\n- Centre de transfusion sanguine\n- Service client: 0800-123456\n\nQuel aspect de votre profil souhaitez-vous gérer?';
      suggestions = ['Historique des dons', 'Mettre à jour infos', 'Prendre rendez-vous'];
    } else if (lowerMessage.includes('type') || lowerMessage.includes('groupe')) {
      response = 'Les différents groupes sanguins:\n\n🔴 **Groupe A**\n- A+: Donneur universel pour A+, AB+\n- A-: Donneur universel pour A+, A-, AB+, AB-\n\n🔵 **Groupe B**\n- B+: Donneur pour B+, AB+\n- B-: Donneur pour B+, B-, AB+, AB-\n\n🟡 **Groupe AB**\n- AB+: Receveur universel\n- AB-: Receveur universel pour groupe Rh-\n\n🟢 **Groupe O**\n- O+: Donneur universel pour tous les groupes Rh+\n- O-: Donneur universel complet\n\n**Le groupe O- est le plus précieux en urgence!**';
      suggestions = ['Mon groupe sanguin', 'Compatibilité', 'Donneur universel'];
    } else {
      response = 'Je comprends votre question. Voici comment je peux vous aider:\n\n🩸 **Information sur le don de sang**\n🏥 **Localisation des hôpitaux et centres**\n📋 **Critères d\'éligibilité**\n🆘 **Gestion des urgences**\n👤 **Gestion de profil donneur**\n🩸 **Types de sang et compatibilité**\n\nN\'hésitez pas à me poser une question spécifique ou à choisir une des options ci-dessous!';
      suggestions = ['Comment donner du sang?', 'Trouver un hôpital', 'Critères d\'éligibilité', 'Urgence médicale', 'Types de sang'];
    }

    return of({
      response,
      suggestions,
      timestamp: new Date().toISOString()
    });
  }

  private getFallbackResponse(): Observable<ChatbotResponse> {
    return of({
      response: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants ou contacter notre support au 0800-123456.',
      suggestions: ['Réessayer', 'Contacter le support'],
      timestamp: new Date().toISOString()
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Additional methods for future features
  getChatHistory(sessionId: string): Observable<any[]> {
    // TODO: Implement chat history retrieval
    return of([]);
  }

  clearChatHistory(sessionId: string): Observable<void> {
    // TODO: Implement chat history clearing
    return of(void 0);
  }

  rateResponse(messageId: string, rating: number): Observable<void> {
    // TODO: Implement response rating for improvement
    return of(void 0);
  }
}
