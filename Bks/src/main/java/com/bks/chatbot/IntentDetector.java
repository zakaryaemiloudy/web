package com.bks.chatbot;

import com.bks.enums.ChatIntent;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.*;
import java.util.regex.Pattern;

@Component
public class IntentDetector {

    private final Map<ChatIntent, List<String>> intentKeywords;

    public IntentDetector() {
        this.intentKeywords = initializeKeywords();
    }

    private Map<ChatIntent, List<String>> initializeKeywords() {
        Map<ChatIntent, List<String>> keywords = new EnumMap<>(ChatIntent.class);

        // Salutations
        keywords.put(ChatIntent.SALUTATION, Arrays.asList(
                "bonjour", "salut", "bonsoir", "hello", "hi", "coucou", "hey"
        ));

        keywords.put(ChatIntent.REMERCIEMENT, Arrays.asList(
                "merci", "merci beaucoup", "thanks", "thank you", "super", "parfait", "genial"
        ));

        // FAQ - Eligibilité
        keywords.put(ChatIntent.ELIGIBILITE_DON, Arrays.asList(
                "eligible", "eligibilite", "puis-je donner", "peux-je donner", "conditions",
                "qui peut donner", "puis je", "peux je", "ai-je le droit", "droit de donner",
                "criteres", "requis", "prerequis", "autorise"
        ));

        // FAQ - Processus de don
        keywords.put(ChatIntent.PROCESSUS_DON, Arrays.asList(
                "processus", "comment ca se passe", "deroulement", "etapes", "procedure",
                "comment donner", "comment faire un don", "donner du sang", "faire un don",
                "combien de temps", "duree du don"
        ));

        // FAQ - Groupes sanguins
        keywords.put(ChatIntent.GROUPES_SANGUINS, Arrays.asList(
                "groupe sanguin", "groupes sanguins", "compatibilite", "compatible",
                "type sanguin", "o+", "o-", "a+", "a-", "b+", "b-", "ab+", "ab-",
                "donneur universel", "receveur universel", "rhesus"
        ));

        // FAQ - Effets secondaires
        keywords.put(ChatIntent.EFFETS_SECONDAIRES, Arrays.asList(
                "effets secondaires", "risques", "danger", "dangereux", "douleur",
                "fait mal", "peur", "apres le don", "consequences", "symptomes",
                "malaise", "fatigue", "vertige"
        ));

        // FAQ - Avantages du don
        keywords.put(ChatIntent.AVANTAGES_DON, Arrays.asList(
                "avantages", "benefices", "pourquoi donner", "bienfaits", "interets",
                "raisons de donner", "motivation"
        ));

        // FAQ - Intervalle entre dons
        keywords.put(ChatIntent.INTERVALLE_DONS, Arrays.asList(
                "intervalle", "frequence", "combien de fois", "delai entre", "attendre",
                "prochain don", "tous les combien", "fois par an"
        ));

        // Actions - Stock
        keywords.put(ChatIntent.CONSULTER_STOCK, Arrays.asList(
                "stock", "disponible", "disponibilite", "sang disponible", "reserve",
                "quantite disponible", "etat du stock", "niveau de stock", "stocks"
        ));

        // Actions - Créer demande
        keywords.put(ChatIntent.CREER_DEMANDE, Arrays.asList(
                "demande", "commander", "besoin de sang", "creer une demande",
                "nouvelle demande", "faire une demande", "demander du sang"
        ));

        // Actions - Historique
        keywords.put(ChatIntent.HISTORIQUE_DONS, Arrays.asList(
                "historique", "mes dons", "dons precedents", "liste de mes dons",
                "combien de dons", "dernier don", "anciennes donations"
        ));

        // Actions - Profil
        keywords.put(ChatIntent.MON_PROFIL, Arrays.asList(
                "mon profil", "mes informations", "mes donnees", "voir mon profil",
                "informations personnelles", "mon compte"
        ));

        // Actions - Prochaine éligibilité
        keywords.put(ChatIntent.PROCHAINE_ELIGIBILITE, Arrays.asList(
                "prochaine eligibilite", "quand puis-je", "prochaine date",
                "date du prochain don", "eligible quand", "prochain don possible"
        ));

        // Actions - Badges
        keywords.put(ChatIntent.MES_BADGES, Arrays.asList(
                "badges", "mes badges", "recompenses", "mes recompenses", "points",
                "mes points", "niveau", "progression"
        ));

        // Navigation et aide
        keywords.put(ChatIntent.AIDE_GENERALE, Arrays.asList(
                "aide", "help", "comment", "qu'est-ce que", "c'est quoi",
                "expliquer", "information", "info"
        ));

        keywords.put(ChatIntent.NAVIGATION, Arrays.asList(
                "ou trouver", "ou est", "comment acceder", "aller a", "naviguer",
                "cherche", "trouver", "localiser"
        ));

        keywords.put(ChatIntent.CONTACT_SUPPORT, Arrays.asList(
                "contact", "support", "probleme", "aide humaine", "parler a quelqu'un",
                "assistance", "service client"
        ));

        return keywords;
    }

    public ChatIntent detectIntent(String message) {
        if (message == null || message.trim().isEmpty()) {
            return ChatIntent.INCONNU;
        }

        String normalizedMessage = normalizeText(message);

        // Calculate scores for each intent
        Map<ChatIntent, Integer> scores = new EnumMap<>(ChatIntent.class);

        for (Map.Entry<ChatIntent, List<String>> entry : intentKeywords.entrySet()) {
            int score = calculateScore(normalizedMessage, entry.getValue());
            if (score > 0) {
                scores.put(entry.getKey(), score);
            }
        }

        // Return intent with highest score, or INCONNU if no matches
        if (scores.isEmpty()) {
            return ChatIntent.INCONNU;
        }

        return scores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(ChatIntent.INCONNU);
    }

    private int calculateScore(String message, List<String> keywords) {
        int score = 0;
        for (String keyword : keywords) {
            String normalizedKeyword = normalizeText(keyword);
            if (message.contains(normalizedKeyword)) {
                // Longer keywords get higher scores
                score += normalizedKeyword.length();
            }
        }
        return score;
    }

    private String normalizeText(String text) {
        // Convert to lowercase
        String normalized = text.toLowerCase();

        // Remove accents
        normalized = Normalizer.normalize(normalized, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        normalized = pattern.matcher(normalized).replaceAll("");

        // Remove special characters except spaces
        normalized = normalized.replaceAll("[^a-z0-9\\s]", " ");

        // Normalize whitespace
        normalized = normalized.replaceAll("\\s+", " ").trim();

        return normalized;
    }

    public List<String> getSuggestionsForIntent(ChatIntent intent) {
        switch (intent) {
            case SALUTATION:
                return Arrays.asList(
                        "Suis-je éligible au don?",
                        "Voir le stock disponible",
                        "Mon historique de dons"
                );
            case ELIGIBILITE_DON:
            case PROCESSUS_DON:
                return Arrays.asList(
                        "Quand puis-je donner?",
                        "Effets secondaires",
                        "Faire un don"
                );
            case CONSULTER_STOCK:
                return Arrays.asList(
                        "Créer une demande",
                        "Groupes sanguins compatibles",
                        "Aide"
                );
            case HISTORIQUE_DONS:
            case MON_PROFIL:
                return Arrays.asList(
                        "Mes badges",
                        "Prochaine éligibilité",
                        "Stock disponible"
                );
            case REMERCIEMENT:
                return Arrays.asList(
                        "Autre question",
                        "Aide",
                        "Au revoir"
                );
            default:
                return Arrays.asList(
                        "Suis-je éligible?",
                        "Stock disponible",
                        "Mon profil",
                        "Aide"
                );
        }
    }
}
