package com.javaweb.controller.admin;



import com.javaweb.builder.BuildingSearchBuilder;
import com.javaweb.converter.BuildingSearchBuilderConverter;
import com.javaweb.enums.District;
import com.javaweb.enums.TypeCode;
import com.javaweb.model.dto.BuildingDTO;
import com.javaweb.model.request.BuildingSearchRequest;
import com.javaweb.model.response.BuildingSearchResponse;
import com.javaweb.service.BuildingService;
import com.javaweb.service.IUserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller(value="buildingControllerOfAdmin")
public class BuildingController {

    @Autowired
    IUserService userService;
    @Autowired
    BuildingService buildingService;
    @Autowired
    BuildingSearchBuilderConverter buildingSearchBuilderConverter;
    @Autowired
    ModelMapper modelMapper;

@RequestMapping(value = "/admin/building-list", method = RequestMethod.GET)
    public ModelAndView buildingList(@ModelAttribute BuildingSearchRequest buildingSearchRequest,
                                     HttpServletRequest request){
     ModelAndView mav =new ModelAndView("admin/building/list");
    mav.addObject("modelSearch",buildingSearchRequest);
     List<BuildingSearchResponse> ResponseList = buildingService.findAll(buildingSearchRequest);
    BuildingSearchResponse buildingSearchResponse = new BuildingSearchResponse();
    mav.addObject("buildingList",ResponseList);
    mav.addObject("staffs",userService.getStaff());
    mav.addObject("districts", District.getDistrictName());
    mav.addObject("typeCodes", TypeCode.getTypeCode());
     return mav;
    }

    @RequestMapping(value = "/admin/building-edit", method = RequestMethod.GET)
    public ModelAndView buildingEdit(@ModelAttribute("buildingEdit") BuildingDTO buildingDTO, HttpServletRequest request){
        ModelAndView mav =new ModelAndView("admin/building/edit");
        mav.addObject("districts",District.getDistrictName());
        mav.addObject("typeCodes", TypeCode.getTypeCode());
        return mav;
    }
    @RequestMapping(value = "/admin/building-edit-{id}", method = RequestMethod.GET)
    public ModelAndView buildingEdit(@PathVariable("id") Long Id, HttpServletRequest request){
        ModelAndView mav =new ModelAndView("admin/building/edit");
        // Lấy thông tin tòa nhà từ database theo ID
        BuildingDTO buildingDTO = buildingService.getBuildingById(Id);

        if (buildingDTO == null) {
            // Nếu không tìm thấy, tạo mới một BuildingDTO
            buildingDTO = new BuildingDTO();
            buildingDTO.setId(Id);
        }
        mav.addObject("buildingEdit",buildingDTO);
        mav.addObject("districts",District.getDistrictName());
        mav.addObject("typeCodes", TypeCode.getTypeCode());
        return mav;
    }
}
