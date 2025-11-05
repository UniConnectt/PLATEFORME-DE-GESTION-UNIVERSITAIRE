package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Specialite;
import org.example.Repository.SpecialiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpecialiteService {

    private final SpecialiteRepository repository;

    public List<Specialite> getAll() {
        List<Specialite> specialites = repository.findAll();
        System.out.println("Nombre de spécialités en base: " + specialites.size()); // Log pour debug
        return specialites;
    }

    public Specialite create(Specialite s) {
        return repository.save(s);
    }

    public Specialite update(Long id, Specialite s) {
        Specialite existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialite not found"));
        existing.setNom(s.getNom());
        existing.setDepartement(s.getDepartement());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if(!repository.existsById(id)) {
            throw new RuntimeException("Specialite not found");
        }
        repository.deleteById(id);
    }

    // Spécialités disponibles
    public List<Specialite> getAvailableSpecialites() {
        return repository.findAvailableSpecialites();
    }
}