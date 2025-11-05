package org.example.Service;

import org.example.Entity.Niveau;
import org.example.Repository.NiveauRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NiveauService {

    private final NiveauRepository repository;

    public NiveauService(NiveauRepository repository) {
        this.repository = repository;
    }

    public Niveau ajouterNiveau(Niveau niveau) {
        return repository.save(niveau);
    }

    public List<Niveau> getAllNiveaux() {
        List<Niveau> niveaux = repository.findAll();
        System.out.println("Nombre de niveaux en base: " + niveaux.size()); // Log pour debug
        return niveaux;
    }

    public Niveau getNiveauById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Niveau non trouvé avec l'id " + id));
    }

    public Niveau modifierNiveau(Long id, Niveau niveauDetails) {
        Niveau niveau = getNiveauById(id);
        niveau.setNom(niveauDetails.getNom());
        niveau.setSpecialite(niveauDetails.getSpecialite());
        return repository.save(niveau);
    }

    public void supprimerNiveau(Long id) {
        Niveau niveau = getNiveauById(id);
        repository.delete(niveau);
    }
}