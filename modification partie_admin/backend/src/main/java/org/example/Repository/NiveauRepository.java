package org.example.Repository;

import org.example.Entity.Niveau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NiveauRepository extends JpaRepository<Niveau, Long> {
}
