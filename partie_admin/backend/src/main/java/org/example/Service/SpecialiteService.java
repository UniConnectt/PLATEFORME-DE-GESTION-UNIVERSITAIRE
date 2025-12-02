package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Departement;
import org.example.Entity.Specialite;
import org.example.Repository.DepartementRepository;
import org.example.Repository.SpecialiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpecialiteService {

    private final SpecialiteRepository repo;
    private final DepartementRepository departementRepository;

    public List<Specialite> getAll() {
        return repo.findAll();
    }

    public Specialite create(Specialite s) {
        validateMandatoryFields(s);

        if (repo.existsByNom(s.getNom().trim())) {
            throw new RuntimeException("Spécialité déjà existante : le nom est déjà utilisé !");
        }
        if (repo.existsByAbbreviation(s.getAbbreviation().trim())) {
            throw new RuntimeException("Spécialité déjà existante : l'abréviation est déjà utilisée !");
        }

        s.setNom(s.getNom().trim());
        s.setAbbreviation(s.getAbbreviation().trim());

        if (s.getDepartement() != null && s.getDepartement().getId() != null) {
            Departement dep = departementRepository.findById(s.getDepartement().getId())
                    .orElseThrow(() -> new RuntimeException("Département non trouvé"));
            s.setDepartement(dep);
        }

        return repo.save(s);
    }

    public Specialite update(Long id, Specialite s) {
        Specialite spec = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Spécialité introuvable."));

        validateMandatoryFields(s);

        String newNom = s.getNom().trim();
        String newAbbr = s.getAbbreviation().trim();

        if (!spec.getNom().equals(newNom) && repo.existsByNomAndIdNot(newNom, id)) {
            throw new RuntimeException("Impossible de modifier : le nom est déjà utilisé !");
        }
        if (!spec.getAbbreviation().equals(newAbbr) && repo.existsByAbbreviationAndIdNot(newAbbr, id)) {
            throw new RuntimeException("Impossible de modifier : l'abréviation est déjà utilisée !");
        }

        spec.setNom(newNom);
        spec.setAbbreviation(newAbbr);

        if (s.getDepartement() != null && s.getDepartement().getId() != null) {
            Departement dep = departementRepository.findById(s.getDepartement().getId())
                    .orElseThrow(() -> new RuntimeException("Département non trouvé"));
            spec.setDepartement(dep);
        }

        return repo.save(spec);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Spécialité introuvable.");
        }
        repo.deleteById(id);
    }

    private void validateMandatoryFields(Specialite s) {
        if (s.getNom() == null || s.getNom().trim().isEmpty()) {
            throw new RuntimeException("Le nom de la spécialité est obligatoire.");
        }
        if (s.getAbbreviation() == null || s.getAbbreviation().trim().isEmpty()) {
            throw new RuntimeException("L'abréviation de la spécialité est obligatoire.");
        }
    }
}
