//package com.javaweb.utils;
//
//import com.javaweb.model.request.BuildingSearchRequest;
//
//import java.util.Map;
//
//public class MapUtils {
//	public static <T> T getObject(Map<String,Object> maps, String key, Class<T> tClass) {
//		Object obj = maps.getOrDefault(key, null);
//		if(obj != null) {
//			if(tClass.getTypeName().equals("java.lang.Long")) {
//				obj = obj != "" ? Long.valueOf(obj.toString()) : null;
//			}
//			else if(tClass.getTypeName().equals("java.lang.Integer")) {
//				obj = obj != "" ? Integer.valueOf(obj.toString()) : null;
//			}
//			else if(tClass.getTypeName().equals("java.lang.String")) {
//				obj = obj.toString();
//			}
//			return tClass.cast(obj);
//		}
//		return null;
//	}

//    public static <T> T getObject(BuildingSearchRequest params, String key, Class<T> tClass) {
//
//        Object obj = params.get(key);
//        if (obj == null) return null;
//
//        String strValue = obj.toString().trim();
//
//        // Nếu là chuỗi rỗng sau trim
//        if (strValue.isEmpty()) {
//            return null;
//        }
//
//        try {
//            if (tClass == Long.class) {
//                return tClass.cast(Long.valueOf(strValue));
//            }
//            else if (tClass == Integer.class) {
//                return tClass.cast(Integer.valueOf(strValue));
//            }
//            else if (tClass == String.class) {
//                return tClass.cast(strValue);
//            }
//        } catch (NumberFormatException e) {
//            return null;
//        }
//
//        return null;
//    }
//}
