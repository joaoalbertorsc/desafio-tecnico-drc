package org.drcchallenge.repository;

import org.drcchallenge.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:category IS NULL OR p.category = :category)")
    Page<Product> findByNameContainingAndCategory(@Param("name") String name, 
                                                  @Param("category") String category, 
                                                  Pageable pageable);

    @Query("SELECT SUM(p.price * p.stockQuantity) FROM Product p WHERE p.active = true")
    BigDecimal getTotalStockValue();
}
