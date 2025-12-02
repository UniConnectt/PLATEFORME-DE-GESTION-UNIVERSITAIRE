package org.example.Repository;

import org.example.Entity.Departement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartementRepository extends JpaRepository<Departement, Long> {

    boolean existsByNom(String nom);

    boolean existsByAbbreviation(String abbreviation);

    // méthodes utiles pour update (exclure l'entité courante)
    boolean existsByNomAndIdNot(String nom, Long id);

    boolean existsByAbbreviationAndIdNot(String abbreviation, Long id);
}
