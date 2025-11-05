package org.example.Repository;

import org.example.Entity.Specialite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SpecialiteRepository extends JpaRepository<Specialite, Long> {

    // Retourne les spécialités qui ne sont pas utilisées par un niveau
    @Query("SELECT s FROM Specialite s WHERE s.id NOT IN (SELECT n.specialite.id FROM Niveau n)")
    List<Specialite> findAvailableSpecialites();
}