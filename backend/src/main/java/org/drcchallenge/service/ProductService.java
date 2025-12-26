package org.drcchallenge.service;

import org.drcchallenge.exception.ResourceNotFoundException;
import org.drcchallenge.model.Product;
import org.drcchallenge.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        capitalizeName(product);
        return productRepository.save(product);
    }

    public Page<Product> getAllProducts(String name, String category, Pageable pageable) {
        Pageable caseInsensitivePageable = createCaseInsensitivePageable(pageable);

        if(name == null && category == null){
            return productRepository.findAll(caseInsensitivePageable);
        }
        return productRepository.findByNameContainingAndCategory(name, category, caseInsensitivePageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(productDetails.getName());
        capitalizeName(product);
        product.setCategory(productDetails.getCategory());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setBarcode(productDetails.getBarcode());
        product.setActive(productDetails.getActive());
        product.setOnSale(productDetails.getOnSale());

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    public BigDecimal getTotalStockValue() {
        return productRepository.getTotalStockValue();
    }

    private void capitalizeName(Product product) {
        if (product.getName() != null && !product.getName().isEmpty()) {
            String name = product.getName();
            product.setName(name.substring(0, 1).toUpperCase() + name.substring(1));
        }
    }

    private Pageable createCaseInsensitivePageable(Pageable pageable) {
        Sort sort = pageable.getSort();
        Sort newSort = Sort.unsorted();

        for (Sort.Order order : sort) {
            Sort.Order newOrder;
            if (order.getProperty().equalsIgnoreCase("name") || order.getProperty().equalsIgnoreCase("category")) {
                newOrder = order.ignoreCase();
            } else {
                newOrder = order;
            }
            newSort = newSort.and(Sort.by(newOrder));
        }

        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), newSort);
    }
}
