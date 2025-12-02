package org.example.Repository;

import org.example.Entity.Specialite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecialiteRepository extends JpaRepository<Specialite, Long> {

    boolean existsByNom(String nom);
    boolean existsByAbbreviation(String abbreviation);

    boolean existsByNomAndIdNot(String nom, Long id);
    boolean existsByAbbreviationAndIdNot(String abbreviation, Long id);

    // Plus besoin de la requête pour les spécialités "disponibles" liées au niveau
}