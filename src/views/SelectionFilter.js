import React, { useContext, useEffect, useState } from "react";
import { useDataContext } from "../context/DataContext";
import { Select, Slider, Switch } from "antd";
import { FilterContext } from "../context/FilterContext";
import { CheckOutlined } from "@ant-design/icons";
import * as d3 from "d3";

export default function SelectionFilters(props) {
  const { cData, cFilter } = useDataContext();
  const [data, setData] = cData;
  const [filter, setFilter] = cFilter;
  const [listings, setListings] = useState([]);
  const [property, setProperty] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [accommodates, setAccommodates] = useState({
    min: 0,
    max: 16,
  });

  const [nearBySubway, setNearBySubway] = useState({
    min: 0,
    max: 52,
  });

  const [nearByTourim, setNearByTourim] = useState({
    min: 0,
    max: 101,
  });

  const [price, setPrice] = useState({
    min: 10,
    max: 655,
  });

  const { state, dispatch } = useContext(FilterContext);

  const updateData = (value) => {
    const newState = state;
    newState["listing"] = value;
    dispatch({ type: "UPDATE_DATA", payload: newState });
  };

  const updateDataArray = (value, str) => {
    const newState = state;
    newState[str] = value;
    dispatch({ type: "UPDATE_DATA", payload: newState });
  };

  const onChangeToggle = (value, str) => {
    const newState = state;
    newState[str] = !newState[str];
    dispatch({ type: "UPDATE_DATA", payload: newState });
  };

  const onSliderChange = (value, str) => {
    const newState = state;
    newState[str] = value;
    dispatch({ type: "UPDATE_DATA", payload: newState });
  };

  useEffect(() => {
    getListings(data);
  }, [data, filter]);

  useEffect(() => {}, [state]);

  const getListings = (data) => {
    const tmpList = [];
    const tmpProperty = [];
    data.forEach((element) => {
      tmpList.push({
        value: element.list_id,
        label: element.name,
      });
      if (!tmpProperty.includes(element.room_type)) {
        tmpProperty.push(element.room_type);
      }
    });

    const properties = [];
    tmpProperty.forEach((element) => {
      properties.push({
        value: element,
        label: element,
      });
    });

    const tmpAmenity = [
      "wifi",
      "smoke alarm",
      "heating",
      "kitchen",
      "tv",
      "dryer",
      "air conditioning",
      "hot water",
      "iron",
      "refrigerator",
      "shampoo",
      "coffee",
      "washer",
      "dedicated workspace",
      "oven",
      "fire extinguisher",
      "self check-in",
      "first aid kit",
      "free street parking",
      "extra pillows and blankets",
      "bathtub",
      "pets allowed",
      "gym",
    ];

    const amenities = [];
    tmpAmenity.forEach((element) => {
      amenities.push({
        value: element.replace(" ", "_").replace("-", "_"),
        label: element,
      });
    });

    const maxAcc = d3.max(data, (d) => d.accommodates);
    const minAcc = d3.min(data, (d) => d.accommodates);

    const accommodatesConfig = {
      min: minAcc,
      max: maxAcc,
    };

    const maxSubway = d3.max(data, (d) => d.subway_count);

    const subwayConfig = {
      min: 0,
      max: maxSubway,
    };

    const maxTourism = d3.max(data, (d) => d.tourist_count);

    const tourismConfig = {
      min: 0,
      max: maxTourism,
    };

    const maxPrice = d3.max(data, (d) => d.price);
    const minPrice = d3.min(data, (d) => d.price);

    const priceConfig = {
      min: minPrice,
      max: maxPrice,
    };

    setAccommodates(accommodatesConfig);
    setNearByTourim(tourismConfig);
    setNearBySubway(subwayConfig);
    setPrice(priceConfig);
    setAmenities(amenities);
    setListings(tmpList);
    setProperty(properties);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div className="pane">
      <div className="header">Selection & Filters</div>
      <div className="flex-grow" id={props.chartName}>
        <>
          <div className="p-1 text-sm pt-2">Listing Selection</div>
          <Select
            showSearch
            placeholder="Select a listing"
            optionFilterProp="children"
            allowClear
            onChange={updateData}
            onSearch={onSearch}
            filterOption={filterOption}
            options={listings}
            style={{ width: "100%" }}
            dropdownAlign={{ overflow: { adjustX: false, adjustY: false } }}
          />
        </>
        {props.room_type && (
          <>
            <div className="p-1 text-sm pt-2">Room Types</div>
            <Select
              showSearch
              placeholder="Select Room Types"
              optionFilterProp="children"
              allowClear
              mode="multiple"
              onChange={(value) => updateDataArray(value, "roomType")}
              onSearch={onSearch}
              filterOption={filterOption}
              options={property}
              style={{ width: "100%" }}
              dropdownAlign={{ overflow: { adjustX: false, adjustY: false } }}
            />
          </>
        )}

        {
          <>
            <div className="p-1 text-sm pt-2">Amenities</div>
            <Select
              showSearch
              placeholder="Select Amenities"
              optionFilterProp="children"
              allowClear
              mode="multiple"
              onChange={(value) => updateDataArray(value, "amenities")}
              onSearch={onSearch}
              filterOption={filterOption}
              options={amenities}
              style={{ width: "100%" }}
              dropdownAlign={{ overflow: { adjustX: false, adjustY: false } }}
            />
          </>
        }

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="col-span-1">
            <div className="p-1 text-sm">Price</div>
            <div className="flex justify-center">
              <div className="w-4/5">
                <Slider
                  range
                  marks={{
                    [price.min]: `$${price.min}`,
                    [price.max]: `$${price.max}`,
                  }}
                  min={price.min}
                  max={price.max}
                  defaultValue={[price.min, price.max]}
                  onChange={(value) => onSliderChange(value, "price")}
                />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="p-1  text-sm">Accommodates</div>
            <div className="flex justify-center">
              <div className="w-4/5">
                <Slider
                  range
                  marks={{
                    [accommodates.min]: accommodates.min,
                    [accommodates.max]: accommodates.max,
                  }}
                  min={accommodates.min}
                  max={accommodates.max}
                  defaultValue={[accommodates.min, accommodates.max]}
                  onChange={(value) => onSliderChange(value, "accommodates")}
                />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="p-1 text-sm">Number of Nearby Subway</div>
            <div className="flex justify-center">
              <div className="w-4/5">
                <Slider
                  range
                  marks={{
                    [nearBySubway.min]: nearBySubway.min,
                    [nearBySubway.max]: nearBySubway.max,
                  }}
                  min={nearBySubway.min}
                  max={nearBySubway.max}
                  defaultValue={[nearBySubway.min, nearBySubway.max]}
                  onChange={(value) => onSliderChange(value, "nearBySubway")}
                />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="p-1 text-sm">Number of Nearby Tourism Spot</div>
            <div className="flex justify-center">
              <div className="w-4/5">
                <Slider
                  range
                  marks={{
                    [nearByTourim.min]: nearByTourim.min,
                    [nearByTourim.max]: nearByTourim.max,
                  }}
                  min={nearByTourim.min}
                  max={nearByTourim.max}
                  defaultValue={[nearByTourim.min, nearByTourim.max]}
                  onChange={(value) => onSliderChange(value, "nearByTourism")}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-between pt-4">
          {
            <div className="flex items-center">
              <div className="p-1 text-sm">Show Subways</div>
              <Switch
                className="bg-slate-200"
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CheckOutlined />}
                checked={state.showSubway}
                onChange={(value) => onChangeToggle(value, "showSubway")}
              />
            </div>
          }

          {
            <div className="flex items-center">
              <div className="p-1 text-sm">Show Tourism Spot</div>
              <Switch
                className="bg-slate-200"
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CheckOutlined />}
                checked={state.showTourism}
                onChange={(value) => onChangeToggle(value, "showTourism")}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}
