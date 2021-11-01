public with sharing class ProductService {

    public interface IProductService{
        PurchaseOrder__c placeOrder(String productsString);
    }

    private static IProductService ProductServiceImpl;
    private static IProductService service() {
        if (ProductServiceImpl == null) {
            ProductServiceImpl = (IProductService) Application.Service().newInstance(IProductService.class);
        }
        return ProductServiceImpl;
    }

    public static PurchaseOrder__c placeOrder(String productsString) {
        return service().placeOrder(productsString);
    }
}
