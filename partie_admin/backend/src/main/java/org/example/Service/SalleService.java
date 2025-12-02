package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Salle;
import org.example.Entity.Departement;
import org.example.Repository.SalleRepository;
import org.example.Repository.DepartementRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalleService {

    private final SalleRepository salleRepo;
    private final DepartementRepository departementRepo;

    // Récupérer toutes les salles
    public List<Salle> getAll() {
        return salleRepo.findAllWithAssociations(); // ✅ Utilise JOIN FETCH pour charger département
    }

    // Récupérer tous les codes uniques
    public List<String> getAllCodes() {
        return salleRepo.findAll().stream()
                .map(Salle::getCode)
                .distinct()
                .collect(Collectors.toList());
    }

    // Récupérer tous les types uniques
    public List<String> getAllTypes() {
        return salleRepo.findAll().stream()
                .map(Salle::getType)
                .filter(t -> t != null && !t.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    // ----- CREATE -----
    public Salle save(Salle salle) {
        // Validations
        if (salle.getCode() == null || salle.getCode().trim().isEmpty()) {
            throw new RuntimeException("❌ Le code de la salle est obligatoire.");
        }
        if (salle.getCapacite() == null || salle.getCapacite() < 0) {
            throw new RuntimeException("❌ La capacité de la salle est obligatoire et doit être positive.");
        }
        if (salle.getDepartement() == null || salle.getDepartement().getId() == null) {
            throw new RuntimeException("❌ Le département est obligatoire et doit avoir un ID valide.");
        }
        // Vérifier doublon code
        if (salleRepo.existsByCode(salle.getCode().trim())) {
            throw new RuntimeException("❌ Salle déjà existante : ce code est déjà utilisé !");
        }
        // Trim et set
        salle.setCode(salle.getCode().trim());
        // Associer le département
        if (salle.getDepartement() != null && salle.getDepartement().getId() != null) {
            Departement departement = departementRepo.findById(salle.getDepartement().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Département non trouvé."));
            salle.setDepartement(departement);
        }
        return salleRepo.save(salle);
    }

    // ----- UPDATE -----
    public Salle update(Long id, Salle salle) {
        Salle existing = salleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Salle introuvable."));
        // Validations
        if (salle.getCode() == null || salle.getCode().trim().isEmpty()) {
            throw new RuntimeException("❌ Le code de la salle est obligatoire.");
        }
        if (salle.getCapacite() == null || salle.getCapacite() < 0) {
            throw new RuntimeException("❌ La capacité de la salle est obligatoire et doit être positive.");
        }
        if (salle.getDepartement() == null || salle.getDepartement().getId() == null) {
            throw new RuntimeException("❌ Le département est obligatoire et doit avoir un ID valide.");
        }
        String newCode = salle.getCode().trim();
        // Vérifier doublon code (exclure courant)
        if (!existing.getCode().equals(newCode) && salleRepo.existsByCodeAndIdNot(newCode, id)) {
            throw new RuntimeException("❌ Impossible de modifier : ce code est déjà utilisé par une autre salle !");
        }
        // Mise à jour
        existing.setCode(newCode);
        existing.setType(salle.getType());
        existing.setCapacite(salle.getCapacite());
        // Associer le département
        Departement departement = departementRepo.findById(salle.getDepartement().getId())
                .orElseThrow(() -> new RuntimeException("❌ Département non trouvé."));
        existing.setDepartement(departement);
        return salleRepo.save(existing);
    }

    // ----- DELETE -----
    public boolean delete(Long id) {
        if (!salleRepo.existsById(id)) {
            throw new RuntimeException("❌ Salle introuvable.");
        }
        salleRepo.deleteById(id);
        return true;
    }
}