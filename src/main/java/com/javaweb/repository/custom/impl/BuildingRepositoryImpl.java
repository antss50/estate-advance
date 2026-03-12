package com.javaweb.repository.custom.impl;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import com.javaweb.builder.BuildingSearchBuilder;
import com.javaweb.repository.custom.BuildingRepositoryCustom;
import com.javaweb.entity.BuildingEntity;

@Repository
public class BuildingRepositoryImpl implements BuildingRepositoryCustom{
    @PersistenceContext
    private EntityManager entityManager;

    public static void joinTable(BuildingSearchBuilder buildingSearchBuilder, StringBuilder sql) {
        Long staffId = buildingSearchBuilder.getStaffId();
        if(staffId != null) {
            sql.append(" INNER JOIN assignmentbuilding ON b.id = assignmentbuilding.buildingid ");
        }
    }

    public static void queryNomal(BuildingSearchBuilder buildingSearchBuilder, StringBuilder where) {
        try {
            Field[] fields = BuildingSearchBuilder.class.getDeclaredFields();
            for(Field item : fields) {
                item.setAccessible(true);
                String fieldName = item.getName();
                if(fieldName.equals("staffId") || fieldName.equals("typeCode") ||
                        fieldName.startsWith("area") ||
                        fieldName.startsWith("rentPrice")) {
                    continue;
                }
                Object value = item.get(buildingSearchBuilder);
                if(value != null && value != "") {
                    if(item.getType().getName().equals("java.lang.Long") || item.getType().getName().equals("java.lang.Integer")) {
                        where.append(" AND b." + fieldName + " = " + value);
                    }
                    else if(item.getType().getName().equals("java.lang.String"))
                        where.append(" AND b." + fieldName + " LIKE '%"+ value + "%' ");
                }

            }
        }
        catch(Exception ex) {
            ex.printStackTrace();
        }
    }

    public static void querySpecial(BuildingSearchBuilder buildingSearchBuilder, StringBuilder where) {
        Long staffId = buildingSearchBuilder.getStaffId();
        if(staffId != null) {
            where.append(" AND assignmentbuilding.staffid = " + staffId);
        }
        Long rentAreaFrom = buildingSearchBuilder.getAreaFrom();
        Long rentAreaTo = buildingSearchBuilder.getAreaTo();
        if(rentAreaFrom != null || rentAreaTo != null ) {
            where.append(" AND EXISTS (SELECT * FROM rentarea r WHERE r.buildingid = b.id ");
            if (rentAreaFrom != null) {
                where.append(" AND r.value >= " + rentAreaFrom);
            }
            if (rentAreaTo != null) {
                where.append(" AND r.value <= " + rentAreaTo);
            }
            where.append(" ) ");
        }
        Long rentPriceFrom = buildingSearchBuilder.getRentPriceFrom();
        Long rentPriceTo = buildingSearchBuilder.getRentPriceTo();
        if (rentPriceFrom != null) {
            where.append(" AND rentprice >= " + rentPriceFrom);
        }
        if (rentPriceTo != null) {
            where.append(" AND rentprice <= " + rentPriceTo);
        }
        //java7
			/*
			 * if (typeCode != null && typeCode.size() != 0) {
			 *
			 * List<String> code = new ArrayList<>();
			 *  for (String item : typeCode) {
			 * code.add("'" + item + "'");
			 * }
			 * where.append(" AND renttype.code IN( " +
			 * String.join(",", code) + ")");
			    }
			 */
        //java8
        if(buildingSearchBuilder.getTypeCode() != null && buildingSearchBuilder.getTypeCode().size() != 0) {
            where.append(" AND(");
            String sql = buildingSearchBuilder.getTypeCode().stream().map(it -> " b.type Like" + "'%" + it + "%' ").collect(Collectors.joining(" OR "));
            where.append(sql + " ) ");
        }
    }

    // @Override
    public List<BuildingEntity> findAll(BuildingSearchBuilder buildingSearchBuilder) {
        try {
            StringBuilder sql = new StringBuilder("SELECT b.* FROM building b ");
            StringBuilder where = new StringBuilder(" WHERE 1 = 1 ");
            joinTable(buildingSearchBuilder, sql);
            queryNomal(buildingSearchBuilder, where);
            querySpecial(buildingSearchBuilder, where);

            sql.append(where)
                    .append(" GROUP BY b.id");
            Query query = entityManager.createNativeQuery(sql.toString(), BuildingEntity.class);
            List<BuildingEntity> result = query.getResultList();
            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

}