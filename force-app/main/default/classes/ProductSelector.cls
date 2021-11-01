public with sharing class ProductSelector extends fflib_SObjectSelector implements IProductSelector{

    public interface IProductSelector extends fflib_ISObjectSelector {
        // Compulsory methods of fflib_ISObjectSelector
        List<Schema.SObjectField> getSObjectFieldList();
        Schema.SObjectType getSObjectType();

        // Custom methods
        List<Product2> searchProductsByKey(String key);
    }
    
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

    public static IProductSelector getInstance() {
		return (IProductSelector) Application.Selector().newInstance(Product2.SObjectType);
	}

    public List<Product2> searchProductsByKey(String key){
        return (List<Product2>) Database.query(
            newQueryFactory(true).
            setCondition('Name LIKE \'%'+key+'%\'').
            toSOQL()
        );
    }
}
