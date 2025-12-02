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

    // ----- LIST -----
    @GetMapping
    public List<Departement> getAllDepartements() {
        return service.getAll();
    }

    // ----- CREATE -----
    @PostMapping
    public ResponseEntity<?> createDepartement(@RequestBody Departement departement) {
        try {
            Departement created = service.create(departement);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ----- UPDATE -----
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartement(
            @PathVariable Long id,
            @RequestBody Departement departement) {
        try {
            Departement updated = service.update(id, departement);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ----- DELETE -----
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartement(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
