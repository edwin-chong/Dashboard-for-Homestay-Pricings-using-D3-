import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="flex gap-2">
      <div className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2">
        <Link to="/">Tenant</Link>
      </div>
      <div className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2">
        <Link to="/owner">Owner</Link>
      </div>
      <div className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2">
        <Link to="/amenity">Amenity</Link>
      </div>
      <div className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2">
        <Link to="/map">Map</Link>
      </div>
    </div>
  );
}
