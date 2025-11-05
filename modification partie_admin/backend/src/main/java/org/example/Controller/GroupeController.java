package org.example.Controller;

import org.example.Entity.Groupe;
import org.example.Service.GroupeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groupes")
@CrossOrigin(origins = "http://localhost:3000") // adapte si ton React tourne sur 4200
public class GroupeController {

    @Autowired
    private GroupeService groupeService;

    @GetMapping
    public List<Groupe> getAllGroupes() {
        return groupeService.getAllGroupes();
    }

    @PostMapping
    public ResponseEntity<Groupe> addGroupe(@RequestBody Groupe g) {
        Groupe saved = groupeService.addGroupe(g);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Groupe> updateGroupe(@PathVariable Long id, @RequestBody Groupe g) {
        Groupe updated = groupeService.updateGroupe(id, g);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroupe(@PathVariable Long id) {
        if (groupeService.deleteGroupe(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
