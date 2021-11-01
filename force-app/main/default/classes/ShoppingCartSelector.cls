public with sharing class ShoppingCartSelector extends fflib_SObjectSelector {
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Product2.Id,
            Product2.AvailableQuantity__c,
            Product2.Price__c,
            Product2.ProductCode,
            Product2.Name
        };
	}
    
	public Schema.SObjectType getSObjectType() {
        return Product2.SObjectType;
    }

    public List<Product2> selectProducts(String search){
        return (List<Product2>) Database.query(
            newQueryFactory(true).
            setCondition('Name LIKE \'%'+search+'%\'').
            toSOQL()
        );
    }

    public List<PurchaseOrder__c> selectPurchaseOrder(){
        return (List<PurchaseOrder__c>) Database.query(
            newQueryFactory(true).
            setLimit(20).
            toSOQL()
        );
    }
}