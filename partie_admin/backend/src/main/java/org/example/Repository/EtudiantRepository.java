package org.example.Repository;

import org.example.Entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    boolean existsByEmail(String email);
    // méthodes utiles pour update (exclure l'entité courante)
    boolean existsByEmailAndIdNot(String email, Long id);

    // Nouvelle requête pour charger les associations (évite lazy loading et inclut groupe/specialite)
    @Query("SELECT e FROM Etudiant e LEFT JOIN FETCH e.groupe g LEFT JOIN FETCH e.specialite s")
    List<Etudiant> findAllWithAssociations();
}