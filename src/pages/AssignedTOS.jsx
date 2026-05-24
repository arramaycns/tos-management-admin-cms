import Skeleton from "../layouts/Skeleton.jsx";
import Header from "../components/Header.jsx";
import SideNavigation from "../components/SideNavigation.jsx";
import TOSCoursesTable from "../components/TOSCoursesTable.jsx";
import { useAuth } from "../context/AuthContext";

const TOS = ({}) => {
    const { user } = useAuth();

    return (
        <Skeleton
            header={<Header role="Instructor" name={user?.name || "NORTON, MONICA"}  />}
            content={<TOSCoursesTable />}
            nav={<SideNavigation/> }
        />
    )
}
export default TOS;
