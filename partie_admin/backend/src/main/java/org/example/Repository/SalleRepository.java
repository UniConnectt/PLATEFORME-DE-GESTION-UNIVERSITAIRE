package org.example.Repository;

import org.example.Entity.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalleRepository extends JpaRepository<Salle, Long> {

    // Méthodes pour gérer les conflits de code
    boolean existsByCode(String code);

    // Pour update : exclure l'entité courante
    boolean existsByCodeAndIdNot(String code, Long id);

    // Requête pour charger les associations (département)
    @Query("SELECT s FROM Salle s LEFT JOIN FETCH s.departement")
    List<Salle> findAllWithAssociations();
}