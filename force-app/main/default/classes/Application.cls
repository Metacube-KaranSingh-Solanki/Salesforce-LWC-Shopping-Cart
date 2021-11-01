public with sharing class Application {

    // Configure and create the SelectorFactory for this Application
    private static fflib_Application.SelectorFactory selectorInstance;
    public static fflib_Application.SelectorFactory Selector(){
        if (selectorInstance == null) {
            selectorInstance = new fflib_Application.SelectorFactory(
                new Map<SObjectType, Type> {
                    Product2.SObjectType => Type.forName('ProductSelector'),
                    PurchaseOrder__c.SObjectType => Type.forName('PurchaseOrderSelector')
                }
            );
        }
        return selectorInstance;
    }
        
    // Configure and create the ServiceFactory for this Application
    private static fflib_Application.ServiceFactory serviceInstance;
    public static fflib_Application.ServiceFactory Service(){
        if (serviceInstance == null) {
            serviceInstance = new fflib_Application.ServiceFactory(
                new Map<Type, Type>{
                    ProductService.IProductService.class => ProductServiceImpl.class
                }
            );
        }
        return serviceInstance;
    }
}
