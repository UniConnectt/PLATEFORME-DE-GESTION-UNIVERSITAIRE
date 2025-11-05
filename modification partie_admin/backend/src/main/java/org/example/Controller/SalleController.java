package org.example.Controller;

import org.example.Entity.Salle;
import org.example.Service.SalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salles")
@CrossOrigin(origins = "http://localhost:3000") // adapte au port React
public class SalleController {

    @Autowired
    private SalleService salleService;

    @GetMapping
    public List<Salle> getAll() {
        return salleService.getAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Salle salle) {
        Salle saved = salleService.save(salle);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Salle salle) {
        Salle updated = salleService.update(id, salle);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean deleted = salleService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Salle supprimée");
    }
}
