package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Departement;
import org.example.Entity.Enseignant;
import org.example.Entity.Matiere;
import org.example.Repository.DepartementRepository;
import org.example.Repository.EnseignantRepository;
import org.example.Repository.MatiereRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnseignantService {

    private final EnseignantRepository repo;
    private final DepartementRepository departementRepository;
    private final MatiereRepository matiereRepository;

    public List<Enseignant> getAll() {
        return repo.findAll();
    }

    // ----- CREATE -----
    public Enseignant create(Enseignant e) {

        if (e.getNom() == null || e.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom de l'enseignant est obligatoire.");
        }
        if (e.getPrenom() == null || e.getPrenom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le prénom de l'enseignant est obligatoire.");
        }
        if (e.getEmail() == null || e.getEmail().trim().isEmpty()) {
            throw new RuntimeException("❌ L'email de l'enseignant est obligatoire.");
        }

        // Vérifier doublon email
        if (repo.existsByEmail(e.getEmail().trim())) {
            throw new RuntimeException("❌ Enseignant déjà existant : l'email est déjà utilisé !");
        }

        e.setNom(e.getNom().trim());
        e.setPrenom(e.getPrenom().trim());
        e.setEmail(e.getEmail().trim());

        // Associer le département
        if (e.getDepartement() != null && e.getDepartement().getId() != null) {
            Departement dep = departementRepository.findById(e.getDepartement().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Département non trouvé."));
            e.setDepartement(dep);
        }

        return repo.save(e);
    }

    // ----- UPDATE -----
    public Enseignant update(Long id, Enseignant e) {

        Enseignant enseignant = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Enseignant introuvable."));

        if (e.getNom() == null || e.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom de l'enseignant est obligatoire.");
        }
        if (e.getPrenom() == null || e.getPrenom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le prénom de l'enseignant est obligatoire.");
        }
        if (e.getEmail() == null || e.getEmail().trim().isEmpty()) {
            throw new RuntimeException("❌ L'email de l'enseignant est obligatoire.");
        }

        String newEmail = e.getEmail().trim();

        // Si changement de l'email -> vérifier doublon (exclure la ligne courante)
        if (!enseignant.getEmail().equals(newEmail) && repo.existsByEmailAndIdNot(newEmail, id)) {
            throw new RuntimeException("❌ Impossible de modifier : l'email est déjà utilisé par un autre enseignant !");
        }

        enseignant.setNom(e.getNom().trim());
        enseignant.setPrenom(e.getPrenom().trim());
        enseignant.setEmail(newEmail);

        // Associer le département
        if (e.getDepartement() != null && e.getDepartement().getId() != null) {
            Departement dep = departementRepository.findById(e.getDepartement().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Département non trouvé."));
            enseignant.setDepartement(dep);
        }

        return repo.save(enseignant);
    }

    // ----- DELETE -----
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("❌ Enseignant introuvable.");
        }
        // Supprimer d'abord les matieres associées pour éviter FK constraint
        List<Matiere> matieres = matiereRepository.findByIdEnseignant(id);
        if (!matieres.isEmpty()) {
            matiereRepository.deleteAll(matieres);
        }
        repo.deleteById(id);
    }
}