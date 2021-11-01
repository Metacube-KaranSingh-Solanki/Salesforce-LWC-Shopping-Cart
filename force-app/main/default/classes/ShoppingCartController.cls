public with sharing class ShoppingCartController{

    @AuraEnabled(Cacheable = true)
    public static List<PurchaseOrder__c> getPurchaseOrders(){
        return PurchaseOrderSelector.getInstance().selectPurchaseOrders();
    }

    @AuraEnabled(Cacheable = true)
    public static List<Product2> searchProductsByKey(String key){
        return ProductSelector.getInstance().searchProductsByKey(key);
    }
 
    @AuraEnabled
    public static PurchaseOrder__c placeOrder(String productsString){
        return ProductService.placeOrder(productsString);
    }

}
