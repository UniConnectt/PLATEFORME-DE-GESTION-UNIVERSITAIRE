package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Niveau;
import org.example.Entity.Specialite;
import org.example.Repository.NiveauRepository;
import org.example.Repository.SpecialiteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NiveauService {

    private final NiveauRepository repository;
    private final SpecialiteRepository specialiteRepository;

    public List<Niveau> getAllNiveaux() {
        return repository.findAllWithAssociations(); // ✅ Utilise JOIN FETCH pour charger spécialité
    }

    // ----- CREATE -----
    public Niveau ajouterNiveau(Niveau niveau) {
        // Validations
        if (niveau.getNom() == null || niveau.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom du niveau est obligatoire.");
        }
        if (niveau.getAbreviation() == null || niveau.getAbreviation().trim().isEmpty()) {
            throw new RuntimeException("❌ L'abréviation du niveau est obligatoire.");
        }
        if (niveau.getSpecialite() == null || niveau.getSpecialite().getId() == null) {
            throw new RuntimeException("❌ La spécialité est obligatoire et doit avoir un ID valide.");
        }
        // Vérifier doublon nom par spécialité
        if (repository.existsByNomAndSpecialiteId(niveau.getNom().trim(), niveau.getSpecialite().getId())) {
            throw new RuntimeException("❌ Niveau déjà existant : ce nom existe déjà pour cette spécialité !");
        }
        // Trim et set
        niveau.setNom(niveau.getNom().trim());
        niveau.setAbreviation(niveau.getAbreviation().trim());
        // Associer la spécialité (déjà fait dans contrôleur, mais redondance OK)
        if (niveau.getSpecialite() != null && niveau.getSpecialite().getId() != null) {
            Specialite specialite = specialiteRepository.findById(niveau.getSpecialite().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Spécialité non trouvée."));
            niveau.setSpecialite(specialite);
        }
        return repository.save(niveau);
    }

    public Niveau getNiveauById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Niveau non trouvé avec l'id " + id));
    }

    // ----- UPDATE -----
    public Niveau modifierNiveau(Long id, Niveau niveauDetails) {
        Niveau niveau = getNiveauById(id);
        // Validations
        if (niveauDetails.getNom() == null || niveauDetails.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom du niveau est obligatoire.");
        }
        if (niveauDetails.getAbreviation() == null || niveauDetails.getAbreviation().trim().isEmpty()) {
            throw new RuntimeException("❌ L'abréviation du niveau est obligatoire.");
        }
        if (niveauDetails.getSpecialite() == null || niveauDetails.getSpecialite().getId() == null) {
            throw new RuntimeException("❌ La spécialité est obligatoire et doit avoir un ID valide.");
        }
        String newNom = niveauDetails.getNom().trim();
        Long newSpecialiteId = niveauDetails.getSpecialite().getId();
        // Vérifier doublon (exclure courant) si changement de nom ou spécialité
        if (!niveau.getNom().equals(newNom) || !niveau.getSpecialite().getId().equals(newSpecialiteId)) {
            if (repository.existsByNomAndSpecialiteIdAndIdNot(newNom, newSpecialiteId, id)) {
                throw new RuntimeException("❌ Impossible de modifier : ce nom existe déjà pour cette spécialité !");
            }
        }
        // Mise à jour
        niveau.setNom(newNom);
        niveau.setAbreviation(niveauDetails.getAbreviation().trim());
        // Associer la spécialité
        Specialite specialite = specialiteRepository.findById(newSpecialiteId)
                .orElseThrow(() -> new RuntimeException("❌ Spécialité non trouvée."));
        niveau.setSpecialite(specialite);
        return repository.save(niveau);
    }

    // ----- DELETE -----
    public void supprimerNiveau(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("❌ Niveau introuvable.");
        }
        repository.deleteById(id);
    }
}