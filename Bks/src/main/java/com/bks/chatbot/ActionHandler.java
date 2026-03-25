package com.bks.chatbot;

import com.bks.dto.*;
import com.bks.enums.ChatIntent;
import com.bks.enums.GroupeSanguin;
import com.bks.model.Don;
import com.bks.model.Donneur;
import com.bks.repository.DonRepository;
import com.bks.repository.DonneurRepository;
import com.bks.repository.StockSangRepository;
import com.bks.service.DonneurService;
import com.bks.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class ActionHandler {

    @Autowired
    private StockService stockService;

    @Autowired
    private DonneurService donneurService;

    @Autowired
    private DonRepository donRepository;

    @Autowired
    private DonneurRepository donneurRepository;

    @Autowired
    private StockSangRepository stockSangRepository;

    @Autowired
    private IntentDetector intentDetector;

    private static final Set<ChatIntent> HANDLED_INTENTS = EnumSet.of(
            ChatIntent.CONSULTER_STOCK,
            ChatIntent.HISTORIQUE_DONS,
            ChatIntent.MON_PROFIL,
            ChatIntent.PROCHAINE_ELIGIBILITE,
            ChatIntent.MES_BADGES
    );

    public boolean canHandle(ChatIntent intent) {
        return HANDLED_INTENTS.contains(intent);
    }

    public ChatMessageResponse handleAction(ChatIntent intent, Long utilisateurId, String message) {
        switch (intent) {
            case CONSULTER_STOCK:
                return handleConsulterStock(message);
            case HISTORIQUE_DONS:
                return handleHistoriqueDons(utilisateurId);
            case MON_PROFIL:
                return handleMonProfil(utilisateurId);
            case PROCHAINE_ELIGIBILITE:
                return handleProchaineEligibilite(utilisateurId);
            case MES_BADGES:
                return handleMesBadges(utilisateurId);
            default:
                return ChatMessageResponse.text(
                        "Cette action n'est pas encore disponible.",
                        intentDetector.getSuggestionsForIntent(ChatIntent.INCONNU)
                );
        }
    }

    private ChatMessageResponse handleConsulterStock(String message) {
        // Try to detect a specific blood group in the message
        GroupeSanguin groupeDemande = detectGroupeSanguin(message);

        List<StockResponse> stocks = stockSangRepository.findAll().stream()
                .map(stock -> {
                    StockResponse response = new StockResponse();
                    response.setId(stock.getId());
                    response.setHopitalId(stock.getHopital().getId());
                    response.setHopitalNom(stock.getHopital().getNom());
                    response.setGroupeSanguin(stock.getGroupeSanguin());
                    response.setQuantiteDisponible(stock.getQuantiteDisponible());
                    response.setNombrePoches(stock.getNombrePoches());
                    response.setNiveauStock(stock.getNiveauStock());
                    return response;
                })
                .collect(Collectors.toList());

        if (groupeDemande != null) {
            stocks = stocks.stream()
                    .filter(s -> s.getGroupeSanguin() == groupeDemande)
                    .collect(Collectors.toList());
        }

        if (stocks.isEmpty()) {
            String reponse = groupeDemande != null
                    ? "Aucun stock de " + groupeDemande + " trouvé pour le moment."
                    : "Aucun stock disponible pour le moment.";
            return ChatMessageResponse.text(reponse,
                    Arrays.asList("Voir tous les stocks", "Créer une demande", "Aide"));
        }

        // Build response text
        StringBuilder sb = new StringBuilder();
        if (groupeDemande != null) {
            sb.append("Voici les stocks de ").append(groupeDemande).append(" disponibles:\n\n");
        } else {
            sb.append("Voici l'état actuel des stocks de sang:\n\n");
        }

        // Group by hospital
        Map<String, List<StockResponse>> stocksByHospital = stocks.stream()
                .collect(Collectors.groupingBy(StockResponse::getHopitalNom));

        for (Map.Entry<String, List<StockResponse>> entry : stocksByHospital.entrySet()) {
            sb.append("**").append(entry.getKey()).append(":**\n");
            for (StockResponse stock : entry.getValue()) {
                String niveau = getNiveauEmoji(stock.getNiveauStock().name());
                sb.append("- ").append(stock.getGroupeSanguin())
                        .append(": ").append(stock.getQuantiteDisponible()).append(" ml ")
                        .append(niveau).append("\n");
            }
            sb.append("\n");
        }

        List<String> suggestions = Arrays.asList(
                "Créer une demande",
                "Groupes sanguins compatibles",
                "Aide"
        );

        return ChatMessageResponse.liste(sb.toString(), stocks, suggestions);
    }

    private ChatMessageResponse handleHistoriqueDons(Long utilisateurId) {
        Optional<Donneur> donneurOpt = donneurRepository.findByUtilisateurId(utilisateurId);

        if (donneurOpt.isEmpty()) {
            return ChatMessageResponse.text(
                    "Vous n'êtes pas encore inscrit comme donneur. " +
                    "Inscrivez-vous pour commencer à donner du sang et suivre votre historique!",
                    Arrays.asList("Comment m'inscrire?", "Éligibilité", "Aide")
            );
        }

        Donneur donneur = donneurOpt.get();
        List<Don> dons = donRepository.findByDonneurId(donneur.getId());

        if (dons.isEmpty()) {
            return ChatMessageResponse.text(
                    "Vous n'avez pas encore effectué de don. " +
                    "Votre premier don peut sauver jusqu'à 3 vies!",
                    Arrays.asList("Où donner?", "Processus de don", "Éligibilité")
            );
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Voici votre historique de dons:\n\n");
        sb.append("**Total de dons:** ").append(dons.size()).append("\n\n");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        // Show last 5 donations
        List<Don> recentDons = dons.stream()
                .sorted((d1, d2) -> d2.getDateDon().compareTo(d1.getDateDon()))
                .limit(5)
                .collect(Collectors.toList());

        sb.append("**Derniers dons:**\n");
        for (Don don : recentDons) {
            sb.append("- ").append(don.getDateDon().format(formatter))
                    .append(" à ").append(don.getHopital().getNom())
                    .append(" (").append(don.getQuantiteMl()).append(" ml)")
                    .append(" - ").append(don.getStatut().name())
                    .append("\n");
        }

        List<String> suggestions = Arrays.asList(
                "Prochaine éligibilité",
                "Mes badges",
                "Stock disponible"
        );

        return ChatMessageResponse.liste(sb.toString(), recentDons, suggestions);
    }

    private ChatMessageResponse handleMonProfil(Long utilisateurId) {
        try {
            DonneurResponse donneur = donneurService.getDonneurByUtilisateurId(utilisateurId);

            StringBuilder sb = new StringBuilder();
            sb.append("Voici votre profil donneur:\n\n");
            sb.append("**Nom:** ").append(donneur.getNom()).append(" ").append(donneur.getPrenom()).append("\n");
            sb.append("**Groupe sanguin:** ").append(donneur.getGroupeSanguin()).append("\n");
            sb.append("**Éligible:** ").append(donneur.getEligible() ? "Oui" : "Non").append("\n");
            sb.append("**Nombre de dons:** ").append(donneur.getNombreDonsTotal()).append("\n");
            sb.append("**Points:** ").append(donneur.getPointsTotal()).append("\n");

            if (donneur.getDateDernierDon() != null) {
                sb.append("**Dernier don:** ")
                        .append(donneur.getDateDernierDon().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                        .append("\n");
            }

            if (donneur.getDateProchaineEligibilite() != null) {
                sb.append("**Prochaine éligibilité:** ")
                        .append(donneur.getDateProchaineEligibilite().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                        .append("\n");
            }

            sb.append("\n**Badges obtenus:** ").append(donneur.getBadges().size());

            List<String> suggestions = Arrays.asList(
                    "Mes badges",
                    "Historique de dons",
                    "Prochaine éligibilité"
            );

            return ChatMessageResponse.action(sb.toString(), donneur, suggestions);

        } catch (RuntimeException e) {
            return ChatMessageResponse.text(
                    "Vous n'êtes pas encore inscrit comme donneur. " +
                    "Complétez votre profil pour accéder à toutes les fonctionnalités!",
                    Arrays.asList("Comment m'inscrire?", "Éligibilité", "Aide")
            );
        }
    }

    private ChatMessageResponse handleProchaineEligibilite(Long utilisateurId) {
        try {
            DonneurResponse donneur = donneurService.getDonneurByUtilisateurId(utilisateurId);

            StringBuilder sb = new StringBuilder();

            if (donneur.getEligible()) {
                sb.append("Bonne nouvelle! Vous êtes actuellement **éligible** au don de sang.\n\n");
                sb.append("Vous pouvez vous rendre dans un centre de don ou une campagne proche de chez vous.");
            } else {
                if (donneur.getDateProchaineEligibilite() != null) {
                    LocalDate prochaine = donneur.getDateProchaineEligibilite();
                    long joursRestants = ChronoUnit.DAYS.between(LocalDate.now(), prochaine);

                    sb.append("Vous serez éligible au don dans **").append(joursRestants).append(" jours**.\n\n");
                    sb.append("**Date de prochaine éligibilité:** ")
                            .append(prochaine.format(DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.FRENCH)))
                            .append("\n\n");
                    sb.append("En attendant, vous pouvez encourager vos proches à donner!");
                } else {
                    sb.append("Nous n'avons pas assez d'informations pour calculer votre prochaine éligibilité.\n");
                    sb.append("Consultez votre profil ou contactez un centre de don.");
                }
            }

            List<String> suggestions = Arrays.asList(
                    "Mon profil",
                    "Conditions d'éligibilité",
                    "Centres de don"
            );

            return ChatMessageResponse.text(sb.toString(), suggestions);

        } catch (RuntimeException e) {
            return ChatMessageResponse.text(
                    "Vous devez d'abord vous inscrire comme donneur pour voir votre éligibilité.",
                    Arrays.asList("Comment m'inscrire?", "Conditions d'éligibilité", "Aide")
            );
        }
    }

    private ChatMessageResponse handleMesBadges(Long utilisateurId) {
        try {
            DonneurResponse donneur = donneurService.getDonneurByUtilisateurId(utilisateurId);

            StringBuilder sb = new StringBuilder();
            sb.append("**Vos récompenses:**\n\n");
            sb.append("**Points totaux:** ").append(donneur.getPointsTotal()).append(" pts\n\n");

            List<BadgeResponse> badges = donneur.getBadges();

            if (badges.isEmpty()) {
                sb.append("Vous n'avez pas encore de badges.\n");
                sb.append("Faites votre premier don pour obtenir votre premier badge!");
            } else {
                sb.append("**Badges obtenus (").append(badges.size()).append("):**\n");
                for (BadgeResponse badge : badges) {
                    sb.append("- ").append(getBadgeEmoji(badge.getNiveau().name()))
                            .append(" **").append(badge.getNom()).append("**")
                            .append(" - ").append(badge.getDescription()).append("\n");
                }
            }

            List<String> suggestions = Arrays.asList(
                    "Mon profil",
                    "Historique de dons",
                    "Comment gagner des points?"
            );

            return ChatMessageResponse.action(sb.toString(), badges, suggestions);

        } catch (RuntimeException e) {
            return ChatMessageResponse.text(
                    "Vous devez d'abord vous inscrire comme donneur pour voir vos badges.",
                    Arrays.asList("Comment m'inscrire?", "Aide")
            );
        }
    }

    private GroupeSanguin detectGroupeSanguin(String message) {
        String upper = message.toUpperCase();

        // Check common formats (order matters: check AB before A and B)
        if (upper.contains("AB+") || upper.contains("AB POSITIF") || upper.contains("AB_POSITIF")) {
            return GroupeSanguin.AB_POSITIF;
        }
        if (upper.contains("AB-") || upper.contains("AB NEGATIF") || upper.contains("AB_NEGATIF")) {
            return GroupeSanguin.AB_NEGATIF;
        }
        if (upper.contains("O+") || upper.contains("O POSITIF") || upper.contains("O_POSITIF")) {
            return GroupeSanguin.O_POSITIF;
        }
        if (upper.contains("O-") || upper.contains("O NEGATIF") || upper.contains("O_NEGATIF")) {
            return GroupeSanguin.O_NEGATIF;
        }
        if (upper.contains("A+") || upper.contains("A POSITIF") || upper.contains("A_POSITIF")) {
            return GroupeSanguin.A_POSITIF;
        }
        if (upper.contains("A-") || upper.contains("A NEGATIF") || upper.contains("A_NEGATIF")) {
            return GroupeSanguin.A_NEGATIF;
        }
        if (upper.contains("B+") || upper.contains("B POSITIF") || upper.contains("B_POSITIF")) {
            return GroupeSanguin.B_POSITIF;
        }
        if (upper.contains("B-") || upper.contains("B NEGATIF") || upper.contains("B_NEGATIF")) {
            return GroupeSanguin.B_NEGATIF;
        }

        return null;
    }

    private String getNiveauEmoji(String niveau) {
        switch (niveau) {
            case "CRITIQUE": return "(Critique)";
            case "ALERTE": return "(Alerte)";
            case "NORMAL": return "(Normal)";
            case "OPTIMAL": return "(Optimal)";
            default: return "";
        }
    }

    private String getBadgeEmoji(String niveau) {
        switch (niveau) {
            case "BRONZE": return "[Bronze]";
            case "ARGENT": return "[Argent]";
            case "OR": return "[Or]";
            case "PLATINE": return "[Platine]";
            case "DIAMANT": return "[Diamant]";
            default: return "[Badge]";
        }
    }
}
