package org.drcchallenge.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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
    @Pattern(regexp = ".*[a-zA-Z\\u00C0-\\u00FF].*", message = "Name must contain at least one letter")
    @Schema(description = "Name of the product", example = "Smartphone X")
    private String name;

    @NotBlank(message = "Category is mandatory")
    @Pattern(regexp = ".*[a-zA-Z\\u00C0-\\u00FF].*", message = "Category must contain at least one letter")
    @Schema(description = "Category of the product", example = "Electronics")
    private String category;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    @Pattern(regexp = "^$|.*[a-zA-Z\\u00C0-\\u00FF].*", message = "Description must contain at least one letter if provided")
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

    @Pattern(regexp = "^\\d*$", message = "Barcode must contain only numbers")
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
