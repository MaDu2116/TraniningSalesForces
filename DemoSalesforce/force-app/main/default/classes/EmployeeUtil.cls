public with sharing class EmployeeUtil {
    /**
     * Convert Error to JSON format
     */
    public static String returnErrorJsonFormat(String msg) {
        Map<String, Object> result = new Map<String, Object>();
        result.put('message', msg);
        result.put('done', false);
        return JSON.serialize(result);
    }
}