import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AdvertisementList() {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default"); // Default sort option
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch advertisements on component mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get("http://localhost:5185/api/advertisements");
        setAds(response.data || []);
        setFilteredAds(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching advertisements:", err);
        setError("Failed to load advertisements. Please try again.");
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Handle search and sorting
  useEffect(() => {
    let filtered = ads.filter((ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    // Sort the filtered advertisements based on the sortOption
    if (sortOption !== "default") {
      filtered.sort((a, b) => {
        if (sortOption === "newest-added-first") {
          const createdAtA = new Date(a.createdAt).getTime() || 0;
          const createdAtB = new Date(b.createdAt).getTime() || 0;
          return createdAtB - createdAtA; // Newest first
        } else if (sortOption === "date-new-to-old") {
          return new Date(b.date).getTime() - new Date(a.date).getTime(); // Newest date first
        } else if (sortOption === "date-old-to-new") {
          return new Date(a.date).getTime() - new Date(b.date).getTime(); // Oldest date first
        }
        return 0;
      });
    }

    setFilteredAds([...filtered]);
  }, [searchTerm, ads, sortOption]);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        await axios.delete(`http://localhost:5185/api/advertisements/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAds(ads.filter((ad) => ad.id !== id));
        setFilteredAds(filteredAds.filter((ad) => ad.id !== id));
        alert("Advertisement deleted successfully!");
      } catch (err) {
        console.error("Error deleting advertisement:", err);
        if (err.response?.status === 401 || err.message === "No token found. Please log in.") {
          localStorage.removeItem("token");
          alert("Session expired. Please log in again.");
          navigate("/login");
        } else {
          alert(err.response?.data?.message || "Failed to delete advertisement. Please try again.");
        }
      }
    }
  };

  // Handle report generation (placeholder)
  const handleGenerateReport = () => {
    console.log("Generating report for advertisements:", ads);
    alert("Report generation is not implemented yet. Check the console for advertisement data.");
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Advertisement Dashboard</h2>
        <div className="flex space-x-4">
          <Link to="/advertisements/add">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
              Add Advertisement
            </button>
          </Link>
          <button
            onClick={handleGenerateReport}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Search Bar and Sort Options */}
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search advertisements by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <div className="flex items-center space-x-2">
          <label htmlFor="sortOption" className="text-gray-600 font-medium">
            Sort By:
          </label>
          <select
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <option value="default">Default</option>
            <option value="newest-added-first">Newest Added First</option>
            <option value="date-new-to-old">Date (New to Old)</option>
            <option value="date-old-to-new">Date (Old to New)</option>
          </select>
        </div>
      </div>

      {/* Advertisements Table */}
      {filteredAds.length === 0 ? (
        <div className="text-center text-gray-600">No advertisements found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Title</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Phone Number</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Date</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Description</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.map((ad) => (
                <tr key={ad.id} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="py-9 px-4 text-gray-800">{ad.title}</td>
                  <td className="py-9 px-4 text-gray-800">{ad.number || "N/A"}</td>
                  <td className="py-9 px-4 text-gray-600">
                    {ad.date ? new Date(ad.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-9 px-4 text-gray-600">{ad.description}</td>
                  <td className="py-9 px-4 flex space-x-2">
                    <Link to={`/advertisements/update/${ad.id}`}>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg shadow-sm transition duration-300">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg shadow-sm transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdvertisementList;