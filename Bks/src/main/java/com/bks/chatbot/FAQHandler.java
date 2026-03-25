package com.bks.chatbot;

import com.bks.dto.ChatMessageResponse;
import com.bks.enums.ChatIntent;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class FAQHandler {

    private final Map<ChatIntent, String> faqResponses;
    private final IntentDetector intentDetector;

    public FAQHandler(IntentDetector intentDetector) {
        this.intentDetector = intentDetector;
        this.faqResponses = initializeFAQResponses();
    }

    private Map<ChatIntent, String> initializeFAQResponses() {
        Map<ChatIntent, String> responses = new EnumMap<>(ChatIntent.class);

        responses.put(ChatIntent.SALUTATION,
                "Bonjour! Je suis l'assistant virtuel du système de banque de sang BKS. " +
                "Je peux vous aider avec:\n" +
                "- Questions sur le don de sang\n" +
                "- Consultation des stocks\n" +
                "- Votre historique de dons\n" +
                "- Et bien plus!\n\n" +
                "Comment puis-je vous aider aujourd'hui?");

        responses.put(ChatIntent.REMERCIEMENT,
                "Je vous en prie! N'hésitez pas si vous avez d'autres questions. " +
                "Je suis là pour vous aider.");

        responses.put(ChatIntent.ELIGIBILITE_DON,
                "Pour être éligible au don de sang, vous devez remplir les conditions suivantes:\n\n" +
                "- Âge: entre 18 et 65 ans\n" +
                "- Poids: minimum 50 kg\n" +
                "- Être en bonne santé générale\n" +
                "- Intervalle minimum de 8 semaines (56 jours) entre deux dons de sang total\n" +
                "- Ne pas avoir eu de tatouage ou piercing dans les 4 derniers mois\n" +
                "- Ne pas avoir voyagé dans certaines zones à risque récemment\n\n" +
                "Pour vérifier votre éligibilité exacte, consultez votre profil ou contactez un centre de don.");

        responses.put(ChatIntent.PROCESSUS_DON,
                "Le processus de don de sang se déroule en plusieurs étapes:\n\n" +
                "1. **Accueil et inscription** (5-10 min)\n" +
                "   - Vérification de votre identité\n" +
                "   - Remplissage du questionnaire de santé\n\n" +
                "2. **Entretien médical** (5-10 min)\n" +
                "   - Discussion avec un médecin ou infirmier\n" +
                "   - Prise de tension et test d'hémoglobine\n\n" +
                "3. **Le don** (8-12 min)\n" +
                "   - Prélèvement d'environ 450 ml de sang\n" +
                "   - Vous êtes confortablement installé\n\n" +
                "4. **Repos et collation** (10-15 min)\n" +
                "   - Moment de repos obligatoire\n" +
                "   - Collation offerte\n\n" +
                "Durée totale: environ 45 minutes à 1 heure.");

        responses.put(ChatIntent.GROUPES_SANGUINS,
                "Il existe 8 groupes sanguins principaux:\n\n" +
                "**Système ABO + Rhésus:**\n" +
                "- A+, A-, B+, B-, AB+, AB-, O+, O-\n\n" +
                "**Compatibilité:**\n" +
                "- **O-** : Donneur universel (peut donner à tous)\n" +
                "- **AB+** : Receveur universel (peut recevoir de tous)\n" +
                "- Le même groupe est toujours compatible\n\n" +
                "**Fréquence au Maroc:**\n" +
                "- O+ : 42% (le plus courant)\n" +
                "- A+ : 34%\n" +
                "- B+ : 14%\n" +
                "- AB+ : 6%\n" +
                "- Groupes négatifs : 4% au total");

        responses.put(ChatIntent.EFFETS_SECONDAIRES,
                "Le don de sang est généralement très bien toléré. Voici ce qu'il faut savoir:\n\n" +
                "**Effets possibles (rares et temporaires):**\n" +
                "- Légère fatigue dans les heures suivantes\n" +
                "- Petit hématome au point de ponction\n" +
                "- Sensation de vertige (rare)\n\n" +
                "**Pour les éviter:**\n" +
                "- Bien manger avant le don\n" +
                "- Bien s'hydrater (avant et après)\n" +
                "- Prendre le temps de repos proposé\n" +
                "- Éviter les efforts intenses le jour du don\n\n" +
                "**Important:** Le corps régénère le volume sanguin en 24-48h " +
                "et les globules rouges en quelques semaines.");

        responses.put(ChatIntent.AVANTAGES_DON,
                "Donner son sang a de nombreux avantages:\n\n" +
                "**Pour les patients:**\n" +
                "- Sauver jusqu'à 3 vies avec un seul don\n" +
                "- Aider les victimes d'accidents\n" +
                "- Soutenir les patients atteints de maladies graves\n\n" +
                "**Pour vous:**\n" +
                "- Bilan de santé gratuit à chaque don\n" +
                "- Renouvellement des cellules sanguines\n" +
                "- Sentiment de contribuer à la communauté\n" +
                "- Points et badges sur notre plateforme!\n\n" +
                "**Bon à savoir:** Un patient a besoin de sang toutes les 10 secondes en moyenne.");

        responses.put(ChatIntent.INTERVALLE_DONS,
                "Les intervalles minimums entre les dons sont:\n\n" +
                "**Don de sang total:**\n" +
                "- Hommes: 8 semaines (56 jours)\n" +
                "- Femmes: 8 semaines (56 jours)\n" +
                "- Maximum 6 dons/an pour les hommes, 4 pour les femmes\n\n" +
                "**Don de plasma:**\n" +
                "- 2 semaines minimum\n" +
                "- Jusqu'à 24 fois par an\n\n" +
                "**Don de plaquettes:**\n" +
                "- 4 semaines minimum\n" +
                "- Jusqu'à 12 fois par an\n\n" +
                "Consultez votre profil pour voir votre prochaine date d'éligibilité.");

        responses.put(ChatIntent.AIDE_GENERALE,
                "Je suis l'assistant virtuel BKS et je peux vous aider avec:\n\n" +
                "**Questions fréquentes:**\n" +
                "- Éligibilité au don de sang\n" +
                "- Processus de don\n" +
                "- Groupes sanguins et compatibilité\n" +
                "- Effets secondaires\n\n" +
                "**Actions:**\n" +
                "- Consulter les stocks de sang\n" +
                "- Voir votre historique de dons\n" +
                "- Consulter votre profil\n" +
                "- Voir vos badges et points\n\n" +
                "Posez-moi simplement votre question!");

        responses.put(ChatIntent.NAVIGATION,
                "Voici comment naviguer dans l'application:\n\n" +
                "**Menu principal:**\n" +
                "- Dashboard: vue d'ensemble\n" +
                "- Stock: voir les disponibilités\n" +
                "- Demandes: gérer les demandes de sang\n" +
                "- Dons: historique et planification\n" +
                "- Profil: vos informations\n\n" +
                "Que souhaitez-vous trouver?");

        responses.put(ChatIntent.CONTACT_SUPPORT,
                "Pour contacter le support:\n\n" +
                "**Urgence médicale:** Appelez le 15 (SAMU)\n\n" +
                "**Support technique:**\n" +
                "- Email: support@bks.ma\n" +
                "- Téléphone: 0522-XX-XX-XX\n" +
                "- Horaires: 8h-18h, Lun-Ven\n\n" +
                "Un conseiller humain peut également vous rappeler.");

        return responses;
    }

    public boolean canHandle(ChatIntent intent) {
        return faqResponses.containsKey(intent);
    }

    public ChatMessageResponse handleFAQ(ChatIntent intent) {
        String response = faqResponses.getOrDefault(intent,
                "Je n'ai pas de réponse prédéfinie pour cette question.");

        List<String> suggestions = intentDetector.getSuggestionsForIntent(intent);

        return ChatMessageResponse.text(response, suggestions);
    }

    public List<String> getAvailableFAQTopics() {
        return Arrays.asList(
                "Éligibilité au don",
                "Processus de don",
                "Groupes sanguins",
                "Effets secondaires",
                "Avantages du don",
                "Intervalle entre dons"
        );
    }
}
