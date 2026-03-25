package com.bks.service;

import com.bks.dto.*;
import com.bks.enums.NiveauBadge;
import com.bks.model.*;
import com.bks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonneurService {

    @Autowired
    private DonneurRepository donneurRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private DonneurBadgeRepository donneurBadgeRepository;

    @Transactional
    public DonneurResponse updateProfil(Long utilisateurId, Donneur donneurUpdate) {
        Donneur donneur = donneurRepository.findByUtilisateurId(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Donneur non trouvé"));

        // Update allowed fields
        if (donneurUpdate.getGroupeSanguin() != null) {
            donneur.setGroupeSanguin(donneurUpdate.getGroupeSanguin());
        }
        if (donneurUpdate.getDateNaissance() != null) {
            donneur.setDateNaissance(donneurUpdate.getDateNaissance());
        }
        if (donneurUpdate.getAdresse() != null) {
            donneur.setAdresse(donneurUpdate.getAdresse());
        }
        if (donneurUpdate.getVille() != null) {
            donneur.setVille(donneurUpdate.getVille());
        }
        if (donneurUpdate.getSexe() != null) {
            donneur.setSexe(donneurUpdate.getSexe());
        }

        // Recalculate eligibility if relevant fields changed
        donneur.setEligible(verifierEligibilite(donneur));
        donneur = donneurRepository.save(donneur);

        return mapToResponse(donneur);
    }

    @Transactional
    public DonneurResponse updateProfilComplet(Long utilisateurId, String nom, String prenom, String telephone, DonneurUpdateRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Update utilisateur fields
        if (nom != null) utilisateur.setNom(nom);
        if (prenom != null) utilisateur.setPrenom(prenom);
        if (telephone != null) utilisateur.setTelephone(telephone);
        utilisateurRepository.save(utilisateur);

        // Update donneur fields
        Donneur donneur = donneurRepository.findByUtilisateurId(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Donneur non trouvé"));

        if (request.getGroupeSanguin() != null) {
            donneur.setGroupeSanguin(request.getGroupeSanguin());
        }
        if (request.getDateNaissance() != null) {
            donneur.setDateNaissance(request.getDateNaissance());
        }
        if (request.getAdresse() != null) {
            donneur.setAdresse(request.getAdresse());
        }
        if (request.getVille() != null) {
            donneur.setVille(request.getVille());
        }
        if (request.getSexe() != null) {
            donneur.setSexe(request.getSexe());
        }

        // Recalculate eligibility if relevant fields changed
        donneur.setEligible(verifierEligibilite(donneur));
        donneur = donneurRepository.save(donneur);

        return mapToResponse(donneur);
    }

    @Transactional
    public DonneurResponse inscrireDonneur(Long utilisateurId, Donneur donneur) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (donneurRepository.existsByCin(donneur.getCin())) {
            throw new RuntimeException("Ce CIN est déjà enregistré");
        }

        donneur.setUtilisateur(utilisateur);
        donneur.setEligible(verifierEligibilite(donneur));
        donneur = donneurRepository.save(donneur);

        return mapToResponse(donneur);
    }

    public DonneurResponse getDonneurByUtilisateurId(Long utilisateurId) {
        Donneur donneur = donneurRepository.findByUtilisateurId(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Donneur non trouvé"));
        return mapToResponse(donneur);
    }

    public List<DonneurResponse> getTopDonneurs(int limit) {
        return donneurRepository.findTopDonneurs().stream()
                .limit(limit)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DonneurResponse> getDonneursEligibles() {
        return donneurRepository.findByEligibleTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private boolean verifierEligibilite(Donneur donneur) {
        int age = Period.between(donneur.getDateNaissance(), LocalDate.now()).getYears();
        if (age < 18 || age > 65) return false;
        if (donneur.getPoids() < 50) return false;
        if (donneur.getDateDernierDon() != null) {
            LocalDate prochaineDate = donneur.getDateDernierDon().plusDays(90);
            if (LocalDate.now().isBefore(prochaineDate)) return false;
        }
        return true;
    }

    private DonneurResponse mapToResponse(Donneur donneur) {
        DonneurResponse response = new DonneurResponse();
        response.setId(donneur.getId());
        response.setUtilisateurId(donneur.getUtilisateur().getId());
        response.setNom(donneur.getUtilisateur().getNom());
        response.setPrenom(donneur.getUtilisateur().getPrenom());
        response.setEmail(donneur.getUtilisateur().getEmail());
        response.setCin(donneur.getCin());
        response.setDateNaissance(donneur.getDateNaissance());
        response.setGroupeSanguin(donneur.getGroupeSanguin());
        response.setSexe(donneur.getSexe());
        response.setAdresse(donneur.getAdresse());
        response.setVille(donneur.getVille());
        response.setTelephone(donneur.getUtilisateur().getTelephone());
        response.setEligible(donneur.getEligible());
        response.setDateDernierDon(donneur.getDateDernierDon());
        response.setNombreDonsTotal(donneur.getNombreDonsTotal());
        response.setDateProchaineEligibilite(donneur.getDateProchaineEligibilite());
        response.setPointsTotal(donneur.getUtilisateur().getPointsTotal());
        response.setBadges(donneurBadgeRepository.findBadgesAffichesByDonneur(donneur.getId()).stream().map(db -> {
            BadgeResponse br = new BadgeResponse();
            br.setId(db.getBadge().getId());
            br.setNom(db.getBadge().getNom());
            br.setDescription(db.getBadge().getDescription());
            br.setNiveau(db.getBadge().getNiveau());
            br.setIconeUrl(db.getBadge().getIconeUrl());
            br.setNombreDonsRequis(db.getBadge().getNombreDonsRequis());
            br.setPointsAttribues(db.getBadge().getPointsAttribues());
            br.setDateObtention(db.getDateObtention());
            br.setObtenu(true);
            return br;
        }).collect(Collectors.toList()));
        return response;
    }

    public DonResponse mapDonToResponse(Don don) {
        DonResponse response = new DonResponse();
        response.setId(don.getId());
        response.setDonneurId(don.getDonneur().getId());
        response.setDonneurNom(don.getDonneur().getUtilisateur().getNom());
        response.setDonneurPrenom(don.getDonneur().getUtilisateur().getPrenom());
        response.setGroupeSanguin(don.getDonneur().getGroupeSanguin());
        response.setHopitalId(don.getHopital().getId());
        response.setHopitalNom(don.getHopital().getNom());
        if (don.getCampagne() != null) {
            response.setCampagneId(don.getCampagne().getId());
            response.setCampagneTitre(don.getCampagne().getTitre());
        }
        response.setDateDon(don.getDateDon());
        response.setQuantiteMl(don.getQuantiteMl());
        response.setStatut(don.getStatut());
        response.setNumeroPoche(don.getNumeroPoche());
        response.setDatePeremption(don.getDatePeremption());
        response.setNotes(don.getNotes());
        response.setTestsEffectues(don.getTestsEffectues());
        response.setPointsAttribues(don.getPointsAttribues());
        return response;
    }
}
