package com.bks.enums;

public enum ChatIntent {
    // FAQ - Questions fréquentes
    ELIGIBILITE_DON,
    PROCESSUS_DON,
    GROUPES_SANGUINS,
    EFFETS_SECONDAIRES,
    AVANTAGES_DON,
    INTERVALLE_DONS,

    // Actions dans l'application
    CONSULTER_STOCK,
    CREER_DEMANDE,
    HISTORIQUE_DONS,
    MON_PROFIL,
    PROCHAINE_ELIGIBILITE,
    MES_BADGES,

    // Navigation et aide
    AIDE_GENERALE,
    NAVIGATION,
    CONTACT_SUPPORT,

    // Salutations
    SALUTATION,
    REMERCIEMENT,

    // Fallback
    INCONNU
}
