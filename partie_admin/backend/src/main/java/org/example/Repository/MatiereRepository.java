package org.example.Repository;

import org.example.Entity.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatiereRepository extends JpaRepository<Matiere, Long> {

    @Query("SELECT m FROM Matiere m WHERE m.enseignant.id = :id")
    List<Matiere> findByIdEnseignant(@Param("id") Long id);

    boolean existsByNom(String nom);

    boolean existsByNomAndIdNot(String nom, Long id);
}