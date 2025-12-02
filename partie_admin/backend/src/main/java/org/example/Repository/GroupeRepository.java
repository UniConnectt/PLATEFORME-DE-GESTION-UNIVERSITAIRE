package org.example.Repository;

import org.example.Entity.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe, Long> {

    // Méthodes pour gérer les conflits de nom + numero par niveau
    boolean existsByNomAndNumeroAndNiveauId(String nom, Integer numero, Long niveauId);

    // Pour update : exclure l'entité courante
    boolean existsByNomAndNumeroAndNiveauIdAndIdNot(String nom, Integer numero, Long niveauId, Long id);

    // Requête pour charger les associations (niveau et specialite)
    @Query("SELECT g FROM Groupe g LEFT JOIN FETCH g.niveau LEFT JOIN FETCH g.specialite")
    List<Groupe> findAllWithAssociations();
}