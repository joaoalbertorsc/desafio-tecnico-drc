package org.drcchallenge.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Product entity representing a product in the inventory")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier of the product", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    @Schema(description = "Name of the product", example = "Smartphone X")
    private String name;

    @NotBlank(message = "Category is mandatory")
    @Schema(description = "Category of the product", example = "Electronics")
    private String category;

    @Schema(description = "Description of the product", example = "Latest model with high-res camera")
    private String description;

    @NotNull(message = "Price is mandatory")
    @Positive(message = "Price must be greater than zero")
    @Schema(description = "Price of the product", example = "999.99")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is mandatory")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    @Schema(description = "Quantity in stock", example = "50")
    private Integer stockQuantity;

    @Schema(description = "Barcode of the product", example = "1234567890123")
    private String barcode;

    @Schema(description = "Whether the product is active", example = "true")
    private Boolean active;

    @Schema(description = "Whether the product is on sale", example = "false")
    private Boolean onSale; // New field: Product on sale

    @Transient // This field is not stored in the database, but calculated
    @Schema(description = "Indicates if the stock is low (less than 5)", accessMode = Schema.AccessMode.READ_ONLY)
    public boolean isLowStock() {
        return this.stockQuantity != null && this.stockQuantity < 5;
    }
}
