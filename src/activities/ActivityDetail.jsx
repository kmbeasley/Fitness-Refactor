import { useState, useEffect } from "react";

// useParams reads the id out of the URL
// useNavigate lets us send the user to another page after deleting
import { useParams, useNavigate } from "react-router";

import { useAuth } from "../auth/AuthContext";

const API = import.meta.env.VITE_API;

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // When this page loads, go fetch the activity data from the API using the id from the URL
  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch(`${API}/activities/${id}`);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch activity.");
        setActivity(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, [id]);

  // When the user clicks Delete, send a DELETE request to the API then go back home
  async function handleDelete() {
    setDeleteError(null);
    try {
      const response = await fetch(`${API}/activities/${id}`, {
        method: "DELETE",
        // Send the token so the API knows this user is allowed to delete
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete activity.");
      }
      // Delete worked — send the user back to the activities list
      navigate("/");
    } catch (err) {
      setDeleteError(err.message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!activity) return null;

  return (
    <section>
      <h2>{activity.name}</h2>
      <p>{activity.description}</p>
      <p>
        <strong>Created by:</strong> {activity.creatorName}
      </p>
      {deleteError && <p role="alert">{deleteError}</p>}
      {/* Only show the delete button if the user is logged in */}
      {token && <button onClick={handleDelete}>Delete Activity</button>}
    </section>
  );
}
