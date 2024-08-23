import { data } from "../utils/districts.js";
import { errorHandler } from '../utils/error.js';
export const getDistrict = async (req, res, next) => {
  try {
    const districts = data.map((item) => item.districtName);
    res.json(districts);
  } catch (error) {
    next(error);
  }
}; 

export const getConstin = async (req, res, next) => {
  const { districtName } = req.query;

  const district = data.find((d) => d.districtName === districtName);

  if (district) {
    res.json({ mandals: district.constituencies });
  } else {
    next(errorHandler(400,"Please Select District"))
  }
};
