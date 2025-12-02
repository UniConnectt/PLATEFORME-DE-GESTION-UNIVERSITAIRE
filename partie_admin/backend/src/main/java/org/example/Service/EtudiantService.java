package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Etudiant;
import org.example.Entity.Groupe;
import org.example.Entity.Specialite;
import org.example.Repository.EtudiantRepository;
import org.example.Repository.GroupeRepository;
import org.example.Repository.SpecialiteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EtudiantService {
    private final EtudiantRepository repo;
    private final GroupeRepository groupeRepository;
    private final SpecialiteRepository specialiteRepository;

    public List<Etudiant> getAll() {
        return repo.findAllWithAssociations();  // ← Changement : Utilise JOIN FETCH pour charger groupe/specialite
    }

    // ----- CREATE -----
    public Etudiant create(Etudiant e) {
        if (e.getNom() == null || e.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom de l'étudiant est obligatoire.");
        }
        if (e.getPrenom() == null || e.getPrenom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le prénom de l'étudiant est obligatoire.");
        }
        if (e.getEmail() == null || e.getEmail().trim().isEmpty()) {
            throw new RuntimeException("❌ L'email de l'étudiant est obligatoire.");
        }
        // Vérifier doublon email
        if (repo.existsByEmail(e.getEmail().trim())) {
            throw new RuntimeException("❌ Étudiant déjà existant : l'email est déjà utilisé !");
        }
        e.setNom(e.getNom().trim());
        e.setPrenom(e.getPrenom().trim());
        e.setEmail(e.getEmail().trim());
        // Associer le groupe
        if (e.getGroupe() != null && e.getGroupe().getId() != null) {
            Groupe groupe = groupeRepository.findById(e.getGroupe().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Groupe non trouvé."));
            e.setGroupe(groupe);
        }
        // Associer la spécialité
        if (e.getSpecialite() != null && e.getSpecialite().getId() != null) {
            Specialite specialite = specialiteRepository.findById(e.getSpecialite().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Spécialité non trouvée."));
            e.setSpecialite(specialite);
        }
        return repo.save(e);
    }

    // ----- UPDATE -----
    public Etudiant update(Long id, Etudiant e) {
        Etudiant etudiant = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Étudiant introuvable."));
        if (e.getNom() == null || e.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom de l'étudiant est obligatoire.");
        }
        if (e.getPrenom() == null || e.getPrenom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le prénom de l'étudiant est obligatoire.");
        }
        if (e.getEmail() == null || e.getEmail().trim().isEmpty()) {
            throw new RuntimeException("❌ L'email de l'étudiant est obligatoire.");
        }
        String newEmail = e.getEmail().trim();
        // Si changement de l'email -> vérifier doublon (exclure la ligne courante)
        if (!etudiant.getEmail().equals(newEmail) && repo.existsByEmailAndIdNot(newEmail, id)) {
            throw new RuntimeException("❌ Impossible de modifier : l'email est déjà utilisé par un autre étudiant !");
        }
        etudiant.setNom(e.getNom().trim());
        etudiant.setPrenom(e.getPrenom().trim());
        etudiant.setEmail(newEmail);
        // Associer le groupe
        if (e.getGroupe() != null && e.getGroupe().getId() != null) {
            Groupe groupe = groupeRepository.findById(e.getGroupe().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Groupe non trouvé."));
            etudiant.setGroupe(groupe);
        }
        // Associer la spécialité
        if (e.getSpecialite() != null && e.getSpecialite().getId() != null) {
            Specialite specialite = specialiteRepository.findById(e.getSpecialite().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Spécialité non trouvée."));
            etudiant.setSpecialite(specialite);
        }
        return repo.save(etudiant);
    }

    // ----- DELETE -----
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("❌ Étudiant introuvable.");
        }
        repo.deleteById(id);
    }
}