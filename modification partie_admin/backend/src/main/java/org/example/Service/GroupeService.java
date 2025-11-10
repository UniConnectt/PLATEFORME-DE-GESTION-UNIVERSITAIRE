package org.example.Service;

import org.example.Entity.Groupe;
import org.example.Entity.Niveau;
import org.example.Repository.GroupeRepository;
import org.example.Repository.NiveauRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupeService {

    @Autowired
    private GroupeRepository groupeRepository;

    @Autowired
    private NiveauRepository niveauRepository;

    // 🔹 Récupérer tous les groupes
    public List<Groupe> getAllGroupes() {
        return groupeRepository.findAll();
    }

    // 🔹 Ajouter un groupe
    public Groupe addGroupe(Groupe g) {
        // Vérifie simplement si un niveau existe
        if (g.getNiveau() != null && g.getNiveau().getId() != null) {
            Niveau niveau = niveauRepository.findById(g.getNiveau().getId()).orElse(null);
            g.setNiveau(niveau);
        }
        // Enregistre directement
        return groupeRepository.save(g);
    }

    // 🔹 Modifier un groupe
    public Groupe updateGroupe(Long id, Groupe g) {
        Groupe existing = groupeRepository.findById(id).orElse(null);
        if (existing == null) return null;

        existing.setNom(g.getNom());

        if (g.getNiveau() != null && g.getNiveau().getId() != null) {
            Niveau niveau = niveauRepository.findById(g.getNiveau().getId()).orElse(null);
            existing.setNiveau(niveau);
        }

        return groupeRepository.save(existing);
    }

    // 🔹 Supprimer un groupe
    public boolean deleteGroupe(Long id) {
        if (!groupeRepository.existsById(id)) return false;
        groupeRepository.deleteById(id);
        return true;
    }
}
