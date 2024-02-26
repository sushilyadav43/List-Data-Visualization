import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Space, Select, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import './UserTable.css';
import Charts from '../../Charts/Charts';

const { Search, Text } = Input;
const { Option } = Select;

const UserTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    zone: '',
    device_brand: '',
    vehicle_brand: '',
    vehicle_cc: '',
    sdk_int: '',
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchData = async () => {
    try {
      // Check if data is present in localStorage
      const cachedData = localStorage.getItem('userListData');

      if (cachedData) {
        setData(JSON.parse(cachedData));
      } else {
        const response = await axios.get('http://20.121.141.248:5000/assignment/feb/sde_fe');
        setData(response.data.data);

        // Cache the fetched data in localStorage
        localStorage.setItem('userListData', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const searchCondition = item.username.toLowerCase().includes(searchTerm.toLowerCase());
      const filterCondition = Object.keys(filter).every((key) => !filter[key] || item[key] === filter[key]);
      return searchCondition && filterCondition;
    });

    setFilteredData(filtered);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [data, searchTerm, filter]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleFilter = (category, value) => {
    setFilter({ ...filter, [category]: value });
  };

  const clearFilters = () => {
    setFilter({
      zone: '',
      device_brand: '',
      vehicle_brand: '',
      vehicle_cc: '',
      sdk_int: '',
    });
  };

  const columns = [
    { title: 'Name', dataIndex: 'username', key: 'username' },
    { title: 'Zone', dataIndex: 'zone', key: 'zone' },
    { title: 'Device Brand', dataIndex: 'device_brand', key: 'device_brand' },
    { title: 'SDK Version', dataIndex: 'sdk_int', key: 'sdk_int' },
    { title: 'Vehicle Brand', dataIndex: 'vehicle_brand', key: 'vehicle_brand' },
    { title: 'Vehicle CC', dataIndex: 'vehicle_cc', key: 'vehicle_cc' },
  ];

  const csvData = filteredData.map((item) => ({
    Name: item.name,
    Zone: item.zone,
    'Device Brand': item.device_brand,
    'SDK Version': item.sdk_int,
    'Vehicle Brand': item.vehicle_brand,
    'Vehicle CC': item.vehicle_cc,
  }));

  return (
    <div className="user-list-container">
      <div className="header">
        <h3>Data Visualization Dashboard</h3>
      </div>
      <Space className="filter-bar" direction="vertical">
        <Search placeholder="Search by name" onChange={(e) => setSearchTerm(e.target.value)} />
        <div className="filter-buttons">
          <Space>
            <Typography.Text>Filter by Zone:</Typography.Text>
            <Select
              style={{ width: '200px' }}
              placeholder="Select Zone"
              onChange={(value) => handleFilter('zone', value)}
              value={filter.zone}
            >
              {[...new Set(data.map((item) => item.zone))].map((zone) => (
                <Option key={zone} value={zone}>
                  {zone}
                </Option>
              ))}
            </Select>
          </Space>
          <Space>
            <Typography.Text>Filter by Device Brand:</Typography.Text>
            <Select
              style={{ width: '200px' }}
              placeholder="Select Device Brand"
              onChange={(value) => handleFilter('device_brand', value)}
              value={filter.device_brand}
            >
              {[...new Set(data.map((item) => item.device_brand))].map((deviceBrand) => (
                <Option key={deviceBrand} value={deviceBrand}>
                  {deviceBrand}
                </Option>
              ))}
            </Select>
          </Space>
          <Space>
            <Typography.Text>Filter by Vehicle Brand:</Typography.Text>
            <Select
              style={{ width: '200px' }}
              placeholder="Select Vehicle Brand"
              onChange={(value) => handleFilter('vehicle_brand', value)}
              value={filter.vehicle_brand}
            >
              {[...new Set(data.map((item) => item.vehicle_brand))].map((vehicleBrand) => (
                <Option key={vehicleBrand} value={vehicleBrand}>
                  {vehicleBrand}
                </Option>
              ))}
            </Select>
          </Space>
          <Space>
            <Typography.Text>Filter by Vehicle CC:</Typography.Text>
            <Select
              style={{ width: '200px' }}
              placeholder="Select Vehicle CC"
              onChange={(value) => handleFilter('vehicle_cc', value)}
              value={filter.vehicle_cc}
            >
              {[...new Set(data.map((item) => item.vehicle_cc))].map((vehicleCC) => (
                <Option key={vehicleCC} value={vehicleCC}>
                  {vehicleCC}
                </Option>
              ))}
            </Select>
          </Space>
          <Space>
            <Typography.Text>Filter by SDK Version:</Typography.Text>
            <Select
              style={{ width: '200px' }}
              placeholder="Select SDK Version"
              onChange={(value) => handleFilter('sdk_int', value)}
              value={filter.sdk_int}
            >
              {[...new Set(data.map((item) => item.sdk_int))].map((sdkVersion) => (
                <Option key={sdkVersion} value={sdkVersion}>
                  {sdkVersion}
                </Option>
              ))}
            </Select>
          </Space>
          {/* ... (Other filter components) */}
        </div>
        <Button type="primary" className="clear-filters-button" onClick={clearFilters}>
          Clear Filters
        </Button>
      </Space>
      <div className="table-container">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{
            ...pagination,
            showTotal: (total) => `Total ${total} items`,
          }}
          onChange={handleTableChange}
        />
      </div>
      <Button type="primary" icon={<DownloadOutlined />} className="download-button">
        <CSVLink data={csvData} filename={'user_list.csv'}>
          Download CSV
        </CSVLink>
      </Button>
      <Charts userlistData={data} selectedZone={filter.zone} />
    </div>
  );
};

export default UserTable;
