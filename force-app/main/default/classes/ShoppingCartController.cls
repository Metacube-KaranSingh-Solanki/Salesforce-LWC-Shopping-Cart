public with sharing class ShoppingCartController {

    // Used to catch the JSON string into an object
    public class InvoiceProduct {
        public String Id;
        public String Name;
        public String ProductCode;
        public integer Quantity;
        public integer Price;
        public integer AvailableQuantity;
    }

    @AuraEnabled(Cacheable = true)
    public static List<PurchaseOrder__c> getOrders(){
        return [SELECT Id, Name, User__c, Status__c, OrderTotal__c FROM PurchaseOrder__c];
    }

    @AuraEnabled(Cacheable = true)
    public static List<Product2> searchProductsByKey(String key){
        key = '%' + key + '%';
        String query = 'SELECT Id, Name, ProductCode, Price__c, AvailableQuantity__c FROM Product2 WHERE Name LIKE \'' + key + '\'';
        System.debug(query);
        return (List<Product2>)Database.query(query);
    }
 
    @AuraEnabled
    public static PurchaseOrder__c insertOrder(String productsString){

        List<InvoiceProduct> products = (List<InvoiceProduct>) JSON.deserialize(productsString, List<InvoiceProduct>.class);
        
        PurchaseOrder__c order = new PurchaseOrder__c(User__c=UserInfo.getUserId(), Status__c='Processing');
        insert order;

        List<PurchaseOrderLineItem__c> poli = new List<PurchaseOrderLineItem__c>();
        for (InvoiceProduct product: products) {
            poli.add(new PurchaseOrderLineItem__c(Product__c=product.Id, PurchaseOrder__c=order.Id, Quantity__c=product.Quantity));
        }
        System.debug(poli.size());
        insert poli;

        return order;

    }

}
