// statistic_data_apis.js
import axios from 'axios';

// API call to insert data into Statistic_data
export const insertStatisticData = async (data) => {
  try {
    const response = await axios.post('/api/statistic-data', data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

// API call to update the Religious_bkg field in User_records
export const updateReligiousBkg = async (user_id, religious_bkg) => {
  try {
    const response = await axios.patch(`/api/user-records/${user_id}`, { Religious_bkg: religious_bkg });
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
