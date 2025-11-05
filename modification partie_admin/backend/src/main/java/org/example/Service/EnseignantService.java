package org.example.Service;

import org.example.Entity.Enseignant;
import org.example.Entity.Matiere;
import org.example.Repository.EnseignantRepository;
import org.example.Repository.DepartementRepository;
import org.example.Repository.MatiereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnseignantService {

    @Autowired
    private EnseignantRepository enseignantRepo;

    @Autowired
    private DepartementRepository departementRepo;

    @Autowired
    private MatiereRepository matiereRepo;

    public List<Enseignant> getAllEnseignants() {
        return enseignantRepo.findAll();
    }

    public Enseignant addEnseignant(Enseignant e) {
        if (e.getDepartement() != null && !departementRepo.existsById(e.getDepartement().getId())) {
            throw new RuntimeException("Département non trouvé");
        }
        return enseignantRepo.save(e);
    }

    public Enseignant updateEnseignant(Long id, Enseignant e) {
        Enseignant enseignant = enseignantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
        enseignant.setNom(e.getNom());
        enseignant.setPrenom(e.getPrenom());
        enseignant.setEmail(e.getEmail());
        if (e.getDepartement() != null && !departementRepo.existsById(e.getDepartement().getId())) {
            throw new RuntimeException("Département non trouvé");
        }
        enseignant.setDepartement(e.getDepartement());
        return enseignantRepo.save(enseignant);
    }

    public void deleteEnseignant(Long id) {
        System.out.println("Début suppression enseignant ID: " + id); // ✅ Log début
        if (!enseignantRepo.existsById(id)) {
            throw new RuntimeException("Enseignant non trouvé");
        }
        // ✅ Corrigé : Supprimer d'abord les matieres associées pour éviter FK constraint
        System.out.println("Recherche matières pour enseignant ID: " + id); // ✅ Log recherche
        List<Matiere> matieres = matiereRepo.findByIdEnseignant(id);
        System.out.println("Nombre de matières trouvées: " + matieres.size()); // ✅ Log nombre
        if (!matieres.isEmpty()) {
            System.out.println("Suppression des matières..."); // ✅ Log suppression
            matiereRepo.deleteAll(matieres); // Supprime toutes les matières liées
            System.out.println("Matières supprimées."); // ✅ Log fin suppression
        } else {
            System.out.println("Aucune matière à supprimer pour cet enseignant."); // ✅ Log si vide
        }
        System.out.println("Suppression de l'enseignant..."); // ✅ Log enseignant
        enseignantRepo.deleteById(id);
        System.out.println("Enseignant supprimé avec succès."); // ✅ Log succès
    }
}