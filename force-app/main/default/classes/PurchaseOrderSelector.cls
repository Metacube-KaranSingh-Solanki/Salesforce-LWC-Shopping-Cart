public with sharing class PurchaseOrderSelector extends fflib_SObjectSelector implements IPurchaseOrderSelector{

    public interface IPurchaseOrderSelector extends fflib_ISObjectSelector {
        // Compulsory methods of fflib_ISObjectSelector
        List<Schema.SObjectField> getSObjectFieldList();
        Schema.SObjectType getSObjectType();

        // Custom methods
        List<PurchaseOrder__c> selectPurchaseOrders();
    }
    
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            PurchaseOrder__c.Id,
            PurchaseOrder__c.Name,
            PurchaseOrder__c.Status__c,
            PurchaseOrder__c.OrderTotal__c
        };
	}
    
	public Schema.SObjectType getSObjectType() {
        return PurchaseOrder__c.SObjectType;
    }

    public static IPurchaseOrderSelector getInstance() {
		return (IPurchaseOrderSelector) Application.Selector().newInstance(PurchaseOrder__c.SObjectType);
	}

    public List<PurchaseOrder__c> selectPurchaseOrders(){
        return (List<PurchaseOrder__c>) Database.query(
            newQueryFactory(true).
            setLimit(20).
            toSOQL()
        );
    }
}