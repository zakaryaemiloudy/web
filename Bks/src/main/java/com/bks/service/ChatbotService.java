package com.bks.service;

import com.bks.chatbot.ActionHandler;
import com.bks.chatbot.AIService;
import com.bks.chatbot.FAQHandler;
import com.bks.chatbot.IntentDetector;
import com.bks.dto.ChatMessageRequest;
import com.bks.dto.ChatMessageResponse;
import com.bks.dto.DonneurResponse;
import com.bks.enums.ChatIntent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);

    @Autowired
    private IntentDetector intentDetector;

    @Autowired
    private FAQHandler faqHandler;

    @Autowired
    private ActionHandler actionHandler;

    @Autowired
    private AIService aiService;

    @Autowired
    private DonneurService donneurService;

    // Simple session storage for conversation context (in production, use Redis or database)
    private final Map<String, List<String>> conversationHistory = new ConcurrentHashMap<>();

    private static final int MAX_HISTORY_SIZE = 10;

    public ChatMessageResponse processMessage(ChatMessageRequest request, Long utilisateurId) {
        String message = request.getMessage();
        String sessionId = request.getSessionId();

        if (message == null || message.trim().isEmpty()) {
            return ChatMessageResponse.text(
                    "Je n'ai pas compris votre message. Pouvez-vous reformuler?",
                    getDefaultSuggestions()
            );
        }

        message = message.trim();
        logger.info("Processing message: '{}' for user: {}", message, utilisateurId);

        // Store in conversation history
        addToHistory(sessionId, "user: " + message);

        // Detect intent
        ChatIntent intent = intentDetector.detectIntent(message);
        logger.info("Detected intent: {}", intent);

        ChatMessageResponse response;

        // Route to appropriate handler
        if (faqHandler.canHandle(intent)) {
            response = faqHandler.handleFAQ(intent);
        } else if (actionHandler.canHandle(intent)) {
            response = actionHandler.handleAction(intent, utilisateurId, message);
        } else if (intent == ChatIntent.INCONNU) {
            // Try AI fallback
            response = handleUnknownIntent(message, utilisateurId);
        } else {
            response = ChatMessageResponse.text(
                    "Je ne peux pas traiter cette demande pour le moment.",
                    getDefaultSuggestions()
            );
        }

        // Store response in history
        addToHistory(sessionId, "assistant: " + response.getReponse());

        return response;
    }

    private ChatMessageResponse handleUnknownIntent(String message, Long utilisateurId) {
        // Try AI service if enabled
        if (aiService.isEnabled()) {
            String contexte = buildUserContext(utilisateurId);
            String aiResponse = aiService.askAI(message, contexte);

            return ChatMessageResponse.text(
                    aiResponse,
                    getDefaultSuggestions()
            );
        }

        // Default fallback response
        return ChatMessageResponse.text(
                "Je n'ai pas compris votre demande. Voici ce que je peux faire pour vous:\n\n" +
                "- Répondre aux questions sur le don de sang\n" +
                "- Consulter les stocks disponibles\n" +
                "- Afficher votre historique de dons\n" +
                "- Montrer votre profil et vos badges\n\n" +
                "Essayez de reformuler ou choisissez une suggestion ci-dessous.",
                getDefaultSuggestions()
        );
    }

    private String buildUserContext(Long utilisateurId) {
        try {
            DonneurResponse donneur = donneurService.getDonneurByUtilisateurId(utilisateurId);
            return aiService.generateContextFromUser(
                    utilisateurId,
                    donneur.getGroupeSanguin() != null ? donneur.getGroupeSanguin().name() : null,
                    donneur.getNombreDonsTotal(),
                    donneur.getEligible()
            );
        } catch (Exception e) {
            logger.debug("Could not get donor context: {}", e.getMessage());
            return "";
        }
    }

    public List<String> getSuggestions() {
        return Arrays.asList(
                "Suis-je éligible au don de sang?",
                "Quel est le stock disponible?",
                "Voir mon historique de dons",
                "Comment se déroule un don?",
                "Quels sont les groupes sanguins compatibles?",
                "Quand puis-je donner à nouveau?"
        );
    }

    public List<Map<String, String>> getQuickActions() {
        List<Map<String, String>> actions = new ArrayList<>();

        actions.add(createAction("stock", "Voir les stocks", "Consulter les niveaux de stock de sang"));
        actions.add(createAction("eligibilite", "Mon éligibilité", "Vérifier si je peux donner"));
        actions.add(createAction("historique", "Mes dons", "Voir mon historique de dons"));
        actions.add(createAction("profil", "Mon profil", "Consulter mon profil donneur"));
        actions.add(createAction("faq", "FAQ", "Questions fréquentes sur le don"));
        actions.add(createAction("aide", "Aide", "Comment utiliser le chatbot"));

        return actions;
    }

    private Map<String, String> createAction(String id, String label, String description) {
        Map<String, String> action = new HashMap<>();
        action.put("id", id);
        action.put("label", label);
        action.put("description", description);
        return action;
    }

    private List<String> getDefaultSuggestions() {
        return Arrays.asList(
                "Éligibilité au don",
                "Stock disponible",
                "Mon profil",
                "Aide"
        );
    }

    private void addToHistory(String sessionId, String message) {
        if (sessionId == null || sessionId.isEmpty()) {
            return;
        }

        conversationHistory.computeIfAbsent(sessionId, k -> new ArrayList<>());
        List<String> history = conversationHistory.get(sessionId);

        history.add(message);

        // Keep only recent messages
        if (history.size() > MAX_HISTORY_SIZE) {
            history.remove(0);
        }
    }

    public List<String> getConversationHistory(String sessionId) {
        return conversationHistory.getOrDefault(sessionId, new ArrayList<>());
    }

    public void clearHistory(String sessionId) {
        conversationHistory.remove(sessionId);
    }
}
