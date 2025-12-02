package org.example.Repository;

import org.example.Entity.Niveau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NiveauRepository extends JpaRepository<Niveau, Long> {

    // Méthodes pour gérer les conflits de nom par spécialité
    boolean existsByNomAndSpecialiteId(String nom, Long specialiteId);

    // Pour update : exclure l'entité courante
    boolean existsByNomAndSpecialiteIdAndIdNot(String nom, Long specialiteId, Long id);

    // Requête pour charger les associations (spécialité EAGER, mais pour cohérence)
    @Query("SELECT n FROM Niveau n LEFT JOIN FETCH n.specialite")
    List<Niveau> findAllWithAssociations();
}