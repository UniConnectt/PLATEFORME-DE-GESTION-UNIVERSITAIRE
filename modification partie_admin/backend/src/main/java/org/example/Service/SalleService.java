package org.example.Service;

import org.example.Entity.Salle;
import org.example.Repository.SalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SalleService {

    @Autowired
    private SalleRepository repo;

    public List<Salle> getAll() {
        return repo.findAll();
    }

    public Salle save(Salle salle) {
        return repo.save(salle);
    }

    public Salle update(Long id, Salle salle) {
        Optional<Salle> existing = repo.findById(id);
        if (existing.isEmpty()) return null;

        Salle s = existing.get();
        s.setCode(salle.getCode());
        s.setType(salle.getType());
        s.setCapacite(salle.getCapacite());
        return repo.save(s);
    }

    public boolean delete(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
