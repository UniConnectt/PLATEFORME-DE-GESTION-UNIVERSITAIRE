package org.example.Repository;

import org.example.Entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {

    boolean existsByEmail(String email);

    // méthodes utiles pour update (exclure l'entité courante)
    boolean existsByEmailAndIdNot(String email, Long id);
}