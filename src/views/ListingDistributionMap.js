import React, { useContext, useEffect, useState } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import Loading from "../util/Loading";
import { FilterContext } from "../context/FilterContext";

export default function ListingDistributionMap(props) {
  const { cData, cSubway, cTourist } = useDataContext();
  const [data, setData] = cData;
  const [subway, setSubway] = cSubway;
  const [tourist, setTourist] = cTourist;

  useEffect(() => {
    drawCircle(data, subway, tourist);
  }, [data, subway, tourist]);

  const { state } = useContext(FilterContext);

  useEffect(() => {
    drawCircle(data, subway, tourist);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);

  const handleResize = () => {
    drawCircle(data, subway, tourist);
  };

  useEffect(() => {
    drawCircle(data, subway, tourist);
  }, [state]);

  const drawCircle = (d, s, t) => {
    if (d.length <= 0) {
      return;
    }

    let initLat = 0;
    let initLog = 0;
    let filteredData = d;
    let selected = false;

    if (state.listing) {
      filteredData = d3.filter(filteredData, (d) => d.list_id == state.listing);
      selected = true;
    }

    if (state.roomType.length > 0) {
      filteredData = d3.filter(filteredData, (d) =>
        state.roomType.includes(d.room_type)
      );
    }

    if (state.price.length > 0) {
      filteredData = d3.filter(
        filteredData,
        (d) => d.price >= state.price[0] && d.price <= state.price[1]
      );
    }

    if (state.nearBySubway.length > 0) {
      filteredData = d3.filter(
        filteredData,
        (d) =>
          d.subway_count >= state.nearBySubway[0] &&
          d.subway_count <= state.nearBySubway[1]
      );
    }

    if (state.nearByTourism.length > 0) {
      filteredData = d3.filter(
        filteredData,
        (d) =>
          d.tourist_count >= state.nearByTourism[0] &&
          d.tourist_count <= state.nearByTourism[1]
      );
    }

    if (state.accommodates.length > 0) {
      filteredData = d3.filter(
        filteredData,
        (d) =>
          d.accommodates >= state.accommodates[0] &&
          d.accommodates <= state.accommodates[1]
      );
    }

    if (state.amenities.length > 0) {
      filteredData = d3.filter(filteredData, (d) => {
        let valid = true;
        state.amenities.forEach((element) => {
          if (d[element] == 0) {
            valid = false;
            return;
          }
        });
        return valid;
      });
    }

    if (filteredData) {
      initLat = d3.mean(filteredData, (row) => row.latitude);
      initLog = d3.mean(filteredData, (row) => row.longitude);
    } else {
      initLat = d3.mean(d, (row) => row.latitude);
      initLog = d3.mean(d, (row) => row.longitude);
    }

    d3.select(`.${props.chartName} > *`).remove();
    document.getElementById(props.chartName).innerHTML =
      "<div id='map' style='width: 100%; height: 100%;'></div>";
    var map = L.map("map").setView([initLat, initLog], selected ? 15 : 11);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    if (state.showSubway && s.length > 0) {
      const subwayIcon = L.icon({
        iconUrl: "./railway_icon.png",
        iconSize: [32, 32],
      });

      s.map((row, i) => {
        let marker = L.marker([row.latitude, row.longitude], {
          icon: subwayIcon,
        });

        // Create Popup
        marker.bindPopup(`
        <b>Type:</b> Train Station<br/>
        <b>Name:</b> ${row.name}<br/>
        `);
        marker.addTo(map);
      });
    }

    if (state.showTourism && t.length > 0) {
      const touristIcon = L.icon({
        iconUrl: "./tourist_icon.png",
        iconSize: [32, 32],
      });

      t.map((row, i) => {
        let marker = L.marker([row.latitude, row.longitude], {
          icon: touristIcon,
        });

        // Create Popup
        marker.bindPopup(`
        <b>Type:</b> Tourism Spot<br/>
        <b>Name:</b> ${row.name}<br/>
        `);
        marker.addTo(map);
      });
    }

    let listingMarkers = L.markerClusterGroup();

    if (filteredData.length > 0) {
      const homeIcon = L.icon({
        iconUrl: "./homeIcon.png",
        iconSize: [28, 28],
      });

      filteredData.map((row, i) => {
        let marker = L.marker([row.latitude, row.longitude], {
          icon: homeIcon,
        });

        // Create Popup
        marker.bindPopup(`
        <img src=${row.picture_url} width="100%"/>
        <b>Name:</b> ${row.name}<br/>
        <b>Room Type:</b> ${row.room_type}<br/>
        <b>Review Rating:</b> ${row.review_rating}<br/>
        <b>Price:</b> $${row.price.toFixed(2)}<br/>
        <b># of Near By Subways (<1km):</b> ${row.subway_count}<br/>
        <b># of Near By Tourism Spot (<1km):</b> ${row.tourist_count}<br/>
        `);
        listingMarkers.addLayer(marker);
      });
    }

    map.addLayer(listingMarkers);
  };

  return (
    <div className="pane">
      <div className="header">Listing Distribution Map</div>
      {data.length === 0 ? (
        <Loading />
      ) : (
        <div id={props.chartName} className="h-full w-full" />
      )}
    </div>
  );
}
