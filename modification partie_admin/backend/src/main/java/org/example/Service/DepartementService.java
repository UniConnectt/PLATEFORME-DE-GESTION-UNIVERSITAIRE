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

    public Departement create(Departement d) {
        return repo.save(d);
    }

    public Departement update(Long id, Departement d) {
        Departement dep = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Département non trouvé"));
        dep.setNom(d.getNom());
        dep.setAbbreviation(d.getAbbreviation());
        return repo.save(dep);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
