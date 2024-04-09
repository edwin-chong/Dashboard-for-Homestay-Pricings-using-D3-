import * as d3 from "d3";

export const getData = () =>
  d3
    .csv("./clean_data_with_kw.csv", (row) => {
      return {
        list_id: row.id,
        name: row.name,

        // Host columns
        host_id: row.host_id,
        host_identity_verified: row.host_identity_verified,
        host_is_superhost: row.host_is_superhost,

        // Listing columns
        price: +row.price.replace("$",''),
        latitude: row.latitude,
        longitude: row.longitude,
        property_type: row.property_type,
        room_type: row.room_type,
        accommodates: +row.accommodates,
        bathrooms: +row.bathrooms_text,
        bedrooms: +row.bedrooms,
        beds: +row.beds,
        number_of_reviews: +row.number_of_reviews,
        review_rating: +row.review_scores_rating,
        amen_count: +row.amenities_count,
        subway_count: +row.nearby_subway,
        tourist_count: +row.nearby_tourist,
        picture_url: row.picture_url,

        // Amenities
        wifi: row.wifi,
        smoke_alarm: row["smoke alarm"], 
        heating: row["heating"],
        kitchen: row["kitchen"],
        tv: row["tv"],
        dryer: row["dryer"],
        air_conditioning: row["air conditioning"],
        hot_water: row["hot water"],
        iron: row["iron"],
        refrigerator: row["refrigerator"],
        shampoo: row["shampoo"],
        coffee: row["coffee"],
        washer: row["washer"],
        dedicated_workspace: row["dedicated workspace"],
        oven: row["oven"],
        fire_extinguisher: row["fire extinguisher"],
        self_check_in: row["self check-in"],
        first_aid_kit: row["first aid kit"],
        free_street_parking: row["free street parking"],
        extra_pillows_and_blankets: row["extra pillows and blankets"],
        bathtub: row["bathtub"],
        pets_allowed: row["pets allowed"],
        gym: row["gym"]
      };
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });

export const getSubway = () =>
  d3
    .csv("./clean_New_York_Subway_Stations.csv", (row) => {
      return {
        id: row.OBJECTID,
        name: row.NAME,
        line: row.LINE,
        latitude: row.lat,
        longitude: row.long,
      };
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });

export const getTourist = () =>
  d3
    .csv("./Geocoded_New_York_Tourist_Locations.csv", (row) => {
      return {
        name: row.Tourist_Spot,
        address: row.Address,
        latitude: row.latitude,
        longitude: row.longitude,
      };
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });

export const getKeywords = () =>
  d3
    .csv("./keywords_df.csv", (row) => {
      return {
        keyword: row.keyword,
        count: +row.count,
      };
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });

export const getHost = () =>
  d3
    .csv("./host_data.csv", (row) => {
      return {
        host_id: row.host_id,
        host_since: row.host_since,
        host_verifications: row.host_verifications.length > 0,
        listing_count: +row.host_total_listings_count,
        is_superhost: row.host_is_superhost == "t",
        response_rate: +row.host_response_rate.replace("%", ""),
        neighbourhood: row.neighbourhood,
      };
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
