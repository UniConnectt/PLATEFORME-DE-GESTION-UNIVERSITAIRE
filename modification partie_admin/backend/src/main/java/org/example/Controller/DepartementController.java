package org.example.Controller;




import lombok.RequiredArgsConstructor;
import org.example.Entity.Departement;
import org.example.Service.DepartementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departements")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DepartementController {

    @Autowired
    private DepartementService service;

    // Récupérer tous les départements
    @GetMapping
    public List<Departement> getAllDepartements() {
        return service.getAll();
    }

    // Créer un nouveau département
    @PostMapping
    public Departement createDepartement(@RequestBody Departement departement) {
        return service.create(departement);
    }


    // Mettre à jour un département existant
    @PutMapping("/{id}")
    public ResponseEntity<Departement> updateDepartement(
            @PathVariable Long id,
            @RequestBody Departement departement) {
        try {
            Departement updated = service.update(id, departement);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
   
    // Supprimer un département
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartement(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
