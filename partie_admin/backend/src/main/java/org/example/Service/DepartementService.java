package org.example.Service;

import org.example.Entity.Departement;
import org.example.Repository.DepartementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartementService {

    @Autowired
    private DepartementRepository repo;

    public List<Departement> getAll() {
        return repo.findAll();
    }

    // ----- CREATE -----
    public Departement create(Departement d) {

        if (d.getNom() == null || d.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom du département est obligatoire.");
        }
        if (d.getAbbreviation() == null || d.getAbbreviation().trim().isEmpty()) {
            throw new RuntimeException("❌ L'abréviation du département est obligatoire.");
        }

        // Vérifier doublon nom
        if (repo.existsByNom(d.getNom().trim())) {
            throw new RuntimeException("❌ Département déjà existant : le nom est déjà utilisé !");
        }

        // Vérifier doublon abbreviation
        if (repo.existsByAbbreviation(d.getAbbreviation().trim())) {
            throw new RuntimeException("❌ Département déjà existant : l'abréviation est déjà utilisée !");
        }

        d.setNom(d.getNom().trim());
        d.setAbbreviation(d.getAbbreviation().trim());
        return repo.save(d);
    }

    // ----- UPDATE -----
    public Departement update(Long id, Departement d) {

        Departement dep = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Département introuvable."));

        if (d.getNom() == null || d.getNom().trim().isEmpty()) {
            throw new RuntimeException("❌ Le nom du département est obligatoire.");
        }
        if (d.getAbbreviation() == null || d.getAbbreviation().trim().isEmpty()) {
            throw new RuntimeException("❌ L'abréviation du département est obligatoire.");
        }

        String newNom = d.getNom().trim();
        String newAbbr = d.getAbbreviation().trim();

        // Si changement du nom -> vérifier doublon (exclure la ligne courante)
        if (!dep.getNom().equals(newNom) && repo.existsByNomAndIdNot(newNom, id)) {
            throw new RuntimeException("❌ Impossible de modifier : le nom est déjà utilisé par un autre département !");
        }

        // Si changement de l'abréviation -> vérifier doublon
        if (!dep.getAbbreviation().equals(newAbbr) && repo.existsByAbbreviationAndIdNot(newAbbr, id)) {
            throw new RuntimeException("❌ Impossible de modifier : l'abréviation est déjà utilisée par un autre département !");
        }

        dep.setNom(newNom);
        dep.setAbbreviation(newAbbr);

        return repo.save(dep);
    }

    // ----- DELETE -----
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("❌ Département introuvable.");
        }
        repo.deleteById(id);
    }
}
