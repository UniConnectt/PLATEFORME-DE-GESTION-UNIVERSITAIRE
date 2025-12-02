package org.example.Service;

import org.example.Entity.*;
import org.example.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatiereService {

    @Autowired
    private MatiereRepository repo;

    @Autowired
    private EnseignantRepository enseignantRepo;

    @Autowired
    private NiveauRepository niveauRepo;

    @Autowired
    private DepartementRepository departementRepo;

    @Autowired
    private GroupeRepository groupeRepo;

    @Autowired
    private SpecialiteRepository specialiteRepo;

    @Autowired
    private SalleRepository salleRepo;

    public List<Matiere> getAll() {
        return repo.findAll();
    }

    public Matiere add(Matiere m) {
        if (m.getNom() == null || m.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom de la matière est obligatoire.");
        }

        // Validation Enseignant
        if (m.getEnseignant() != null && m.getEnseignant().getId() != null) {
            m.setEnseignant(enseignantRepo.findById(m.getEnseignant().getId()).orElse(null));
        }
        // Validation Niveau
        if (m.getNiveau() != null && m.getNiveau().getId() != null) {
            m.setNiveau(niveauRepo.findById(m.getNiveau().getId()).orElse(null));
        }
        // Validation Département
        if (m.getDepartement() != null && m.getDepartement().getId() != null) {
            m.setDepartement(departementRepo.findById(m.getDepartement().getId()).orElse(null));
        }
        // Validation Groupe
        if (m.getGroupe() != null && m.getGroupe().getId() != null) {
            m.setGroupe(groupeRepo.findById(m.getGroupe().getId()).orElse(null));
        }
        // Validation Specialite
        if (m.getSpecialite() != null && m.getSpecialite().getId() != null) {
            m.setSpecialite(specialiteRepo.findById(m.getSpecialite().getId()).orElse(null));
        }
        // Validation Salle
        if (m.getSalle() != null && m.getSalle().getId() != null) {
            m.setSalle(salleRepo.findById(m.getSalle().getId()).orElse(null));
        }

        // Vérifier doublon nom
        String trimmedNom = m.getNom().trim();
        if (repo.existsByNom(trimmedNom)) {
            throw new RuntimeException("❌ Matière déjà existante : le nom est déjà utilisé !");
        }

        m.setNom(trimmedNom);
        return repo.save(m);
    }

    public Matiere update(Long id, Matiere matiere) {
        Matiere m = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Matière introuvable."));

        if (matiere.getNom() == null || matiere.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom de la matière est obligatoire.");
        }

        String newNom = matiere.getNom().trim();

        // Si changement du nom -> vérifier doublon (exclure la ligne courante)
        if (!m.getNom().equals(newNom) && repo.existsByNomAndIdNot(newNom, id)) {
            throw new RuntimeException("❌ Impossible de modifier : le nom est déjà utilisé par une autre matière !");
        }

        m.setNom(newNom);

        if (matiere.getEnseignant() != null && matiere.getEnseignant().getId() != null)
            m.setEnseignant(enseignantRepo.findById(matiere.getEnseignant().getId()).orElse(null));
        if (matiere.getNiveau() != null && matiere.getNiveau().getId() != null)
            m.setNiveau(niveauRepo.findById(matiere.getNiveau().getId()).orElse(null));
        if (matiere.getDepartement() != null && matiere.getDepartement().getId() != null)
            m.setDepartement(departementRepo.findById(matiere.getDepartement().getId()).orElse(null));
        if (matiere.getGroupe() != null && matiere.getGroupe().getId() != null)
            m.setGroupe(groupeRepo.findById(matiere.getGroupe().getId()).orElse(null));
        if (matiere.getSpecialite() != null && matiere.getSpecialite().getId() != null)
            m.setSpecialite(specialiteRepo.findById(matiere.getSpecialite().getId()).orElse(null));
        if (matiere.getSalle() != null && matiere.getSalle().getId() != null)
            m.setSalle(salleRepo.findById(matiere.getSalle().getId()).orElse(null));

        return repo.save(m);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("❌ Matière introuvable.");
        }
        repo.deleteById(id);
    }
}