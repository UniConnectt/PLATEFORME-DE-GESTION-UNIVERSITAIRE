package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Groupe;
import org.example.Entity.Niveau;
import org.example.Entity.Specialite;
import org.example.Repository.GroupeRepository;
import org.example.Repository.NiveauRepository;
import org.example.Repository.SpecialiteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupeService {

    private final GroupeRepository groupeRepository;
    private final NiveauRepository niveauRepository;
    private final SpecialiteRepository specialiteRepository;

    // 🔹 Récupérer tous les groupes
    public List<Groupe> getAllGroupes() {
        return groupeRepository.findAllWithAssociations(); // ✅ Utilise JOIN FETCH pour charger associations
    }

    // 🔹 Ajouter un groupe
    public Groupe addGroupe(Groupe g) {
        // Validations
        if (g.getNom() == null || g.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom du groupe est obligatoire.");
        }
        if (g.getNumero() == null) {
            throw new RuntimeException("❌ Le numéro du groupe est obligatoire.");
        }
        if (g.getNiveau() == null || g.getNiveau().getId() == null) {
            throw new RuntimeException("❌ Le niveau est obligatoire et doit avoir un ID valide.");
        }
        if (g.getSpecialite() == null || g.getSpecialite().getId() == null) {
            throw new RuntimeException("❌ La spécialité est obligatoire et doit avoir un ID valide.");
        }
        // Vérifier doublon nom + numero par niveau
        if (groupeRepository.existsByNomAndNumeroAndNiveauId(g.getNom().trim(), g.getNumero(), g.getNiveau().getId())) {
            throw new RuntimeException("❌ Groupe déjà existant : ce nom et numéro existent déjà pour ce niveau !");
        }
        // Trim et set
        g.setNom(g.getNom().trim());
        // Associer le niveau (déjà fait dans contrôleur, mais redondance OK)
        if (g.getNiveau() != null && g.getNiveau().getId() != null) {
            Niveau niveau = niveauRepository.findById(g.getNiveau().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Niveau non trouvé."));
            g.setNiveau(niveau);
        }
        // Associer la spécialité
        if (g.getSpecialite() != null && g.getSpecialite().getId() != null) {
            Specialite specialite = specialiteRepository.findById(g.getSpecialite().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Spécialité non trouvée."));
            g.setSpecialite(specialite);
        }
        return groupeRepository.save(g);
    }

    // 🔹 Modifier un groupe
    public Groupe updateGroupe(Long id, Groupe g) {
        Groupe existing = groupeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Groupe introuvable."));
        // Validations
        if (g.getNom() == null || g.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom du groupe est obligatoire.");
        }
        if (g.getNumero() == null) {
            throw new RuntimeException("❌ Le numéro du groupe est obligatoire.");
        }
        if (g.getNiveau() == null || g.getNiveau().getId() == null) {
            throw new RuntimeException("❌ Le niveau est obligatoire et doit avoir un ID valide.");
        }
        if (g.getSpecialite() == null || g.getSpecialite().getId() == null) {
            throw new RuntimeException("❌ La spécialité est obligatoire et doit avoir un ID valide.");
        }
        String newNom = g.getNom().trim();
        Integer newNumero = g.getNumero();
        Long newNiveauId = g.getNiveau().getId();
        // Vérifier doublon (exclure courant) si changement de nom, numero ou niveau
        if (!existing.getNom().equals(newNom) || !existing.getNumero().equals(newNumero) || !existing.getNiveau().getId().equals(newNiveauId)) {
            if (groupeRepository.existsByNomAndNumeroAndNiveauIdAndIdNot(newNom, newNumero, newNiveauId, id)) {
                throw new RuntimeException("❌ Impossible de modifier : ce nom et numéro existent déjà pour ce niveau !");
            }
        }
        // Mise à jour
        existing.setNom(newNom);
        existing.setNumero(newNumero);
        // Associer le niveau
        Niveau niveau = niveauRepository.findById(newNiveauId)
                .orElseThrow(() -> new RuntimeException("❌ Niveau non trouvé."));
        existing.setNiveau(niveau);
        // Associer la spécialité
        Specialite specialite = specialiteRepository.findById(g.getSpecialite().getId())
                .orElseThrow(() -> new RuntimeException("❌ Spécialité non trouvée."));
        existing.setSpecialite(specialite);
        return groupeRepository.save(existing);
    }

    // 🔹 Supprimer un groupe
    public boolean deleteGroupe(Long id) {
        if (!groupeRepository.existsById(id)) {
            throw new RuntimeException("❌ Groupe introuvable.");
        }
        groupeRepository.deleteById(id);
        return true;
    }

    // 🔹 Compter groupes
    public long countGroupes() {
        return groupeRepository.count();
    }
}