public with sharing class ProductServiceImpl implements ProductService.IProductService {

    // Used to catch the JSON string into an object
    public class InvoiceProduct {
        public String Id;
        public String Name;
        public String ProductCode;
        public integer Quantity;
        public integer Price;
        public integer AvailableQuantity;
    }

    public PurchaseOrder__c placeOrder(String productsString) {
        // TODO: Convert DML to UnitOfWork
        List<InvoiceProduct> products = (List<InvoiceProduct>) JSON.deserialize(productsString, List<InvoiceProduct>.class);
        
        PurchaseOrder__c order = new PurchaseOrder__c(User__c=UserInfo.getUserId(), Status__c='Processing');
        insert order;

        List<Product2> productsToUpdate = new List<Product2>();

        List<PurchaseOrderLineItem__c> poli = new List<PurchaseOrderLineItem__c>();
        for (InvoiceProduct product: products) {
            poli.add(new PurchaseOrderLineItem__c(Product__c=product.Id, PurchaseOrder__c=order.Id, Quantity__c=product.Quantity));
            productsToUpdate.add(new Product2(Id=product.Id, AvailableQuantity__c=product.AvailableQuantity));
        }
        
        insert poli;
        update productsToUpdate;

        return order;
    }
}
