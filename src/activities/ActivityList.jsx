// Link changes the URL without refreshing the whole page
import { Link } from "react-router";

export default function ActivityList({ activities, syncActivities }) {
  return (
    <ul>
      {activities.map((activity) => (
        <ActivityListItem key={activity.id} activity={activity} />
      ))}
    </ul>
  );
}

function ActivityListItem({ activity }) {
  return (
    <li>
      {/* Clicking the name goes to that activity's own page e.g. "/activities/5" */}
      <Link to={`/activities/${activity.id}`}>{activity.name}</Link>
    </li>
  );
}
